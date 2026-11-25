import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTransactions,
  fetchTransactionAnalytic,
  fetchPendingWithdrawalCount,
  fetchPendingApprovals,
  approveTransaction,
  rejectTransaction,
} from "../../api/xhrHelper";
import {
  Transaction,
  TransactionAnalyticsResponse,
  PendingApprovalResponse,
  TransactionDetail,
  TransactionsResponse,
} from "../../types/common.types";
import { normalizePendingRow, PENDING_APPROVAL_STATUS } from "../../components/transactions/withdrawalConfig";

export type TransactionsView = "all" | "withdrawals";

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
  view: TransactionsView;
  pendingWithdrawalCount: number;
  /** id of the transaction currently being approved/rejected, if any */
  actionInFlightId: string | null;
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
  view: "all",
  pendingWithdrawalCount: 0,
  actionInFlightId: null,
};

/** Apply the server's post-action record to local state. */
const applyResolvedTransaction = (state: TransactionsState, updated: TransactionDetail, fallbackId: string) => {
  const id = updated?.id || fallbackId;
  const wasPending = state.items.some((t) => t.id === id && t.status === PENDING_APPROVAL_STATUS);

  if (state.view === "withdrawals") {
    // The queue only shows pending items, so resolved ones leave it.
    const before = state.items.length;
    state.items = state.items.filter((t) => t.id !== id);
    if (state.items.length < before) state.totalCount = Math.max(0, state.totalCount - 1);
  } else {
    const idx = state.items.findIndex((t) => t.id === id);
    if (idx !== -1 && updated?.status) {
      state.items[idx] = { ...state.items[idx], status: updated.status };
    }
  }

  if (wasPending || state.view === "withdrawals") {
    state.pendingWithdrawalCount = Math.max(0, state.pendingWithdrawalCount - 1);
  }
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
      state.currentPage = 1;
    },
    setAnalyticsRange: (state, action: PayloadAction<"week" | "month" | "year">) => {
      state.analyticsRange = action.payload;
    },
    setTransactionsView: (state, action: PayloadAction<TransactionsView>) => {
      state.view = action.payload;
      state.currentPage = 1;
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
        // Ignore a late response if the admin has already switched to the withdrawal queue.
        if (state.view !== "all") return;
        state.isLoading = false;

        // Backend nests the page inside results[0]; tolerate a flat shape too.
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
      // Withdrawal requests queue (pending-approval endpoint)
      .addCase(fetchPendingApprovals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action: PayloadAction<PendingApprovalResponse>) => {
        if (state.view !== "withdrawals") return;
        state.isLoading = false;
        state.items = (action.payload.results || []).map(normalizePendingRow);
        state.totalCount = action.payload.count || 0;
      })
      .addCase(fetchPendingApprovals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Pending withdrawal badge
      .addCase(fetchPendingWithdrawalCount.fulfilled, (state, action) => {
        state.pendingWithdrawalCount = action.payload;
      })
      // Approve / Reject
      .addCase(approveTransaction.pending, (state, action) => {
        state.actionInFlightId = action.meta.arg;
      })
      .addCase(approveTransaction.fulfilled, (state, action) => {
        state.actionInFlightId = null;
        applyResolvedTransaction(state, action.payload, action.meta.arg);
      })
      .addCase(approveTransaction.rejected, (state) => {
        state.actionInFlightId = null;
      })
      .addCase(rejectTransaction.pending, (state, action) => {
        state.actionInFlightId = action.meta.arg.id;
      })
      .addCase(rejectTransaction.fulfilled, (state, action) => {
        state.actionInFlightId = null;
        applyResolvedTransaction(state, action.payload, action.meta.arg.id);
      })
      .addCase(rejectTransaction.rejected, (state) => {
        state.actionInFlightId = null;
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

export const { setCurrentPage, setPageSize, setAnalyticsRange, setTransactionsView } = transactionsSlice.actions;
export default transactionsSlice.reducer;
