import React from "react";
import { Box, Chip } from "@mui/material";

import KycStatusChip from "../KycStatusChip";
import { CourierRider } from "../../../types/common.types";

interface RiderStatusBadgesProps {
  rider: CourierRider;
  isSuspended: boolean;
}

export default function RiderStatusBadges({ rider, isSuspended }: RiderStatusBadgesProps) {
  const isOnline = rider.available_to_receive_order;

  return (
    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 0.5 }}>
      <KycStatusChip status={rider.kyc_status} />

      <Chip
        label={`Account: ${rider.account_status}`}
        size="small"
        sx={{
          backgroundColor: isSuspended ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.05)",
          color: isSuspended ? "#EF4444" : "var(--text-secondary)",
          fontSize: 11,
          fontWeight: 500,
        }}
      />

      <Chip
        label={isOnline ? "🟢 Online / Available" : "⚪ Offline"}
        size="small"
        sx={{
          backgroundColor: isOnline ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.04)",
          color: isOnline ? "#34D399" : "var(--text-secondary)",
          fontSize: 11,
          fontWeight: 500,
        }}
      />
    </Box>
  );
}
