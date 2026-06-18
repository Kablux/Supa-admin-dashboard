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
import type { MessagesData, NavSection } from "../types/common.types.ts";

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
        path: "/admin-roles",
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
  "/drivers": "Drivers",
  "/trips": "Trips",
  "/cooperate": "Cooperate",
  "/fleet": "Fleet",
  "/premium": "Premium",
  "/inspection": "Inspection",
  "/transactions": "Transactions",
  "/admin-roles": "Admin Roles",
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

export const financeData = [
  { month: "Jan", expenses: 3200, income: 5800 },
  { month: "Feb", expenses: 2800, income: 6200 },
  { month: "Mar", expenses: 4100, income: 7100 },
  { month: "Apr", expenses: 3600, income: 6800 },
  { month: "May", expenses: 2900, income: 8200 },
  { month: "Jun", expenses: 3800, income: 7600 },
  { month: "Jul", expenses: 4200, income: 9100 },
  { month: "Aug", expenses: 3100, income: 8400 },
  { month: "Sep", expenses: 3700, income: 7900 },
  { month: "Oct", expenses: 4500, income: 10200 },
  { month: "Nov", expenses: 3900, income: 9600 },
  { month: "Dec", expenses: 4800, income: 11500 },
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
