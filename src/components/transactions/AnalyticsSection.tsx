import React from "react";
import { Box, Typography, MenuItem, Select } from "@mui/material";
import CashFlowChart from "./CashFlowChart";
import { TransactionAnalyticsResponse } from "../../types/common.types";

interface TransactionAnalyticsSectionProps {
  analytics: TransactionAnalyticsResponse | null;
  analyticsRange: "week" | "month" | "year";
  isAnalyticsLoading: boolean;
  onRangeChange: (range: "week" | "month" | "year") => void;
}

export default function TransactionAnalyticsSection({
  analytics,
  analyticsRange,
  isAnalyticsLoading,
  onRangeChange,
}: TransactionAnalyticsSectionProps) {
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card, #1A1D26)",
        border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
        borderRadius: "8px",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        "&:hover": {
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        borderColor: "rgba(255, 190, 24, 0.25)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography sx={{ fontWeight: 700, color: "var(--text-primary)" }}>
            Revenue Analytics
          </Typography>
        </Box>
        <Select
          value={analyticsRange}
          onChange={(e) => onRangeChange(e.target.value as "week" | "month" | "year")}
          size="small"
          sx={{
            color: "var(--text-primary)",
            backgroundColor: "rgba(255,255,255,0.03)",
            fontSize: 13,
            borderRadius: "8px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border)" },
            "& .MuiSvgIcon-root": { color: "var(--text-secondary)" },
          }}
        >
          <MenuItem value="week">Weekly</MenuItem>
          <MenuItem value="month">Monthly</MenuItem>
          <MenuItem value="year">Yearly</MenuItem>
        </Select>
      </Box>

      <CashFlowChart analytics={analytics} isLoading={isAnalyticsLoading} range={analyticsRange} />
    </Box>
  );
}