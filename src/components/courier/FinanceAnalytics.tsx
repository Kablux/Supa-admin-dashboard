import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { FinancePoint } from "../../types/common.types";

const INCOME = "#FFD700";
const EXPENSES = "rgba(255,255,255,0.28)";

const naira = (n: number) => `₦${n.toLocaleString()}`;
const menuProps = {
  slotProps: {
    paper: {
      sx: {
       width: { xs: "100%", sm: 400 },
              backgroundColor: "var(--bg-card, #1E1E1E)",
              backgroundImage: "none",
              borderLeft: "1px solid var(--border, rgba(255,255,255,0.1))",
              display: "flex",
              flexDirection: "column",
    },
  },
    }
};
/* Custom dark tooltip */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card, #1E1E1E)",
        border: "1px solid var(--border, rgba(255,255,255,0.12))",
        borderRadius: "10px",
        px: 1.5,
        py: 1,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.5 }}>
        {label}
      </Typography>
      {payload.map((p: any) => (
        <Box
          key={p.dataKey}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: p.dataKey === "income" ? INCOME : "#8b8f98",
            }}
          />
          <Typography
            sx={{ fontSize: 12, color: "var(--text-secondary)", flexGrow: 1 }}
          >
            {p.dataKey === "income" ? "Income" : "Expenses"}
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
            {naira(p.value)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
    <Box
      sx={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: color }}
    />
    <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
      {label}
    </Typography>
  </Box>
);

interface Props {
  data: FinancePoint[];
}

export default function FinanceAnalyticsChart({ data }: Props) {
  const [period, setPeriod] = useState("this_month");

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border, rgba(255,255,255,0.1))",
        borderRadius: "16px",
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700 }}>
            Finance Analytics
          </Typography>
          <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Track your finance
          </Typography>
        </Box>

        <FormControl size="small">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{
              height: 34,
              fontSize: 12.5,
              borderRadius: "8px",
              color: "var(--text-primary)",
              backgroundColor: "rgba(255,255,255,0.03)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--border, rgba(255,255,255,0.12))",
              },
              "& .MuiSvgIcon-root": { color: "var(--text-secondary)" },
            }}
              MenuProps={menuProps}
          >
            <MenuItem value="this_week">This week</MenuItem>
            <MenuItem value="this_month">This month</MenuItem>
            <MenuItem value="this_year">This year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Legend */}
      <Box sx={{ display: "flex", gap: 2.5, mb: 1.5 }}>
        <LegendDot color="#8b8f98" label="Expenses" />
        <LegendDot color={INCOME} label="Income" />
      </Box>

      {/* Chart */}
      <Box sx={{ flexGrow: 1, minHeight: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, left: -12, bottom: 0 }}
            barGap={6}
          >
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INCOME} stopOpacity={0.95} />
                <stop offset="100%" stopColor={INCOME} stopOpacity={0.55} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
              tickFormatter={(v) => `${v / 1000}K`}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              content={<ChartTooltip />}
            />
            <Bar
              dataKey="expenses"
              fill={EXPENSES}
              radius={[6, 6, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              dataKey="income"
              fill="url(#incomeGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}