import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import { BannerAudience } from "../../types/common.types";

export const AUDIENCE_META: Record<
  BannerAudience,
  {
    label: string;
    icon: React.ReactElement;
    color: string;
    bg: string;
  }
> = {
  all: {
    label: "All",
    icon: <GroupsOutlinedIcon sx={{ fontSize: 12 }} />,
    color: "#42A5F5",
    bg: "rgba(66,165,245,0.1)",
  },
  rider: {
    label: "Riders",
    icon: <PersonOutlinedIcon sx={{ fontSize: 12 }} />,
    color: "#AB47BC",
    bg: "rgba(171,71,188,0.1)",
  },
  driver: {
    label: "Drivers",
    icon: <DirectionsCarOutlinedIcon sx={{ fontSize: 12 }} />,
    color: "#4CAF50",
    bg: "rgba(76,175,80,0.1)",
  },
};

export const TABLE_HEADERS = [
  "Title",
  "Audience",
  "Status",
  "CTA Type",
  "Date Range",
  "Created",
  "Actions",
] as const;

export const cellSx = {
  borderBottom: "1px solid var(--border-subtle)",
  color: "var(--text-secondary)",
  py: 1.25,
  px: 2,
};

export const selectSx = {
  fontSize: 14,
  borderRadius: "8px",
  backgroundColor: "var(--bg-secondary)",
  color: "var(--text-muted)",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--border)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--accent-gold)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--accent-gold)",
    borderWidth: "1px",
  },
  "& .MuiSelect-icon": {
    color: "var(--text-muted)",
  },
} as const;
