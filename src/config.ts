import { Chain, goerli, mainnet as mainnetOriginal } from "viem/chains";

// edit to make it work with a local Hardhat Ethereum fork
const mainnet = { ...mainnetOriginal, id: 31337, rpcUrls: { default: { http: [`http://127.0.0.1:8545` ] } } } satisfies Chain;


export const chains = [mainnet, goerli] as const;

export const presaleStartTime = 1693432800;

const config = {
  chains,
  whitepaper: "",
  telegram: "",
  twitter: "",

  stage: {
    name: "Stage 1",
    total: 15_000_000, // total sale amount
  },

  presaleContract: {
    [goerli.id]: "0xa888c0c93515ef3f9e66a927dc92ca08c8f2b43c",
    [mainnet.id]: "0x733A81364479f5CA5a73c4b81E8d648e966f6D30",
  } as { [key: number]: Address }, // presale contract address

  saleToken: {
    [mainnet.id]: {
      address: "0x4dc2fA2Bf220cfF2D22658d18586251F192D75Fd", // token address
      symbol: "XUIRIN", // token symbol
      name: "Xuirin Finance", // token name
      image: "/img/tokens/xuirin.png", // token image
      decimals: 18, // token decimals
    },
    [goerli.id]: {
      address: "0xc71aac019D4d2aaD5535dC92FE58d78ae09Dc6D6", // token address
      symbol: "XXX", // token symbol
      name: "PopTok Token", // token name
      image: "/img/tokens/xuirinx.png", // token image
      decimals: 18, // token decimals
    },
  } as { [key: number]: Token },

  displayPrice: {
    [mainnet.id]: "USDT",
    [goerli.id]: "USDT",
  } as { [key: number]: string },

  whitelistedTokens: {
    [mainnet.id]: [
      {
        address: null,
        symbol: "ETH",
        name: "Ethereum",
        image:
          "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg",
        decimals: 18,
      },
      /*{
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        symbol: "USDC",
        name: "Circle USD",
        image:
          "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg",
        decimals: 6,
      },*/
      {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        symbol: "USDT",
        name: "Tether USD",
        image:
          "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdt.svg",
        decimals: 6,
      },
      /* {
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        symbol: "USDC",
        name: "USDC",
        image: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg",
        decimals: 6,
      },
      {
        address: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
        symbol: "BUSD",
        name: "BUSD",
        image: "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg",
        decimals: 18,
      },*/
    ],
    [goerli.id]: [
      {
        address: null,
        symbol: "ETH",
        name: "Ethereum",
        image: "/img/tokens/eth.png",
        decimals: 18,
      },
      {
        address: "0x053B0f6b94B74E15B0d373E7B5E47Cbe19B9d005",
        symbol: "USDT",
        name: "Tether USD",
        image: "/img/tokens/tethernew_32.webp",
        decimals: 18,
      },
    ],
  } as { [key: number]: Token[] },
};

export default config;
