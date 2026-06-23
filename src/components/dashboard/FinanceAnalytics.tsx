import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { fetchTransactionAnalytics } from "../../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export default function FinanceAnalytics() {
  const dispatch = useAppDispatch();

  const [range, setRange] = useState<"week" | "month" | "year">("month");

  const { analytics } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchTransactionAnalytics(range));
  }, [dispatch, range]);

  const income =
    analytics?.metrics.find((m) => m.name === "income")?.data || [];

  const expense =
    analytics?.metrics.find((m) => m.name === "expense")?.data || [];

  const chartData = income.map((item, index) => ({
    period: item.x,
    income: item.y,
    expense: expense[index]?.y ?? 0,
  }));

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        p: 2.5,
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Transaction Analytics
        </Typography>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={range}
          onChange={(_, value) => {
            if (value) setRange(value);
          }}
        >
          <ToggleButton value="week">Week</ToggleButton>

          <ToggleButton value="month">Month</ToggleButton>

          <ToggleButton value="year">Year</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          mb: 2,
        }}
      >
        <Box>
          <Typography color="success.main">Income</Typography>

          <Typography sx={{ fontWeight: "700" }}>
            ₦{analytics?.summary.total_income.toLocaleString()}
          </Typography>
        </Box>

        <Box>
          <Typography color="error.main">Expense</Typography>

          <Typography sx={{ fontWeight: "700" }}>
            ₦{analytics?.summary.total_expense.toLocaleString()}
          </Typography>
        </Box>

        <Box>
          <Typography color="warning.main">Net Revenue</Typography>

          <Typography sx={{ fontWeight: "700" }}>
            ₦
            {(
              (analytics?.summary.total_income ?? 0) -
              (analytics?.summary.total_expense ?? 0)
            ).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF5350" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#EF5350" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="period" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="income"
            stroke="#4CAF50"
            fill="url(#income)"
          />

          <Area
            type="monotone"
            dataKey="expense"
            stroke="#EF5350"
            fill="url(#expense)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
