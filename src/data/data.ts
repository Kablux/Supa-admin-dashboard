import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { BiTrip } from "react-icons/bi";
import { FaCarOn } from "react-icons/fa6";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { IoCarSportSharp } from "react-icons/io5";
import { VscInspect } from "react-icons/vsc";
import { MdPayment } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineSafetyCheck } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { MdOutlineFeedback } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { PiClockUserBold } from "react-icons/pi";
import { MdOutlineHelpOutline } from "react-icons/md";
import { RiEBikeFill } from "react-icons/ri";
import { VscReferences } from "react-icons/vsc";
import type {
  FinancePoint,
  MessagesData,
  NavSection,
  NotifCategory,
  PremiumTransaction,
  Shipment,
} from "../types/common.types.js";

export const navSections: NavSection[] = [
  {
    title: null,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: AiOutlineHome,
        path: "/",
      },
    ],
  },

  {
    title: null,
    items: [
      {
        id: "rider",
        label: "Rider",
        icon: MdAirlineSeatReclineNormal,
        path: "/riders",
      },
      {
        id: "driver",
        label: "Driver",
        icon: FaCarOn,
        path: "/drivers",
      },
      {
        id: "courier",
        label: "Courier",
        icon: RiEBikeFill,
        path: "/courier",
      },
      {
        id: "trip",
        label: "Trip",
        icon: BiTrip,
        path: "/trips",
      },
      {
        id: "request",
        label: "Ride Request",
        icon: PiClockUserBold,
        path: "/ride-request",
      },
      {
        id: "referrals",
        label: "Referrals",
        icon: VscReferences,
        path: "/referrals",
      },
      {
        id: "corporate",
        label: "corporate",
        icon: HiOutlineBuildingOffice,
        path: "/corporate",
      },
      {
        id: "fleet",
        label: "Fleet",
        icon: IoCarSportSharp,
        path: "/fleet",
      },
      {
        id: "premium",
        label: "Premium",
        icon: MdOutlineWorkspacePremium,
        path: "/premium",
      },
      {
        id: "inspection",
        label: "Inspection",
        icon: VscInspect,
        path: "/inspection",
      },
    ],
  },

  {
    title: "TRANSACTION",
    items: [
      {
        id: "transaction",
        label: "Transaction",
        icon: MdPayment,
        path: "/transactions",
      },
    ],
  },

  {
    title: "ADMIN",
    items: [
      {
        id: "admin_role",
        label: "Admin Role",
        icon: FaRegCircleUser,
        path: "/admin-role",
      },
    ],
  },

  {
    title: "MESSAGE",
    items: [
      {
        id: "notification",
        label: "Notification",
        icon: MdNotificationsNone,
        path: "/notifications",
      },
      {
        id: "sos",
        label: "SOS",
        icon: MdOutlineSafetyCheck,
        path: "/sos",
      },
    ],
  },

  {
    title: "TOOLS",
    items: [
      {
        id: "setting",
        label: "Setting",
        icon: MdOutlineSettings,
        path: "/settings",
      },
      {
        id: "feedback",
        label: "Feedback",
        icon: MdOutlineFeedback,
        path: "/feedback",
      },
      {
        id: "dispute",
        label: "Dispute",
        icon: HiUsers,
        path: "/dispute",
      },
      {
        id: "help",
        label: "Help",
        icon: MdOutlineHelpOutline,
        path: "/help",
      },
    ],
  },
];

export const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/riders": "Riders",
  "/riders/new": "Riders",
  "/drivers": "Drivers",
  "/trips": "Trips",
  "/corporate": "corporate",
  "/fleet": "Fleet",
  "/premium": "Premium",
  "/inspection": "Inspection",
  "/transactions": "Transactions",
  "/admin-role": "Admin Role",
  "/admin-role/create": "Create Admin Role",
  "/notifications": "Notifications",
  "/sos": "SOS",
  "/settings": "Settings",
  "/feedback": "Feedback",
  "/dispute": "Dispute",
  "/help": "Help",
};

export const quickActions = [
  {
    label: "Credit/debit a premium rider's wallet",
    icon: "AccountBalanceWallet",
    path: "/transactions",
  },
  {
    label: "Suspend/activate a driver",
    icon: "PersonOff",
    path: "/drivers",
  },
  {
    label: "Create promo code",
    icon: "LocalOffer",
    path: "/corporate",
  },
  {
    label: "Send broadcast message",
    icon: "Campaign",
    path: "/notifications",
  },
  {
    label: "Assign driver to fleet owner",
    icon: "AssignmentInd",
    path: "/fleet",
  },
];

