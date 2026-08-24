import React from "react";
import { Box, Typography } from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

const StatCard = ({ title, stats }: { title: string; stats: StatItem[] }) => (
  <Box
    sx={{
      flex: 1,
      backgroundColor: "var(--bg-card)",
      border: "1px solid var(--border, rgba(255,255,255,0.1))",
      borderRadius: "16px",
      p: 2.5,
      
      
    }}
  >
    <Typography sx={{ fontSize: 14, color: "var(--text-secondary)", mb: 2 }}>
      {title}
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: 2,
      }}
    >
      {stats.map((s) => (
        <Box key={s.label} className="flex flex-col items-center w-max">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.04)",
              color: "var(--accent-gold, #FFD700)",
              mb: 1.5,
            }}
          >
            {s.icon}
          </Box>
          <Typography
            sx={{ fontSize: 12, color: "var(--text-secondary)", mb: 0.25 }}
          >
            {s.label}
          </Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>
            {s.value}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

interface Props {
  riders: { total: number; active: number; suspended: number };
  users: { total: number; suspended: number };
}

export default function CourierInfoCards({ riders, users }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2.5,
      }}
    >
      <StatCard
        title="Riders Info"
        stats={[
          {
            label: "Total Riders",
            value: riders.total,
            icon: <DirectionsBikeRoundedIcon sx={{ fontSize: 20 }} />,
          },
          {
            label: "Active Riders",
            value: riders.active,
            icon: <PeopleAltRoundedIcon sx={{ fontSize: 20 }} />,
          },
          {
            label: "Suspended Riders",
            value: riders.suspended,
            icon: <BlockRoundedIcon sx={{ fontSize: 20 }} />,
          },
        ]}
      />
      <StatCard
        title="Users Info"
        stats={[
          {
            label: "Total User",
            value: users.total,
            icon: <PersonRoundedIcon sx={{ fontSize: 20 }} />,
          },
          // {
          //   label: "Suspended Riders",
          //   value: users.suspended,
          //   icon: <BlockRoundedIcon sx={{ fontSize: 20 }} />,
          // },
        ]}
      />
    </Box>
  );
}
