import { Box, Typography, Chip, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";
import { EarningTab, EarningPeriod } from "../../types/transaction";
import {
  EARNING_DATA_MONTHLY,
  EARNING_DATA_WEEKLY,
  EARNING_DATA_YEARLY,
} from "../../data/transactionMockData";

const CHART_TABS: { key: EarningTab; label: string }[] = [
  { key: "wallet", label: "Wallet" },
  { key: "card", label: "Card Transaction" },
];

const PERIOD_DATA: Record<EarningPeriod, typeof EARNING_DATA_YEARLY> = {
  yearly: EARNING_DATA_YEARLY,
  monthly: EARNING_DATA_MONTHLY,
  weekly: EARNING_DATA_WEEKLY,
};

export function EarningSummary() {
  const [tab, setTab] = useState<EarningTab>("wallet");
  const [period, setPeriod] = useState<EarningPeriod>("yearly");
  const data = PERIOD_DATA[period];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <Box
        sx={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          p: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 10, color: "var(--text-muted)", mb: 0.5 }}>
          {label}
        </Typography>
        <Typography
          sx={{ fontSize: 13, fontWeight: 600, color: "var(--accent-gold)" }}
        >
          N{Number(payload[0].value).toLocaleString()}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        p: 2.5,
        transition: "background-color 0.25s",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          //   alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Typography
          sx={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}
        >
          Earning Summary
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Tab pills */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {CHART_TABS.map((t) => (
              <Box
                key={t.key}
                onClick={() => setTab(t.key)}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  fontSize: 12.5,
                  cursor: "pointer",
                  userSelect: "none",
                  color:
                    tab === t.key ? "var(--accent-gold)" : "var(--text-muted)",
                  borderBottom:
                    tab === t.key
                      ? "2px solid var(--accent-gold)"
                      : "2px solid transparent",
                  fontWeight: tab === t.key ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                {t.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Date range chip */}
            <Chip
              label="Mar 2026 - Oct 2026"
              size="small"
              sx={{
                fontSize: 11,
                height: 24,
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                "& .MuiChip-label": { px: 1 },
              }}
            />

            {/* Period select */}
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value as EarningPeriod)}
              size="small"
              sx={{
                fontSize: 12,
                height: 28,
                color: "var(--text-secondary)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--border)",
                },
                "& .MuiSelect-icon": { color: "var(--text-muted)" },
                "& .MuiSelect-select": { py: 0.4 },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--accent-gold)",
                },
              }}
            >
              <MenuItem value="yearly" sx={{ fontSize: 12 }}>
                Yearly
              </MenuItem>
              <MenuItem value="monthly" sx={{ fontSize: 12 }}>
                Monthly
              </MenuItem>
              <MenuItem value="weekly" sx={{ fontSize: 12 }}>
                Weekly
              </MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>

      {/* Area chart */}
      <Box sx={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="earning-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5C518" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#F5C518" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="x"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 10 }}
              // tickFormatter={v => `N${formatCompact(v)}`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--accent-gold)",
                strokeWidth: 1,
                strokeDasharray: "4 2",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#F5C518"
              strokeWidth={2}
              fill="url(#earning-gradient)"
              dot={{ r: 0 }}
              activeDot={{
                r: 5,
                fill: "#F5C518",
                stroke: "var(--bg-card)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
