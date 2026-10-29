import React, { useId, useMemo } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnalyticsMetric, AnalyticsRange, TransactionAnalyticsResponse } from "../../types/common.types";


interface CashFlowChartProps {
  analytics: TransactionAnalyticsResponse | null;
  isLoading: boolean;
  range: AnalyticsRange;
  height?: number;
}

interface ChartPoint {
  key: string;
  label: string;
  fullLabel: string;
  income: number;
  expense: number;
}

const COLORS = {
  income: "#34d399",
  expense: "#ef4444",
  grid: "var(--border)",
  axis: "var(--text-secondary)",
  cardBg: "var(--bg-card)",
};

const RANGE_LABEL: Record<AnalyticsRange, string> = {
  week: "This week",
  month: "This month",
  year: "This year",
};

/* ----------------------------- formatters ----------------------------- */

const compactFormatter = new Intl.NumberFormat("en-NG", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatCompact = (value: number) => `₦${compactFormatter.format(value)}`;

const formatNaira = (value: number) =>
  `${value < 0 ? "-" : ""}₦${Math.abs(value).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

// Only treat x values that look like ISO dates as dates ("2026-10", "2026-10-28", "2026-10-28T00:00:00Z").
// Anything else ("Mon", "Week 1", "Oct") is shown exactly as the backend sends it.
const ISO_LIKE = /^\d{4}-\d{2}(-\d{2})?/;

const parseIsoDate = (raw: string): Date | null => {
  if (!ISO_LIKE.test(raw)) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatAxisLabel = (raw: string, range: AnalyticsRange): string => {
  const date = parseIsoDate(raw);
  if (!date) return raw;
  const opts: Intl.DateTimeFormatOptions =
    range === "week"
      ? { weekday: "short" }
      : range === "month"
      ? { day: "numeric", month: "short" }
      : { month: "short" };
  return date.toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
};

const formatTooltipLabel = (raw: string, range: AnalyticsRange): string => {
  const date = parseIsoDate(raw);
  if (!date) return raw;
  const opts: Intl.DateTimeFormatOptions =
    range === "year"
      ? { month: "long", year: "numeric" }
      : { weekday: "short", day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
};

/* ---------------------------- data shaping ---------------------------- */

// Find a metric by keyword in its name/label, falling back to its position in the array.
const pickMetric = (metrics: AnalyticsMetric[], keyword: string, fallbackIndex: number) =>
  metrics.find((m) => `${m.name} ${m.label}`.toLowerCase().includes(keyword)) ?? metrics[fallbackIndex];

const buildChartData = (
  analytics: TransactionAnalyticsResponse | null,
  range: AnalyticsRange
): ChartPoint[] => {
  if (!analytics?.metrics?.length) return [];

  const income = pickMetric(analytics.metrics, "income", 0);
  const expense = pickMetric(analytics.metrics, "expense", 1);

  // Merge both series on x, keeping the order the backend returns.
  const points = new Map<string, ChartPoint>();
  const ensure = (x: string) => {
    let point = points.get(x);
    if (!point) {
      point = {
        key: x,
        label: formatAxisLabel(x, range),
        fullLabel: formatTooltipLabel(x, range),
        income: 0,
        expense: 0,
      };
      points.set(x, point);
    }
    return point;
  };

  income?.data?.forEach(({ x, y }) => {
    ensure(x).income = Math.abs(Number(y) || 0);
  });

  if (expense && expense !== income) {
    expense.data?.forEach(({ x, y }) => {
      ensure(x).expense = Math.abs(Number(y) || 0);
    });
  }

  return Array.from(points.values());
};

/* ---------------------------- sub-components --------------------------- */

const SummaryItem = ({ color, label, value }: { color: string; label: string; value: string }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
    <Box sx={{ width: 10, height: 10, borderRadius: "3px", backgroundColor: color, flexShrink: 0 }} />
    <Box>
      <Typography sx={{ fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.3 }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const TooltipRow = ({ color, label, value }: { color: string; label: string; value: number }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 3, py: 0.25 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color }} />
      <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</Typography>
    </Box>
    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
      {formatNaira(value)}
    </Typography>
  </Box>
);

interface CashFlowTooltipProps {
  active?: boolean;
  payload?: { payload?: ChartPoint }[];
}

const CashFlowTooltip = ({ active, payload }: CashFlowTooltipProps) => {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  const net = point.income - point.expense;

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        px: 1.75,
        py: 1.25,
        minWidth: 190,
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", mb: 0.75 }}>
        {point.fullLabel}
      </Typography>
      <TooltipRow color={COLORS.income} label="Income" value={point.income} />
      <TooltipRow color={COLORS.expense} label="Expense" value={point.expense} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          mt: 0.75,
          pt: 0.75,
        }}
      >
        <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>Net</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: net >= 0 ? COLORS.income : COLORS.expense }}>
          {formatNaira(net)}
        </Typography>
      </Box>
    </Box>
  );
};

/* ------------------------------ component ------------------------------ */

export default function CashFlowChart({ analytics, isLoading, range, height = 300 }: CashFlowChartProps) {
  // useId keeps gradient ids unique if the chart is rendered more than once; colons break url(#...) refs.
  const uid = useId().replace(/:/g, "");
  const incomeGradientId = `${uid}-income`;
  const expenseGradientId = `${uid}-expense`;

  const data = useMemo(() => buildChartData(analytics, range), [analytics, range]);

  const totals = useMemo(() => {
    const income =
      analytics?.summary?.total_income != null
        ? Number(analytics.summary.total_income)
        : data.reduce((sum, p) => sum + p.income, 0);
    const expense =
      analytics?.summary?.total_expense != null
        ? Number(analytics.summary.total_expense)
        : data.reduce((sum, p) => sum + p.expense, 0);
    return { income, expense, net: income - expense };
  }, [analytics, data]);

  const isInitialLoad = isLoading && !analytics;
  const isRefreshing = isLoading && !!analytics;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* Summary legend */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 4 } }}>
        <SummaryItem
          color={COLORS.income}
          label={`Income · ${RANGE_LABEL[range]}`}
          value={isInitialLoad ? "—" : formatNaira(totals.income)}
        />
        <SummaryItem
          color={COLORS.expense}
          label={`Expense · ${RANGE_LABEL[range]}`}
          value={isInitialLoad ? "—" : formatNaira(totals.expense)}
        />
        <SummaryItem
          color={totals.net >= 0 ? COLORS.income : COLORS.expense}
          label="Net cash flow"
          value={isInitialLoad ? "—" : formatNaira(totals.net)}
        />
      </Box>

      {/* Chart area */}
      <Box sx={{ position: "relative", width: "100%", height }}>
        {isInitialLoad ? (
          <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={28} sx={{ color: "var(--accent-gold, #FEB914)" }} />
          </Box>
        ) : data.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 0.5,
            }}
          >
            <InsightsIcon sx={{ fontSize: 44, color: "var(--text-secondary)", opacity: 0.5, mb: 0.5 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
              No cash flow data yet
            </Typography>
            <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Income and expenses for {RANGE_LABEL[range].toLowerCase()} will appear here.
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%" >
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={incomeGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.income} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.income} stopOpacity={0} />
                </linearGradient>
                <linearGradient id={expenseGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.expense} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLORS.expense} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke={COLORS.grid} strokeDasharray="4 4" vertical={false} />

              <XAxis
                dataKey="label"
                tick={{ fill: COLORS.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={16}
                
              />
              <YAxis
                tickFormatter={formatCompact}
                tick={{ fill: COLORS.axis, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={60}
                allowDecimals={false}
                
              />

              <Tooltip
                content={<CashFlowTooltip />}
                cursor={{ stroke: "rgba(255, 255, 255, 0.18)", strokeDasharray: "4 4" }}
              />

              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke={COLORS.income}
                strokeWidth={2.25}
                fill={`url(#${incomeGradientId})`}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: COLORS.cardBg, fill: COLORS.income }}
                animationDuration={600}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke={COLORS.expense}
                strokeWidth={2.25}
                fill={`url(#${expenseGradientId})`}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: COLORS.cardBg, fill: COLORS.expense }}
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* Subtle overlay when switching range, so the old chart stays visible */}
        {isRefreshing && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(26, 29, 38, 0.55)",
              borderRadius: "8px",
            }}
          >
            <CircularProgress size={24} sx={{ color: "var(--accent-gold, #FEB914)" }} />
          </Box>
        )}
      </Box>
    </Box>
  );
}