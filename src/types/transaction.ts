export type IncomeCategory = "corporate" | "fleet" | "luxury";

export interface IncomeCard {
  id: IncomeCategory;
  label: string;
  amount: number;
  trend: number; // signed percentage, e.g. -1.9 or +1.5
  comparedAmount: number;
  lastWeekIncome: number;
  accentColor: string;
}

export type EarningTab = "wallet" | "card";
export type EarningPeriod = "yearly" | "monthly" | "weekly";

export interface EarningDataPoint {
  x: number; // x-axis index (1-8 in design)
  value: number; // N amount
}

export type RideType = "Standard" | "Fleet" | "Luxury";

export interface RecentTransaction {
  id: string;
  rider: {
    name: string;
    avatar: string | null;
  };
  type: RideType;
  price: number;
  distance: string;
  dateTime: string;
}

export type BalanceType = "corporate" | "fleet" | "luxury";

export interface BalanceCard {
  id: BalanceType;
  label: string;
  amount: number;
  delta?: number; // positive/negative change (optional)
  icon: string;
  iconBg: string;
}

export interface PaymentCard {
  id: string;
  bank: string;
  first4: string;
  last4: string;
  expiry: string;
  holder: string;
  balance: number;
  active: boolean;
  weeklyLimit: number;
}

export interface MicroStat {
  id: string;
  label: string;
  value: number;
  trend: number;
  emoji: string;
  chartData: number[];
  chartColor: string;
}

import type { RequestStatus } from "./auth";

export interface TransactionState {
  incomeCards: IncomeCard[];
  earningData: EarningDataPoint[];
  activeEarningTab: EarningTab;
  activeEarningPeriod: EarningPeriod;
  recentTransactions: RecentTransaction[];
  balances: BalanceCard[];
  //   paymentCards: PaymentCard[];
  microStats: MicroStat[];
  status: RequestStatus;
}
