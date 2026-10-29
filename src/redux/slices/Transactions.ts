import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTransactions, fetchTransactionAnalytic } from "../../api/xhrHelper";
import { Transaction, TransactionAnalyticsResponse, TransactionsResponse } from "../../types/common.types";

interface TransactionsState {
  items: Transaction[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalIncome: string;
  totalExpense: string;
  analytics: TransactionAnalyticsResponse | null;
  analyticsRange: "week" | "month" | "year";
  isLoading: boolean;
  isAnalyticsLoading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  totalIncome: "0",
  totalExpense: "0",
  analytics: null,
  analyticsRange: "month",
  isLoading: false,
  isAnalyticsLoading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setAnalyticsRange: (state, action: PayloadAction<"week" | "month" | "year">) => {
      state.analyticsRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<TransactionsResponse>) => {
          state.isLoading = false;
          
          // Safely extract the inner results wrapper
          const resultContainer = action.payload.results?.[0] as any;
          
          state.items = resultContainer?.results || (action.payload as any).results || [];
          state.totalCount = action.payload.count || 0;
          state.totalIncome = (action.payload as any).total_income || resultContainer?.total_income || "0";
          state.totalExpense = (action.payload as any).total_expense || resultContainer?.total_expense || "0";
        })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Analytics
      .addCase(fetchTransactionAnalytic.pending, (state) => {
        state.isAnalyticsLoading = true;
      })
      .addCase(fetchTransactionAnalytic.fulfilled, (state, action) => {
        state.isAnalyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchTransactionAnalytic.rejected, (state) => {
        state.isAnalyticsLoading = false;
      });
  },
});

export const { setCurrentPage, setPageSize, setAnalyticsRange } = transactionsSlice.actions;
export default transactionsSlice.reducer;