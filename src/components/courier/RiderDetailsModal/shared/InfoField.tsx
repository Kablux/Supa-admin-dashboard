import React from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
  valueSx?: SxProps<Theme>;
}

/** Stacked caption label + value. */
export default function InfoField({ label, value, valueSx }: InfoFieldProps) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={[{ fontWeight: 500 }, ...(Array.isArray(valueSx) ? valueSx : [valueSx])]}>
        {value}
      </Typography>
    </Box>
  );
}