export const messagesData: MessagesData = {
  drivers: [
    {
      id: 1,
      name: "Driver",
      plate: "123tyy, Red Camry",
      complaint: "Complain about rider",
      time: "Today",
      avatar: "D",
      read: false,
    },
    {
      id: 2,
      name: "Driver",
      plate: "123tyy, Red Camry",
      complaint: "Complain about rider",
      time: "Today",
      avatar: "D",
      read: false,
    },
    {
      id: 3,
      name: "Driver",
      plate: "XYZ456, Blue Civic",
      complaint: "Payment dispute",
      time: "2h ago",
      avatar: "D",
      read: true,
    },
    {
      id: 4,
      name: "Driver",
      plate: "ABC789, White Corolla",
      complaint: "App issue reported",
      time: "Yesterday",
      avatar: "D",
      read: true,
    },
  ],
  riders: [
    {
      id: 1,
      name: "Rider",
      plate: "Adeyemi Bola",
      complaint: "Driver was rude",
      time: "Today",
      avatar: "R",
      read: false,
    },
    {
      id: 2,
      name: "Rider",
      plate: "Chukwu Emeka",
      complaint: "Overcharged fare",
      time: "1h ago",
      avatar: "R",
      read: true,
    },
    {
      id: 3,
      name: "Rider",
      plate: "Fatima Musa",
      complaint: "Wrong route taken",
      time: "3h ago",
      avatar: "R",
      read: true,
    },
  ],
};

export const RIDER_STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Approved" },
  { key: "pending_verification", label: "Pending" },
  { key: "suspended", label: "Cancelled" },
];

export const NOTIFICATION_CATEGORY_TABS: {
  key: NotifCategory;
  label: string;
  color?: string;
}[] = [
  { key: "corporate", label: "corporate", color: "var(--accent-gold)" },
  { key: "standard", label: "Standard", color: "#EF5350" },
  { key: "premium", label: "Premium", color: "#EF5350" },
];

// premiumDummy.ts
export const premiumTransactions: PremiumTransaction[] = [
  {
    id: "1",
    rider: "David Demo",
    date: "2026-05-04",
    pickup: "Abraham Adesanya, Ajah Lagos",
    destination: "Lekki Phase 1, Lagos",
    status: "Completed",
  },
  {
    id: "2",
    rider: "Sarah Johnson",
    date: "2026-05-04",
    pickup: "Victoria Island",
    destination: "Ikoyi Lagos",
    status: "Pending",
  },
  {
    id: "3",
    rider: "Michael Brown",
    date: "2026-05-05",
    pickup: "Yaba",
    destination: "Lekki",
    status: "Completed",
  },
  {
    id: "4",
    rider: "John Smith",
    date: "2026-05-05",
    pickup: "Surulere",
    destination: "Ikeja",
    status: "Failed",
  },
  {
    id: "5",
    rider: "Samuel James",
    date: "2026-05-06",
    pickup: "Ajah",
    destination: "Victoria Island",
    status: "Completed",
  },
];





export const RIDERS_INFO = {
  total: 45,
  active: 22,
  suspended: 55,
};

export const USERS_INFO = {
  total: 45,
  suspended: 55,
};

export const FINANCE_DATA: FinancePoint[] = [
  { month: "Jan", income: 24000, expenses: 14000 },
  { month: "Feb", income: 18000, expenses: 11000 },
  { month: "Mar", income: 21000, expenses: 9000 },
  { month: "Apr", income: 27000, expenses: 16000 },
  { month: "May", income: 15000, expenses: 8000 },
  { month: "Jun", income: 22000, expenses: 12500 },
  { month: "Jul", income: 19500, expenses: 10500 },
];

export const QUICK_LINKS = [
  "Courier Dispatch",
  "Rider",
  "Finance",
  "Partners",
  "Real Time Tracking",
];

export const RECENT_SHIPMENTS: Shipment[] = Array.from({ length: 5 }).map(
  (_, i) => ({
    id: `shp_${i + 1}`,
    name: "David Demo",
    date: "06/04/2022",
    pickup: "Abraham Adesanya, Ajah Lagos",
    destination: "Abraham Adesanya, Ajah Lagos",
    status: "Completed",
  }),
);