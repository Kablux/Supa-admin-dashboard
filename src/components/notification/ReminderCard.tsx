import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ReminderCardRow } from "./ReminderCardRow";

interface RemindersPanelProps {
  reminders: any[]; // Replace 'any' with your actual Reminder type
}

export default function RemindersPanel({ reminders }: RemindersPanelProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        boxShadow: isDark
          ? "0px 0px 180px rgba(0,0,0,0.08)"
          : "0px 8px 40px rgba(0,0,0,0.06)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.03)"
          : "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          background: `radial-gradient(circle at top center, rgba(245,197,24,0.12) 0%, rgba(245,197,24,0.05) 20%, transparent 50%)`,
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.04)"
            : "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: 16, md: 20 },
            color: "var(--text-primary)",
            lineHeight: 1.1,
            mb: 1,
          }}
        >
          Messages
        </Typography>

        <Typography sx={{ fontSize: 14, color: "var(--text-muted)", mt: 0.25 }}>
          Reminder
        </Typography>
      </Box>

      {/* List Area */}
      <Box sx={{ px: 1.5, py: 1 }}>
        {reminders.map((r, i) => (
          <ReminderCardRow
            key={r.id}
            title={r.title}
            subtitle={r.subtitle}
            time={r.time}
            avatar={r.avatar}
            isLast={i === reminders.length - 1}
          />
        ))}
      </Box>
    </Box>
  );
}
