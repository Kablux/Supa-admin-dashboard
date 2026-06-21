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

export const TAB_MAPPING = {
  all: "",
  approved: "active",
  pending: "pending_verification",
  cancelled: "deleted",
} as const;
