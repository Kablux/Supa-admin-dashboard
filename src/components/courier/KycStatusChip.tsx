import React from "react";
import { Chip } from "@mui/material";

interface KycStatusChipProps {
  status: string;
}

const statusStyles: Record<
  string,
  { label: string; bg: string; color: string; border: string }
> = {
  VERIFIED: {
    label: "Verified",
    bg: "rgba(16, 185, 129, 0.10)",
    color: "#34D399",
    border: "rgba(52, 211, 153, 0.22)",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    bg: "rgba(255, 190, 24, 0.10)",
    color: "#FBBF24",
    border: "rgba(255, 190, 24, 0.22)",
  },
  NEEDS_RESUBMISSION: {
    label: "Needs Resubmission",
    bg: "rgba(96, 165, 250, 0.10)",
    color: "#60A5FA",
    border: "rgba(96, 165, 250, 0.22)",
  },
  REJECTED: {
    label: "Rejected",
    bg: "rgba(248, 113, 113, 0.10)",
    color: "#F87171",
    border: "rgba(248, 113, 113, 0.22)",
  },
  NOT_SUBMITTED: {
    label: "Not Submitted",
    bg: "rgba(148, 163, 184, 0.10)",
    color: "#94A3B8",
    border: "rgba(148, 163, 184, 0.20)",
  },
};

const KycStatusChip: React.FC<KycStatusChipProps> = ({ status }) => {
  const normalizedStatus = status?.toUpperCase() || "NOT_SUBMITTED";

  const style = statusStyles[normalizedStatus] ?? {
    label: status || "Pending",
    bg: "rgba(148, 163, 184, 0.10)",
    color: "#94A3B8",
    border: "rgba(148, 163, 184, 0.20)",
  };

  return (
    <Chip
      label={style.label}
      size="small"
      sx={{
        height: 27,
        borderRadius: "8px",
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.15px",
        "& .MuiChip-label": {
          px: 1.2,
        },
      }}
    />
  );
};

export default KycStatusChip;