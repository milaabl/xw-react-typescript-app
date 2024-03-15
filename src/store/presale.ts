import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import config from "../config";

interface PresaleSlice {
  chainId: number;
  phase: number;
  tokens: { [key: number]: Token[] };
  prices: { [key: string]: number };
  totalTokensSold: number;
  totalTokensforSale: number;
  minBuyLimit: number;
  maxBuyLimit: number;
  saleStatus: boolean;
}

const initialState: PresaleSlice = {
  chainId: config.chains[0].id,
  phase: 0,
  tokens: config.whitelistedTokens,
  prices: {},
  totalTokensSold: 0,
  totalTokensforSale: 0,
  minBuyLimit: 200,
  maxBuyLimit: 50_000,
  saleStatus: true,
};

export const presaleSlice = createSlice({
  name: "presaleSlice",
  initialState,
  reducers: {
    setCurrentChain: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
    setPhase: (state, action: PayloadAction<number>) => {
      state.phase = action.payload;
    },
    setSaleStatus: (state, action: PayloadAction<boolean>) => {
      state.saleStatus = action.payload;
    },
    updateTokens: (state, action: PayloadAction<{ tokens: Token[] }>) => {
      state.tokens[state.chainId] = action.payload.tokens;
    },
    updateToken: (
      state,
      action: PayloadAction<{ index: number; token: Token }>
    ) => {
      state.tokens[state.chainId][action.payload.index] = action.payload.token;
    },
    setTokenPrice: (
      state,
      action: PayloadAction<{ symbol: string; price: number }>
    ) => {
      state.prices[action.payload.symbol] = action.payload.price;
    },
    setTotalTokensSold: (state, action: PayloadAction<number>) => {
      state.totalTokensSold = action.payload;
    },
    setTotalTokensforSale: (state, action: PayloadAction<number>) => {
      state.totalTokensforSale = action.payload;
    },
    setMinBuyLimit: (state, action: PayloadAction<number>) => {
      state.minBuyLimit = action.payload;
    },
    setMaxBuyLimit: (state, action: PayloadAction<number>) => {
      state.maxBuyLimit = action.payload;
    },
  },
});

export const {
  setPhase,
  updateToken,
  updateTokens,
  setSaleStatus,
  setTokenPrice,
  setMaxBuyLimit,
  setMinBuyLimit,
  setCurrentChain,
  setTotalTokensSold,
  setTotalTokensforSale,
} = presaleSlice.actions;

export default presaleSlice.reducer;
