import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import config from "../config";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount,useBlockNumber,useClient,useConfig,/*, useSwitchChain*/ 
useWalletClient,
useWriteContract} from "wagmi";
import useWeb3Functions from "../hooks/useWeb3Functions";
import Loading from "./Loading";
import { setCurrentChain } from "../store/presale";
import { useTranslation } from "react-i18next";
import { ReferralModal /*, ReferralModalTarget*/ } from "./ReferralModal";
import { getContract, parseEther } from "viem";
import { getWalletClient, waitForTransactionReceipt } from "@wagmi/core";
// import DownArrowIcon from "/src/assets/svg/down-arrow.svg";

const BuyForm = () => {
  const { t } = useTranslation();
  const { chain } = useAccount();
  // const { switchChain } = useSwitchChain();
  const dispatch = useDispatch();
  const chainId = useSelector((state: RootState) => state.presale.chainId);
  const tokens = useSelector((state: RootState) => state.presale.tokens);
  const balances = useSelector((state: RootState) => state.wallet.balances);
  const tokenPrices = useSelector((state: RootState) => state.presale.prices);
  const saleStatus = useSelector(
    (state: RootState) => state.presale.saleStatus
  );
  const totalTokensSold = useSelector(
    (state: RootState) => state.presale.totalTokensSold
  );
  const totalTokensForSale = config.stage.total;

  const tokenBalance = useSelector((state: RootState) => state.wallet.balances);
  const saleToken = config.saleToken;

  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  // const ToggleReferral = () => setIsReferralModalOpen(!isReferralModalOpen);

  const [fromToken, setFromToken] = useState<Token>(tokens[chainId][0]);
  const [toToken/*, setToToken*/] = useState<Token>(
    saleToken[chainId as ChainId] as Token
  );

  const [fromValue, setFromValue] = useState<string | number>("");
  const [toValue, setToValue] = useState<string | number>("");

  const {
    buyToken,
    fetchIntialData,
    fetchLockedBalance,
    fetchTokenBalances,
    unlockingTokens,
    loading,
  } = useWeb3Functions();

  const { open } = useWeb3Modal(); 

  const { address, isConnected } = useAccount();

  const tokenPrice = useMemo(
    () => tokenPrices[config.displayPrice[chainId]] || 0,
    [tokenPrices]
  );

  const walletClient = useWalletClient();

  const uniswapABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH9","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMinimum","type":"uint256"}],"internalType":"struct ISwapRouter.ExactInputParams","name":"params","type":"tuple"}],"name":"exactInput","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMinimum","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct ISwapRouter.ExactInputSingleParams","name":"params","type":"tuple"}],"name":"exactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct ISwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct ISwapRouter.ExactOutputSingleParams","name":"params","type":"tuple"}],"name":"exactOutputSingle","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"refundETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowed","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowedIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"sweepToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"feeBips","type":"uint256"},{"internalType":"address","name":"feeRecipient","type":"address"}],"name":"sweepTokenWithFee","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"int256","name":"amount0Delta","type":"int256"},{"internalType":"int256","name":"amount1Delta","type":"int256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"uniswapV3SwapCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"unwrapWETH9","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"feeBips","type":"uint256"},{"internalType":"address","name":"feeRecipient","type":"address"}],"name":"unwrapWETH9WithFee","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}] as const;

  const wethABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}] as const;

  const block = useBlockNumber();

  const wethAddress = `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2`;

  const uniswapV2RouterAddress = `0xE592427A0AEce92De3Edee1F18E0157C05861564`;

  // swap Ether for USDT on Uniswap V3 (needed for testing)
  const { writeContractAsync } = useWriteContract();

  const clientConfig = useConfig();

  let boughtUSDT = false;

  useEffect(() => {
    if(!block.data || !walletClient.data?.account || boughtUSDT) return;

    boughtUSDT = true;

    console.log('Buying');

    (async function() {
      writeContractAsync({
        address: wethAddress,
        abi: wethABI,
        functionName: 'deposit',
        value: parseEther('1')
      }, {
        onSuccess: async (txHash) => {
          waitForTransactionReceipt(clientConfig, { hash: txHash }).then(() => {
            writeContractAsync({
              address: wethAddress,
              abi: wethABI,
              functionName: 'approve',
              args: [uniswapV2RouterAddress, parseEther('1')]
            }).then((txHash2) => waitForTransactionReceipt(clientConfig, { hash: txHash2 }).then(() => {
              writeContractAsync({
                address: uniswapV2RouterAddress,
                abi: uniswapABI,
                functionName: 'exactInputSingle',
                args: [{
                  tokenIn: wethAddress,
                  tokenOut: `0xdAC17F958D2ee523a2206206994597C13D831ec7`,
                  amountIn: parseEther(`10`),
                  sqrtPriceLimitX96: BigInt(0),
                  fee: 3000,
                  recipient: walletClient.data.account.address,
                  deadline: block.data + BigInt(1_00000000000000000),
                  amountOutMinimum: BigInt(0)
                }]
              });
            }))   
          });
        }
      });
    })();
  }, [block.data, walletClient.data]);

  const soldPercentage = useMemo(
    () =>
      totalTokensForSale ? (totalTokensSold / totalTokensForSale) * 100 : 0,
    [totalTokensSold, totalTokensForSale]
  );

  const fixedNumber = (num: number, decimals = 6) =>
    +parseFloat((+num).toFixed(decimals));

  const formatNumber = (num: number) =>
    Intl.NumberFormat().format(fixedNumber(num, 2));

  const lockedToken = useMemo(
    () => formatNumber(balances[toToken.symbol]),
    [balances]
  );

  const insufficientBalance = useMemo(() => {
    if (!fromValue) return false;
    return +fromValue > tokenBalance[fromToken.symbol];
  }, [fromValue, tokenBalance]);

  const fromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      emptyValues();
      return;
    }

    setFromValue(fixedNumber(+value));
    if (tokenPrices[fromToken.symbol] !== 0) {
      setToValue(fixedNumber(+value / tokenPrices[fromToken.symbol], 4));
    }
  };

  const toValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      emptyValues();
      return;
    }

    setToValue(fixedNumber(+value, 4));
    if (tokenPrices[fromToken.symbol] !== 0) {
      setFromValue(fixedNumber(+value * tokenPrices[fromToken.symbol]));
    }
  };

  const emptyValues = () => {
    setFromValue("");
    setToValue("");
  };

  const onSubmit = async (event: SyntheticEvent) => {
    try {
      if (saleStatus) {
        if (+fromValue === 0) return;

        await buyToken(fromValue, fromToken);
        emptyValues();
        window.gtag('event', 'conversion', { event_category: 'conversion',
              event_label: 'buy token'})
      } else {
        await unlockingTokens();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!address || !chain) return;
    fetchLockedBalance();
    fetchTokenBalances();
  }, [address]);

  useEffect(() => {
    if (!isConnected || !chain) return;
    
    dispatch(setCurrentChain(chain.id as number));
  }, [isConnected]);

  useEffect(() => {
    fetchIntialData();
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-lg self-stretch rounded-3xl bg-blur  shadow-xl" >
      {loading && <Loading className="z-50 rounded-3xl" />}
      <div className="flex flex-col items-center justify-center rounded-t-3xl px-6 py-4 text-white">
        {saleStatus ? (
          <>
            <div className="mb-2 mt-1 w-full">
              <p className="mb-8 text-center text-2xl font-bold text-[#FFD700] drop-shadow-xl">
                XUIRIN Presale <br /> Stage 1
              </p>
              <div className="relative mb-2 h-7 overflow-hidden rounded-full border border-gray-400 bg-transparent">
                <div className="absolute inset-0 flex h-full w-full items-center justify-center font-semibold uppercase text-black">
                  <span >NEXT STAGE PRICE INCREASING</span>
                </div>
                <div
                  className="h-full w-full bg-[#FFD700]"
                  style={{
                    width: soldPercentage + "%",
                  }}
                ></div>
              </div>
              <div className="text-center">
                {parseInt(`${totalTokensSold}`).toLocaleString()}{" "}
                <span className="text-[#FFD700]">{saleToken[chainId].symbol}</span> /{" "}
                {totalTokensForSale.toLocaleString()}{" "}
                <span className="text-[#FFD700]">{saleToken[chainId].symbol}</span>
              </div>
            </div>
            {/* <p className="mb-2 text-center text-xl font-bold">
              🚧 DAILY HOLDING BONUS 0.5%  🚧
                </p> */}
          </>
        ) : (
          <p className="my-2 text-xl font-bold">Unlocking your tokens</p>
        )}
      </div>
      <form className="mb-4 flex flex-col gap-3 px-4">
        <div className="relative mt-2 mb-4 flex flex-col items-center justify-center">
          <hr className="absolute top-1 h-0.5 w-full bg-gray-400" />
          <span className="z-10 -mt-2 bg-[#42474B] px-4 font-bold text-white">
            <s>1 ${saleToken[chainId].symbol} = $0.15</s> | 1{" "}
            {saleToken[chainId].symbol} ={" "}
            <span className="text-[#FFD700]"> $0.03</span>
          </span>
        </div>

        {saleStatus && (
          <>
            <div className="grid grid-cols-2 gap-x-3 gap-y-4"> 
              {tokens[chainId].map((token) => (
                <button
                  key={token.symbol}
                  type="button"
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 py-4 px-2 text-white transition-opacity duration-200 hover:opacity-75 ${
                    fromToken.symbol === token.symbol
                      ? "border-[#FFD700]"
                      : "border-[#A4A7AA]"
                  }`}
                  onClick={() => setFromToken(token)}
                >
                  <img
                    src={token.image}
                    alt={token.symbol}
                    className="h-6 w-6 object-contain"
                  />
                  <span className="text-sm font-semibold">{token.symbol}</span>
                </button>
              ))}
              <div></div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white">
                  <span className="font-bold tracking-widest">
                    {fromToken.symbol}
                  </span>{" "}
                  {t("you-pay")}
                </label>
                <div
                  className={`flex w-full overflow-hidden rounded-lg border-2 border-gray-300 text-xl ring-4 ring-transparent focus-within:border-yellow-500/50 focus-within:ring-yellow-500/20 ${
                    insufficientBalance
                      ? "!border-red-500/50 !text-red-400 !ring-red-500/20"
                      : ""
                  }`}
                >
                  <input
                    className="w-0 flex-1 bg-transparent py-3 px-3 outline-none text-white"
                    type="number"
                    min={0}
                    step={0.00001}
                    placeholder="0.0"
                    value={fromValue}
                    onChange={fromValueChange}
                  />
                  <div className="flex items-center justify-center px-4">
                    <img
                      src={fromToken.image}
                      alt={fromToken.name}
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                </div>
                {insufficientBalance && (
                  <p className="text-sm text-red-500">
                    {t(
                      "oops-it-looks-like-you-dont-have-enough-fromtoken-symbol-to-pay-for-that-transaction-please-reduce-the-amount-of-fromtoken-symbol-and-try-again",
                      {
                        0: fromToken.symbol, // interpolation for {{0}}
                        1: fromToken.symbol // interpolation for {{1}}
                      }
                    )}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white">
                  <span className="font-bold tracking-widest">
                    {toToken.symbol}
                  </span>{" "}
                  {t("you-receive")}
                </label>
                <div
                  className={`flex w-full overflow-hidden rounded-xl border-2 border-gray-300 text-xl ring-4 ring-transparent focus-within:border-yellow-500/50 focus-within:ring-yellow-500/20 ${
                    insufficientBalance
                      ? "!border-red-500/50 !text-red-400 !ring-red-500/20"
                      : ""
                  }`}
                >
                  <input
                    className="w-0 flex-1 bg-transparent py-3 px-3 outline-none text-white"
                    type="number"
                    min={0}
                    step={0.00001}
                    placeholder="0.0"
                    value={toValue}
                    onChange={toValueChange}
                  />
                  <div className="flex items-center justify-center  px-4">
                    <img
                      src={toToken.image}
                      alt={toToken.name}
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                </div>
              </div>
              {isConnected ? (
                <>
                  <p className="col-span-2 border-y py-4 text-center text-sm font-medium uppercase text-white">
                    YOUR AMOUNT {lockedToken} $
                    {saleToken[chainId].symbol} Locked{" "}
                  </p>
                  <button
                    className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFD700] py-3 px-6 text-lg  btn-green transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:from-gray-400 disabled:opacity-80 lg:text-xl"
                    disabled={loading || insufficientBalance}
                    type="submit"
                    onClick={(e: SyntheticEvent<HTMLButtonElement>)=>{ window.gtag('event', 'BuyClick', { event_category: 'button',
                    event_label: 'Buy'}
                    );
                    onSubmit(e);
                  return true; }}
                  >
                    {loading && (
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5 animate-spin fill-yellow-500 text-gray-200"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    )}
                    {saleStatus
                      ? "Buy"
                      : "Unlock Tokens"}
                  </button>
                </>
              ) : (
                <button
                  className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-[#39FF14] py-3 px-6  btn-green transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
                  disabled={loading}
                  type="button"
                  onClick={() => {open(); window.gtag('event', 'ConnectButton', { event_category: 'button',
                  event_label: 'connect'}) }}
                >
                  {loading && (
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 animate-spin fill-yellow-500 text-gray-200"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                  {t("connect-wallet")}
                </button>
              )}
              <a
                className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 px-6 text-lg font-semibold text-black transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
                type="button"
                href="https://t.me/xuirin_support_bot"
                target="_blank"
              >
                Help
              </a>
              <a
                className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 px-6 text-sm font-semibold text-black transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-sm"
                type="button"
                href="https://xuirin.com/how-to-buy"
                target="_blank"
              >
                How to buy?
              </a>
              <a
                className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 px-6 text-sm font-semibold text-black transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-sm"
                type="button"
                href="https://xuirin.com/win-500k"
                target="_blank"
              >
                Win $500k
              </a>
            </div>
            {isConnected ? (
              <button
              className="flex items-center justify-center gap-5 rounded-xl border-2 border-dashed border-white/20 py-4 text-white/50 transition-all duration-200 hover:border-solid"
              type="button"
              onClick={()=>{setIsReferralModalOpen(true); window.gtag('event', 'ShowRefModal', { event_category: 'button',
              event_label: 'Show reflink'}) }}
              >
                  My 5% Referral Link
              </button>
            ):(
              <button
            className="flex items-center justify-center gap-5 rounded-xl border-2 border-dashed border-white/20 py-4 text-white/50 transition-all duration-200 hover:border-solid"
            type="button"
            onClick={() => {
              open();
              window.gtag('event', 'RefButtonConnect', { event_category: 'button',
              event_label: 'connect ref'}) }}
            >
                Connect to receive  5% referral commission
            </button>
            )}
            
            {isReferralModalOpen && <ReferralModal closeModal={()=>setIsReferralModalOpen(false)} />}
          </>
        )}
      </form>
    </div>
  );
};

export default BuyForm;
