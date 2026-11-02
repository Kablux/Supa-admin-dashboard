import React from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface DetailSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  /** Layout for the card body (grid / flex). Merged over the base card styles. */
  contentSx?: SxProps<Theme>;
  /** Render children without the card wrapper (e.g. KYC section has its own surface). */
  bare?: boolean;
}

const cardSx = {
  backgroundColor: "var(--bg-secondary, #141721)",
  borderRadius: "10px",
  p: 2,
  border: "1px solid rgba(255, 255, 255, 0.04)",
};

/** Gold section title + dark card — used by every block in the rider modal. */
export default function DetailSection({ title, icon, children, contentSx, bare }: DetailSectionProps) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          color: "var(--accent-gold, #FEB914)",
          mb: 1.5,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {icon}
        {title}
      </Typography>

      {bare ? children : <Box sx={[cardSx, ...(Array.isArray(contentSx) ? contentSx : [contentSx])]}>{children}</Box>}
    </Box>
  );
}
