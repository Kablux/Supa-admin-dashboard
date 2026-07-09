import {
  IncomeCard,
  EarningDataPoint,
  RecentTransaction,
  BalanceCard,
  PaymentCard,
  MicroStat,
} from "../types/transaction";

export const INCOME_CARDS: IncomeCard[] = [
  {
    id: "corporate",
    label: "corporate",
    amount: 900.0,
    trend: -1.9,
    comparedAmount: 986.0,
    lastWeekIncome: 1000000000.0,
    accentColor: "#F5C518",
  },
  {
    id: "fleet",
    label: "Fleet",
    amount: 900.0,
    trend: 1.5,
    comparedAmount: 986.0,
    lastWeekIncome: 1000000000.0,
    accentColor: "#F5C518",
  },
  {
    id: "luxury",
    label: "Luxury",
    amount: 900.0,
    trend: 1.5,
    comparedAmount: 986.0,
    lastWeekIncome: 1000000000.0,
    accentColor: "#F5C518",
  },
];

export const EARNING_DATA_YEARLY: EarningDataPoint[] = [
  { x: 1, value: 20000 },
  { x: 2, value: 35000 },
  { x: 3, value: 28000 },
  { x: 4, value: 82000 },
  { x: 5, value: 65000 },
  { x: 6, value: 72000 },
  { x: 7, value: 88000 },
  { x: 8, value: 95000 },
];

export const EARNING_DATA_MONTHLY: EarningDataPoint[] = [
  { x: 1, value: 12000 },
  { x: 2, value: 19000 },
  { x: 3, value: 15000 },
  { x: 4, value: 42000 },
  { x: 5, value: 38000 },
  { x: 6, value: 51000 },
  { x: 7, value: 44000 },
  { x: 8, value: 60000 },
];

export const EARNING_DATA_WEEKLY: EarningDataPoint[] = [
  { x: 1, value: 3000 },
  { x: 2, value: 5500 },
  { x: 3, value: 4200 },
  { x: 4, value: 9800 },
  { x: 5, value: 7100 },
  { x: 6, value: 8300 },
  { x: 7, value: 6900 },
  { x: 8, value: 11000 },
];

export const RECENT_TRANSACTIONS: RecentTransaction[] = [
  {
    id: "txn-001",
    rider: { name: "David Demo", avatar: "https://i.pravatar.cc/150?img=11" },
    type: "Standard",
    price: 3400,
    distance: "14 Shoprite Cinema Ajah",
    dateTime: "20 Dec 4:30 PM",
  },
  {
    id: "txn-002",
    rider: { name: "David Demo", avatar: "https://i.pravatar.cc/150?img=12" },
    type: "Fleet",
    price: 3400,
    distance: "14 Shoprite Cinema Ajah",
    dateTime: "20 Dec 4:30 PM",
  },
  {
    id: "txn-003",
    rider: { name: "David Demo", avatar: "https://i.pravatar.cc/150?img=13" },
    type: "Luxury",
    price: 33500,
    distance: "21 Adegbemi Street, Ikeja",
    dateTime: "20 Dec 4:30 PM",
  },
  {
    id: "txn-004",
    rider: { name: "Sarah Adeola", avatar: "https://i.pravatar.cc/150?img=47" },
    type: "Standard",
    price: 2800,
    distance: "5 Lekki Phase 1",
    dateTime: "20 Dec 3:15 PM",
  },
  {
    id: "txn-005",
    rider: { name: "Emeka Chukwu", avatar: "https://i.pravatar.cc/150?img=33" },
    type: "Fleet",
    price: 5200,
    distance: "22 Victoria Island",
    dateTime: "20 Dec 2:00 PM",
  },
];

export const BALANCES: BalanceCard[] = [
  {
    id: "corporate",
    label: "corporate Balance",
    amount: 60000,
    icon: "AccountBalanceWallet",
    iconBg: "rgba(245,197,24,0.15)",
  },
  {
    id: "fleet",
    label: "Fleet Balance",
    amount: 20000,
    icon: "LocalShipping",
    iconBg: "rgba(66,165,245,0.15)",
  },
  {
    id: "luxury",
    label: "Luxury Balance",
    amount: 3000,
    delta: 3000,
    icon: "Star",
    iconBg: "rgba(76,175,80,0.15)",
  },
];

// export const PAYMENT_CARDS: PaymentCard[] = [
//   {
//     id: "card-001",
//     bank: "Central Bank",
//     last4: "2847",
//     expiry: "06/22",
//     holder: "Albert Pucs",
//     balance: 60000,
//     active: true,
//     weeklyLimit: 4000,
//   },
//   {
//     id: "card-002",
//     bank: "Access Bank",
//     last4: "1234",
//     expiry: "09/25",
//     holder: "Moni Roy",
//     balance: 25000,
//     active: false,
//     weeklyLimit: 8000,
//   },
// ];

export const MICRO_STATS: MicroStat[] = [
  {
    id: "satisfied",
    label: "Satisfied Riders",
    value: 20,
    trend: 12,
    emoji: "😊",
    chartData: [4, 7, 5, 9, 8, 11, 14, 10, 13, 16, 12, 18],
    chartColor: "#4CAF50",
  },
  {
    id: "complaints",
    label: "Complains",
    value: 5,
    trend: -8,
    emoji: "😞",
    chartData: [12, 9, 14, 10, 8, 11, 7, 9, 6, 8, 5, 4],
    chartColor: "#EF5350",
  },
];

export const DONUT_DATA = [
  { name: "corporate", value: 23, color: "#4CAF50" },
  { name: "Fleet", value: 14, color: "#2196F3" },
  { name: "Luxury", value: 8, color: "#9C27B0" },
  { name: "Standard", value: 31, color: "#F5C518" },
  { name: "Other", value: 24, color: "#FF5722" },
];
