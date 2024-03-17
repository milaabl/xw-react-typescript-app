import config, { presaleStartTime } from "../config";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import {
  setSaleStatus,
  setTokenPrice,
  // setTotalTokensforSale,
  setTotalTokensSold,
} from "../store/presale";
import { useEffect, useMemo, useState } from "react";
import {
  /*BaseError,*/
  useAccount,
  useConfig,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import /*wallet,*/ { setBalance } from "../store/wallet";
import { toast } from "react-toastify";

import {
  // createPublicClient,
  formatUnits,
  getContract,
  // http,
  parseUnits,
  zeroAddress,
  erc20Abi,
  ContractFunctionExecutionError
} from "viem";
import { presaleAbi } from "../contracts/presaleABI";
import { storeReferralTransaction, storeTransaction } from "../utils/apis";
import dayjs from "dayjs";

/*const publicClient = createPublicClient({
  chain: config.chains[0],
  transport: http(),
  batch: { multicall: true },
});*/

const useWeb3Functions = () => {
  const network = useConfig();

  const chain = useMemo(() => {
    return network.chains[0];
  }, [network.chains]);

  const [loading, setLoading] = useState(false);
  const tokens = useSelector((state: RootState) => state.presale.tokens);
  const dispatch = useDispatch();
  const provider = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const presaleContract = useMemo(
    () =>
      publicClient && getContract({
        address: config.presaleContract[chain.id],
        abi: presaleAbi,
        client: { wallet: walletClient, public: publicClient},
      }),
    [address, publicClient, walletClient, chain.id]
  );

  useEffect(() => {
    fetchIntialData();
  }, [presaleContract]);

  const fetchIntialData = async () => {
    // console.log('Fethcing initial data...')
    setLoading(true);

    // console.log(presaleContract)

    const [saleStatus] = await Promise.all([
      presaleContract?.read.saleStatus(),
      fetchTotalTokensSold(),
      fetchTokenPrices(),
    ]);

    saleStatus && dispatch(setSaleStatus(saleStatus));

    setLoading(false);
  };

  const fetchTotalTokensSold = async () => {
    if (!presaleContract) return;

    let extraAmount = 0;
    let incrase = 0;

    const totalTokensSold = await presaleContract.read.totalTokensSold();

    try {
      const resposne = await fetch("/settings.json");
      const settings = await resposne.json();
      extraAmount = settings?.x;
      incrase = settings?.y;
      // eslint-disable-next-line no-empty
    } catch (e) {}

    const amount = +format(totalTokensSold) || 0;
    const m = dayjs().diff(dayjs.unix(presaleStartTime), "minute");

    const ext = amount + incrase * Math.floor(m / 10);
    let total = (amount < ext ? ext : amount) + extraAmount;
    total = total > config.stage.total ? config.stage.total : total;
    dispatch(setTotalTokensSold(total));
  };

  const fetchLockedBalance = async () => {
    if (!address) return;

    const { symbol, decimals } = config.saleToken[chain.id];
    const [buyersDetails, remainingRewards] = await Promise.all([
      presaleContract?.read.buyersDetails([address]),
      presaleContract?.read.getBuyerReward([address]),
    ]);

    if (!buyersDetails || !remainingRewards) return;

    const amount = buyersDetails[0] + buyersDetails[3] + remainingRewards;
    const balance = +formatUnits(amount, decimals);

    dispatch(setBalance({ symbol: symbol, balance }));
  };

  const fetchTokenBalances = async () => {
    if (!address || !tokens[chain.id] || !publicClient) return;

    const allTokens = [...tokens[chain.id], config.saleToken[chain.id]];

    const balances = await Promise.all(
      allTokens.map(async (token) => {
        if (token.address) {
          const balance1 = await publicClient.readContract({
            address: token.address,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
          });

          return balance1;
        } else {
          return provider?.getBalance({ address });
        }
      })
    );
  
    interface Token {
      symbol: string;
      decimals: number;
    }

    allTokens.forEach((token: Token, index) => {
      dispatch(
        setBalance({
          symbol: token.symbol,
          balance: +formatUnits(balances[index] ? BigInt(balances[index] || 0) : BigInt(0), token.decimals),
        })
      );
    });
  };

  const fetchTokenPrices = async () => {
    if (!presaleContract) return;
  
    const prices = await Promise.all(
      tokens[chain.id].map((token) => {
        if (token.address) {
          return presaleContract.read.tokenPrices([token.address]);
        } else {
          return presaleContract.read.rate();
        }
      })
    );

    // console.log({prices})

    tokens[chain.id].forEach((token, index) => {
      dispatch(
        setTokenPrice({
          symbol: token.symbol,
          price: +formatUnits(prices[index], token.decimals),
        })
      );

    });
  };

  const checkAllowance = async (
    token: Token,
    owner: Address,
    spender: Address,
    amount: bigint
  ) => {
    if (!publicClient || !token.address || !walletClient) return;

    const tokenContract = getContract({
      address: token.address,
      abi: erc20Abi,
      client: walletClient
    });
    const allowance = await tokenContract.read.allowance([owner, spender]);

    if (allowance < amount) {
      const hash = await tokenContract.write.approve([
        spender,
        amount,
      ]);
      await publicClient.waitForTransactionReceipt({ hash });
      toast.success("Spend approved");
    }
  };

  const buyToken = async (value: string | number, token: Token) => {
    let success = false;
    let hash;

    if (!publicClient || !walletClient || !address) return { success, txHash: hash };

    setLoading(true);

    try {
      const amount = parseUnits(`${value}`, token.decimals);

      if (token.address) {
        await checkAllowance(
          token,
          address,
          config.presaleContract[chain.id],
          amount
        );
      }

      if (!presaleContract) return;

      // console.log('Token address:', token.address);

      const { request } = await presaleContract.simulate.buyToken(
        [token.address || zeroAddress, amount],
        {
          value: token.address ? 0n : amount,
        }
      );

      hash = await walletClient.writeContract(request);

       /*const txReceipt =*/ await publicClient.waitForTransactionReceipt({ hash });

       // console.log(txReceipt.logs);

       const purchased_amount = await presaleContract.read.getTokenAmount([
         token.address || zeroAddress,
         amount,
       ]);

       storeTransaction({
         wallet_address: address,
         purchased_amount: +format(purchased_amount),
         paid_amount: value,
         transaction_hash: hash,
         paid_with: token.symbol,
         chain: chain.id,
       });

       storeReferralTransaction({
         purchased_amount: +format(purchased_amount),
         paid: value,
         transaction_hash: hash,
         payable_token: token.symbol,
         chain: chain.id,
       });

      fetchTokenBalances();
      fetchLockedBalance();
      fetchTotalTokensSold();

      toast.success(
        `You have successfully purchased $${
          config.saleToken[chain.id].symbol
        } Tokens. Thank you!`
      );

      success = true;
    } catch (error: unknown) {
      if (error instanceof ContractFunctionExecutionError) {
        toast.error(
          String(error?.walk?.()?.cause) ||
            error?.walk?.()?.message ||
            error?.message ||
            "Signing failed, please try again!"
        );
      }
    }

    setLoading(false);

    return { success, txHash: hash };
  };

  const unlockingTokens = async () => {
    if (!publicClient || !walletClient || !presaleContract) return;

    setLoading(true);

    try {
      const { request } = await presaleContract.simulate.unlockToken();
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      fetchLockedBalance();

      toast.success("Tokens unlocked successfully");
    } catch (error: unknown) {
      if (error instanceof ContractFunctionExecutionError) {
        toast.error(
          String(error?.walk?.()?.cause) ||
            error?.walk?.()?.message ||
            error?.message ||
            "Signing failed, please try again!"
        );
      }
    }

    setLoading(false);
  };

  const addTokenAsset = async (token: Token) => {
    if (!token.address || !walletClient) return;
    try {
      await walletClient.watchAsset({
        type: "ERC20",
        options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals ?? 18,
            image: token.image.includes("http")
              ? token.image
              : `${window.location.origin}${token.image}`,
          }
      });
      toast.success("Token imported to metamask successfully");
    } catch (e) {
      toast.error("Token import failed");
    }
  };

  const parse = (value: string | number) =>
    parseUnits(`${value}`, config.saleToken[chain.id].decimals);

  const format = (value: bigint) =>
    formatUnits(value, config.saleToken[chain.id].decimals);

  return {
    loading,
    parse,
    format,
    buyToken,
    addTokenAsset,
    fetchTokenPrices,
    fetchIntialData,
    unlockingTokens,
    fetchLockedBalance,
    fetchTokenBalances,
  };
};

export default useWeb3Functions;
