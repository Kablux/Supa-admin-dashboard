import type { IconType } from "react-icons";
import * as Icons from "@mui/icons-material";

export interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

export interface NavSection {
  title: string | null;
  items: NavItem[];
}

export interface Stat {
  id: string;
  label: string;
  value: string | number;
  icon: keyof typeof Icons;
  color: string;
  bg: string;
  description?: string;
  trendUp?: boolean;
  details?: {
    label: string;
    value: string | number;
  }[];
}

export interface Message {
  id: number;
  name: string;
  plate: string;
  complaint: string;
  time: string;
  avatar: string;
  read: boolean;
}

export interface MessagesData {
  drivers: Message[];
  riders: Message[];
}

export interface RideSummaryData {
  total: number;
  active: number;
  suspended: number;
}

export interface LiveTripsSummary {
  total: number;
  driver_on_way: number;
  arrived: number;
  started: number;
}

export const TAB_MAPPING = {
  all: "",
  approved: "active",
  pending: "pending_verification",
  cancelled: "deleted",
} as const;
export const TRIP_TAB_MAPPING = {
  all: "",
  active: "driver_on_way",
  completed: "completed",
  cancelled: "cancelled",
} as const;


export interface AnalyticsPoint {
  x: string;
  y: number;
}

export interface AnalyticsMetric {
  name: string;
  label: string;
  data: AnalyticsPoint[];
}

export interface TransactionAnalytics {
  range: string;
  currency: string;
  metrics: AnalyticsMetric[];
  summary: {
    total_income: number;
    total_expense: number;
  };
}


// NOTIFICATION TYPES
export type NotifCategory = 'cooperate' | 'standard' | 'premium';

export interface Reminder {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  avatar: string | null;
}

export interface NotificationItem {
  id: string;
  userName: string;
  userAvatar: string | null;
  date: string;
  message: string;
  read: boolean;
  category: NotifCategory;
}

export type SosTab = 'drivers' | 'riders';

export interface SosMessage {
  id: number;
  name: string;
  plate: string;       // driver plate or rider name
  complaint: string;
  time: string;
  avatar: string | null;
  read: boolean;
}

export interface NotificationsState {
  reminders: Reminder[];
  sosMessages: { drivers: SosMessage[]; riders: SosMessage[] };
  notifications: NotificationItem[];
  activeSosTab: SosTab;
  activeCategory: NotifCategory;
}

////ADMIN ROLE

export type AdminRoleType =
  | "Support Agent"
  | "Operations Officer"
  | "Finance Officer"
  | "Fleet Manager"
  | "Corporate Manager"
  | "Compliance Officer"
  | "Driver Officer"
  | "Rider Officer"
  | "Engineering Officer"
  
  
export interface AdminRole {
  id: string;
  full_name: string;
  email: string;
  avatar: string | null;
  role: AdminRoleType;
  permission: boolean;
  created_at: string;
}

export interface AdminRoleSummary {
  role: string;
  count: number;
}

export interface AdminRoleState {
  roles: AdminRole[];
  summary: AdminRoleSummary[];
  isLoading: boolean;
  error: string | null;
}