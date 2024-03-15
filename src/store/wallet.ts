import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Wallet {
  balances: { [symbol: string]: number };
  user?: User;
}

const initialState: Wallet = {
  balances: {},
  user: undefined,
};

export const walletSlice = createSlice({
  name: "walletSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setBalance: (
      state,
      action: PayloadAction<{ symbol: string; balance: number }>
    ) => {
      state.balances[action.payload.symbol] = action.payload.balance;
    },
  },
});

export const { setBalance, setUser } = walletSlice.actions;

export default walletSlice.reducer;
