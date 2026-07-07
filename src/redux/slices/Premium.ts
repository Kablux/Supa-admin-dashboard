import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PremiumState,
  PremiumStat,
  PremiumTransaction,
} from "../../types/common.types";

const initialState: PremiumState = {
  stats: [],
  transactions: [],
  isLoading: false,
  error: null,
};

const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    setPremiumLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setPremiumData(
      state,
      action: PayloadAction<{
        stats: PremiumStat[];
        transactions: PremiumTransaction[];
      }>
    ) {
      state.stats = action.payload.stats;
      state.transactions = action.payload.transactions;
    },

    setPremiumError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setPremiumLoading,
  setPremiumData,
  setPremiumError,
} = premiumSlice.actions;

export default premiumSlice.reducer;