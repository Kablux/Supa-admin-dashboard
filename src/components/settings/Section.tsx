import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { cardSx } from "./helpers/NumberField";

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export default function Section({
  icon,
  title,
  subtitle,
  action,
  children,
}: SectionProps) {
  return (
    <Box sx={cardSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          py: 2.25,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,215,0,0.08)",
              color: "var(--accent-gold, #FFD700)",
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography
                sx={{ fontSize: 12.5, color: "var(--text-secondary)" }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {action}
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
}