import { useMemo, useState } from "react";
import { Alert, Box, Chip, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { CartesianGrid, ComposedChart, Area, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAnalytics, useAnalyticsMe } from "../api";
import { GlobalFilterBar, useAnalyticsFilters } from "../filters";
import { formatAxis, formatDateLabel, formatDateTime, formatMoney, formatNumber, formatPercent, formatValue } from "../format";
import { usePalette } from "../palette";
import type { Envelope, Metric, SeriesRow } from "../types";
import { Columns, ErrorState, ExportMenu, FreshnessNote, KpiGrid, Loading, PeriodCaption, Section } from "../components/ui";
import { Donut, TrendChart } from "../components/charts";
import DataTable from "../components/DataTable";
import { recordsLink } from "./ExecutivePage";

interface FinanceData extends Envelope {
  trip_metrics: Metric[];
  ledger_metrics: Metric[];
  ledger_note: string;
  by_payment_method: { payment_method: string; trips: number; gbv: number; rider_paid: number; commission: number; share_of_gbv: number | null }[];
  payment_methods_note: string;
  balances: { as_of: string; driver_available: number; driver_withdrawable: number; driver_held: number; outstanding_driver_total: number; rider_wallets: number } | null;
  reconciliation: { trip_commission: number; ledger_commission: number; difference: number | null; explanation: string };
  trend: SeriesRow[];
}

interface ForecastMetric {
  label: string;
  actual: { date: string; actual: number }[];
  forecast: { date: string; forecast: number; lower: number; upper: number }[];
  forecast_total: number;
  forecast_range: [number, number];
  weekly_trend_pct: number;
}

interface ForecastData {
  available: boolean;
  reason?: string;
  label?: string;
  method?: string;
  assumptions?: string;
  generated_for?: { from: string; to: string; horizon_days: number };
  metrics?: Record<string, ForecastMetric | null>;
}

function ForecastSection() {
  const palette = usePalette();
  const [metric, setMetric] = useState("commission");
  const { data, loading, error } = useAnalytics<ForecastData>("forecast/", { horizon: 30 });
  const chosen = data?.metrics?.[metric] || null;
  const rows = useMemo(() => {
    if (!chosen) return [];
    return [
      ...chosen.actual.map((point) => ({ bucket: point.date, actual: point.actual })),
      ...chosen.forecast.map((point) => ({ bucket: point.date, forecast: point.forecast, band: [point.lower, point.upper] })),
    ];
  }, [chosen]);
  const unit = metric === "trips_completed" ? "count" : "ngn";
  return (
    <Section
      title="Forecast"
      subtitle="Projection, not actual results. Shown separately from every actual figure."
      actions={
        <ToggleButtonGroup size="small" exclusive sx={{ "& .MuiToggleButton-root": { textTransform: "none", px: 1.5 } }} value={metric} onChange={(_, value) => value && setMetric(value)}>
          <ToggleButton value="commission">Commission</ToggleButton>
          <ToggleButton value="gbv">GBV</ToggleButton>
          <ToggleButton value="trips_completed">Trips</ToggleButton>
        </ToggleButtonGroup>
      }
    >
      {loading && !data ? (
        <Loading height={220} />
      ) : error ? (
        <ErrorState message={error} />
      ) : !data?.available ? (
        <Alert severity="info">{data?.reason || "Not enough history for a forecast yet."}</Alert>
      ) : chosen ? (
        <Stack spacing={2}>
          <Stack sx={{ alignItems: "center", flexWrap: "wrap" }} direction="row" spacing={1}>
            <Chip size="small" color="warning" label="FORECAST" />
            <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Next {data.generated_for?.horizon_days} days: <b style={{ color: "var(--text-primary)" }}>{formatValue(chosen.forecast_total, unit)}</b> (likely range {formatValue(chosen.forecast_range[0], unit)} to {formatValue(chosen.forecast_range[1], unit)}) · weekly trend {chosen.weekly_trend_pct}%
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <ComposedChart data={rows}>
                <CartesianGrid stroke={palette.grid} vertical={false} />
                <XAxis dataKey="bucket" tickFormatter={(v) => formatDateLabel(String(v))} stroke={palette.axis} fontSize={11} tickLine={false} axisLine={false} minTickGap={16} />
                <YAxis tickFormatter={(v) => formatAxis(Number(v), unit)} stroke={palette.axis} fontSize={11} tickLine={false} axisLine={false} width={64} />
                <Tooltip contentStyle={{ background: palette.tooltipBg, border: `1px solid ${palette.tooltipBorder}`, borderRadius: 8, fontSize: 12 }} labelFormatter={(v) => formatDateLabel(String(v))} formatter={(value, name) => [Array.isArray(value) ? `${formatValue(Number(value[0]), unit)} – ${formatValue(Number(value[1]), unit)}` : formatValue(Number(value), unit), name]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area dataKey="band" name="Forecast range" stroke="none" fill={palette.series[1]} fillOpacity={0.15} />
                <Line dataKey="actual" name="Actual" stroke={palette.series[0]} strokeWidth={2} dot={false} />
                <Line dataKey="forecast" name="Forecast" stroke={palette.series[1]} strokeWidth={2} strokeDasharray="6 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
          <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>{data.assumptions}</Typography>
        </Stack>
      ) : null}
    </Section>
  );
}

export default function FinancePage() {
  const { apiParams, search } = useAnalyticsFilters();
  const { can } = useAnalyticsMe();
  const { data, loading, error, reload } = useAnalytics<FinanceData>("finance/", apiParams);
  const canDrill = can("finance.transactions");
  const links: Record<string, string> = canDrill
    ? {
        gbv: recordsLink("trip-revenue", search),
        rider_paid: recordsLink("trip-revenue", search),
        commission: recordsLink("trip-revenue", search),
        net_revenue: recordsLink("trip-revenue", search),
        driver_earnings: recordsLink("trip-revenue", search),
        promo_cost: recordsLink("trip-revenue", search),
        cash_due: recordsLink("trip-revenue", search, { payment_method: "cash" }),
        wallet_collected: recordsLink("trip-revenue", search, { payment_method: "wallet" }),
        topups: recordsLink("transactions", search, { type: "topup" }),
        payouts: recordsLink("transactions", search, { type: "payout" }),
        failed_payouts: recordsLink("transactions", search, { type: "payout", tx_status: "failed" }),
        withdrawal_fees: recordsLink("transactions", search, { type: "withdrawal_fee" }),
        bonuses: recordsLink("transactions", search, { type: "bonus" }),
        admin_adjustments: recordsLink("transactions", search, { type: "admin_adjustment" }),
      }
    : {};

  return (
    <Stack spacing={2.5}>
      <GlobalFilterBar onRefresh={reload} notApplicable={data?.filters.not_applicable} />
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <>
          <Stack sx={{ justifyContent: "space-between" }} direction={{ xs: "column", md: "row" }} spacing={1}>
            <PeriodCaption period={data.period} comparison={data.comparison} />
            <ExportMenu path="finance/" params={apiParams} />
          </Stack>
          <Section title="Trip money" subtitle="From completed trips. Every figure traces to its trips and ledger rows (click a card).">
            <KpiGrid metrics={data.trip_metrics} links={links} />
          </Section>
          <Section title="Wallet ledger" subtitle={data.ledger_note}>
            <KpiGrid metrics={data.ledger_metrics} links={links} />
          </Section>
          <Section title="Revenue trend">
            <TrendChart
              data={data.trend}
              unit="ngn"
              kind="line"
              series={[
                { key: "gbv", label: "GBV", unit: "ngn" },
                { key: "commission", label: "Commission", unit: "ngn" },
                { key: "net_revenue", label: "Net revenue", unit: "ngn" },
                { key: "payouts_amount", label: "Driver payouts", unit: "ngn", dashed: true },
                { key: "topups_amount", label: "Top-ups", unit: "ngn", dashed: true },
              ]}
            />
          </Section>
          <Columns template={{ xs: "1fr", lg: "1fr 1fr" }}>
            <Section title="Payment methods" subtitle={data.payment_methods_note}>
              <Donut data={data.by_payment_method.map((row) => ({ name: row.payment_method, value: row.gbv }))} unit="ngn" />
              <Box sx={{ mt: 2 }}>
                <DataTable
                  rows={data.by_payment_method as unknown as Record<string, unknown>[]}
                  columns={[
                    { key: "payment_method", label: "Method" },
                    { key: "trips", label: "Trips", align: "right", render: (row) => formatNumber(row.trips as number) },
                    { key: "gbv", label: "GBV", align: "right", render: (row) => formatMoney(row.gbv as number) },
                    { key: "commission", label: "Commission", align: "right", render: (row) => formatMoney(row.commission as number) },
                    { key: "share_of_gbv", label: "Share", align: "right", render: (row) => formatPercent(row.share_of_gbv as number) },
                  ]}
                />
              </Box>
            </Section>
            <Stack spacing={2.5}>
              <Section title="Wallet balances" subtitle={data.balances ? `Snapshot ${formatDateTime(data.balances.as_of)}` : "A snapshot is taken on each refresh."}>
                {data.balances ? (
                  <Stack spacing={1}>
                    {[
                      ["Outstanding driver balances", data.balances.outstanding_driver_total],
                      ["Driver available", data.balances.driver_available],
                      ["Driver withdrawal requested", data.balances.driver_withdrawable],
                      ["Driver held for trips", data.balances.driver_held],
                      ["Rider wallets", data.balances.rider_wallets],
                    ].map(([label, value]) => (
                      <Stack sx={{ justifyContent: "space-between" }} key={String(label)} direction="row">
                        <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{formatMoney(Number(value))}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ color: "var(--text-secondary)", fontSize: 13 }}>No snapshot yet.</Typography>
                )}
              </Section>
              <Section title="Commission reconciliation" subtitle={data.reconciliation.explanation}>
                <Stack spacing={1}>
                  <Stack sx={{ justifyContent: "space-between" }} direction="row">
                    <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>From completed trips</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{formatMoney(data.reconciliation.trip_commission)}</Typography>
                  </Stack>
                  <Stack sx={{ justifyContent: "space-between" }} direction="row">
                    <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>From the ledger</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{formatMoney(data.reconciliation.ledger_commission)}</Typography>
                  </Stack>
                  <Stack sx={{ justifyContent: "space-between" }} direction="row">
                    <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>Difference</Typography>
                    <Typography sx={{ fontWeight: 600, color: data.reconciliation.difference ? "var(--danger)" : "var(--success)" }}>{data.reconciliation.difference === null ? "n/a with trip filters" : formatMoney(data.reconciliation.difference)}</Typography>
                  </Stack>
                </Stack>
              </Section>
            </Stack>
          </Columns>
          <FreshnessNote freshness={data.freshness} filters={data.filters} />
        </>
      ) : null}
      <ForecastSection />
    </Stack>
  );
}
