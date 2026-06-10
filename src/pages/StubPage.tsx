import React from "react";
import { Box, Typography } from "@mui/material";
import * as Icons from "@mui/icons-material";

interface StubPageProps {
  title: string;
  icon: keyof typeof Icons;
  description?: string;
}

export default function StubPage({
  title,
  icon,
  description,
}: StubPageProps) {
  const IconComp = Icons[icon] ?? Icons.Dashboard;

  return (
    <Box
      className="fade-in"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "20px",
          backgroundColor: "var(--accent-gold-glow)",
          border: "1px solid rgba(245,197,24,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-gold)",
        }}
      >
        <IconComp sx={{ fontSize: 32 }} />
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 22,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          color: "var(--text-muted)",
          textAlign: "center",
          maxWidth: 340,
        }}
      >
        {description ?? `The ${title} section is coming soon.`}
      </Typography>
    </Box>
  );
}