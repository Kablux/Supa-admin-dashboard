import { FaPersonBiking } from "react-icons/fa6";
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
import { MdOutlineHelpOutline } from "react-icons/md";
import type {
  MessagesData,
  NavSection,
  NotifCategory,
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
        icon: FaPersonBiking,
        path: "/riders",
      },
      {
        id: "driver",
        label: "Driver",
        icon: FaCarOn,
        path: "/drivers",
      },
      {
        id: "trip",
        label: "Trip",
        icon: BiTrip,
        path: "/trips",
      },
      {
        id: "cooperate",
        label: "Cooperate",
        icon: HiOutlineBuildingOffice,
        path: "/cooperate",
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
  "/cooperate": "Cooperate",
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
    path: "/cooperate",
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
  { key: "cooperate", label: "Cooperate", color: "var(--accent-gold)" },
  { key: "standard", label: "Standard", color: "#EF5350" },
  { key: "premium", label: "Premium", color: "#EF5350" },
];
