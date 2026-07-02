import React from "react";
import { Box, Typography, Chip, IconButton, Tabs, Tab, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { SosCardRow } from "./SosCardRow";

interface SosPanelProps {
  sosMessages: {
    drivers: any[]; // Replace 'any' with your SosMessage type
    riders: any[];
  };
  activeTab: "drivers" | "riders";
  onTabChange: (tab: "drivers" | "riders") => void;
}

export default function SosPanel({ sosMessages, activeTab, onTabChange }: SosPanelProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const unreadCount =
    sosMessages.drivers.filter((m) => !m.read).length +
    sosMessages.riders.filter((m) => !m.read).length;

  const activeMessages = activeTab === "drivers" ? sosMessages.drivers : sosMessages.riders;

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
        className="flex justify-between items-center"
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          background: `radial-gradient(circle at top center, rgba(245,197,24,0.12) 0%, rgba(245,197,24,0.05) 20%, transparent 50%)`,
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.04)"
            : "1px solid rgba(0,0,0,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: 16, md: 20 },
                color: "var(--text-primary)",
              }}
            >
              SOS
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 700,
                  backgroundColor: "rgba(239,83,80,0.13)",
                  color: "#EF5350",
                  border: "1px solid rgba(239,83,80,0.25)",
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
            )}
          </Box>
          <Typography sx={{ fontSize: 14, color: "var(--text-muted)", mt: 0.25 }}>
            SOS / Complains
          </Typography>
        </Box>
        
        <IconButton
          size="small"
          component={Link}
          to="/sos"
          sx={{
            color: "var(--text-muted)",
            backgroundColor: "var(--border)",
            width: 26,
            height: 26,
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 11 }} />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 1.5 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => onTabChange(v)}
          sx={{
            minHeight: 36,
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--accent-gold)",
              height: 2,
            },
            "& .MuiTab-root": {
              minHeight: 36,
              py: 0.5,
              fontSize: 12.5,
              fontWeight: 500,
              textTransform: "none",
              color: "var(--text-muted)",
              "&.Mui-selected": {
                color: "var(--accent-gold)",
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab value="drivers" label="Drivers" />
          <Tab value="riders" label="Riders" />
        </Tabs>
      </Box>

      {/* List Area */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        {activeMessages.map((msg, i, arr) => (
          <SosCardRow key={msg.id} msg={msg} isLast={i === arr.length - 1} />
        ))}
      </Box>
    </Box>
  );
}