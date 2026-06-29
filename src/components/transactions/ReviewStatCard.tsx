import { Box, Typography } from "@mui/material";
import { MICRO_STATS } from "../../data/transactionMockData";
import {  StatsChart } from "./StatsChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

export function ReviewStatCard({ stat }: { stat: (typeof MICRO_STATS)[0] }) {
  const positive = stat.trend >= 0;
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        flex: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
          {stat.label}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            px: 0.6,
            py: 0.2,
            borderRadius: "5px",
            backgroundColor: positive
              ? "rgba(76,175,80,0.12)"
              : "rgba(239,83,80,0.12)",
          }}
        >
          {positive ? (
            <TrendingUpIcon sx={{ fontSize: 11, color: "#4CAF50" }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 11, color: "#EF5350" }} />
          )}
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: positive ? "#4CAF50" : "#EF5350",
            }}
          >
            {Math.abs(stat.trend)}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography sx={{ fontSize: 26 }}>{stat.emoji}</Typography>
        <Typography
          sx={{ fontWeight: 700, fontSize: 28, color: "var(--text-primary)" }}
        >
          {stat.value}
        </Typography>
      </Box>

      <StatsChart
        data={stat.chartData}
        color={stat.chartColor}
        positive={positive}
      />
    </Box>
  );
}
