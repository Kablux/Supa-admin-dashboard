import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  INCOME_CARDS,
  EARNING_DATA_YEARLY,
  RECENT_TRANSACTIONS,
  BALANCES,
  MICRO_STATS,
  EARNING_DATA_MONTHLY,
  EARNING_DATA_WEEKLY,
} from "../../data/transactionMockData";
import {
  TransactionState,
  EarningTab,
  EarningPeriod,
} from "../../types/transaction";

const initialState: TransactionState = {
  incomeCards: INCOME_CARDS,
  earningData: EARNING_DATA_YEARLY,
  activeEarningTab: "wallet",
  activeEarningPeriod: "yearly",
  recentTransactions: RECENT_TRANSACTIONS,
  balances: BALANCES,
  //   paymentCards:        PAYMENT_CARDS,
  microStats: MICRO_STATS,
  status: "succeeded",
};

const PERIOD_MAP = {
  yearly: EARNING_DATA_YEARLY,
  monthly: EARNING_DATA_MONTHLY,
  weekly: EARNING_DATA_WEEKLY,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setEarningTab(state, action: PayloadAction<EarningTab>) {
      state.activeEarningTab = action.payload;
    },
    setEarningPeriod(state, action: PayloadAction<EarningPeriod>) {
      state.activeEarningPeriod = action.payload;
      state.earningData = PERIOD_MAP[action.payload];
    },
    // toggleCard(state, action: PayloadAction<string>) {
    //   state.paymentCards = state.paymentCards.map(c =>
    //     ({ ...c, active: c.id === action.payload })
    //   );
    // },
  },
});

export const { setEarningTab, setEarningPeriod } = transactionSlice.actions;
export default transactionSlice.reducer;
