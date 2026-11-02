import React from "react";
import { DialogTitle, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";

import { CourierRider } from "../../../types/common.types";

interface RiderDetailsHeaderProps {
  rider: CourierRider;
  onClose: () => void;
}

export default function RiderDetailsHeader({ rider, onClose }: RiderDetailsHeaderProps) {
  return (
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 3,
        py: 2.5,
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        backgroundColor: "var(--bg-secondary, #141721)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "10px",
            backgroundColor: "rgba(254, 185, 20, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PersonIcon sx={{ color: "var(--accent-gold, #FEB914)", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {rider.first_name} {rider.last_name}
          </Typography>
          <Typography variant="caption" sx={{ color: "var(--text-secondary, #8A92A6)" }}>
            ID: {rider.id}
          </Typography>
        </Box>
      </Box>

      <IconButton onClick={onClose} size="small" aria-label="Close" sx={{ color: "var(--text-secondary)" }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </DialogTitle>
  );
}
