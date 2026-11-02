import { useState } from "react";
import { Alert, Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useAnalytics } from "../api";
import { GlobalFilterBar, useAnalyticsFilters } from "../filters";
import { formatMoney, formatNumber, formatPercent } from "../format";
import type { Envelope, Metric, Person, SeriesRow } from "../types";
import { Columns, ErrorState, ExportMenu, FreshnessNote, KpiGrid, Loading, PeriodCaption, Section } from "../components/ui";
import { CategoryBars, Funnel, FunnelStage, HourHeat, TrendChart } from "../components/charts";
import DataTable from "../components/DataTable";
import { recordsLink } from "./ExecutivePage";

interface TripsData extends Envelope {
  metrics: Metric[];
  funnel: { stages: FunnelStage[]; largest_loss: { stage: string; lost: number; loss_rate: number } | null; outcomes: { key: string; label: string; count: number | null; note?: string }[]; definition: string };
  trend: SeriesRow[];
  breakdown: Record<string, { value: string; bookings: number; completion_rate: number | null; trips_completed: number; gbv: number }[]>;
}

interface CancellationData extends Envelope {
  by_who: { key: string; label: string; count: number; previous: number }[];
  by_stage: { stage: string; count: number }[];
  reasons: { cancelled_by: string; reason: string; count: number }[];
  reason_note: string;
  by_hour: { hour: number; bookings: number; cancellations: number; rate: number | null }[];
  by_area: { area: string; bookings: number; cancellations: number; rate: number | null }[];
  top_drivers: { driver_id: string; driver: Person | null; cancelled: number; matched: number; rate: number | null }[];
  top_drivers_note: string;
  trend: SeriesRow[];
  cancellation_rate: Metric;
}

interface TimeData {
  by_hour: { hour: number; bookings: number; completed: number; avg_bookings_per_day: number; gbv: number; commission: number }[];
  by_weekday: { weekday: string; bookings: number; completed: number; avg_bookings_per_day: number | null }[];
  by_week_of_month: { week: number; bookings: number; completed: number }[];
  by_month: { month: string; bookings: number; completed: number }[];
  weekend_vs_weekday: Record<"weekend" | "weekday", { bookings?: number; completed?: number; gbv?: number; days: number; avg_bookings_per_day: number | null }>;
  peak: { definition: string; hours: number[]; peak_bookings?: number; off_peak_bookings?: number; peak_gbv?: number; off_peak_gbv?: number };
  busiest_hours: number[];
  quietest_hours: number[];
}

type Params = Record<string, string | undefined>;
const hourLabel = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

function FunnelTab({ params, search }: { params: Params; search: string }) {
  const { data, loading, error, reload } = useAnalytics<TripsData>("trips/", params);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return null;
  const links = { booking_requests: recordsLink("bookings", search), completed_trips: recordsLink("trips", search, { status: "completed" }), funnel_matched: recordsLink("trips", search) };
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
        <PeriodCaption period={data.period} comparison={data.comparison} />
        <ExportMenu path="trips/" params={params} />
      </Stack>
      <KpiGrid metrics={data.metrics} links={links} />
      <Columns>
        <Section title="Booking lifecycle" subtitle={data.funnel.definition}>
          {data.funnel.largest_loss && (
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              Most bookings are lost before <b>{data.funnel.largest_loss.stage}</b>: {formatNumber(data.funnel.largest_loss.lost)} bookings ({data.funnel.largest_loss.loss_rate}% of the previous stage).
            </Alert>
          )}
          <Funnel stages={data.funnel.stages} largestLoss={data.funnel.largest_loss?.stage} />
        </Section>
        <Section title="Where the other bookings went">
          <Stack spacing={1.25}>
            {data.funnel.outcomes.map((outcome) => (
              <Stack key={outcome.key} direction="row" sx={{ justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", pb: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: 13, color: "var(--text-primary)" }}>{outcome.label}</Typography>
                  {outcome.note && <Typography sx={{ fontSize: 11.5, color: "var(--text-muted)" }}>{outcome.note}</Typography>}
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{outcome.count === null ? "n/a" : formatNumber(outcome.count)}</Typography>
              </Stack>
            ))}
          </Stack>
        </Section>
      </Columns>
      <Section title="Bookings and outcomes over time">
        <TrendChart
          data={data.trend}
          kind="line"
          series={[
            { key: "booking_requests", label: "Bookings" },
            { key: "cohort_matched", label: "Matched" },
            { key: "cohort_completed", label: "Completed" },
            { key: "cohort_request_cancelled", label: "Cancelled before match" },
            { key: "cohort_expired_no_dispatch", label: "No driver available", dashed: true },
          ]}
        />
      </Section>
      <Columns template={{ xs: "1fr", lg: "1fr 1fr 1fr" }}>
        {Object.entries(data.breakdown).map(([dim, rows]) => (
          <Section key={dim} title={`By ${dim.replace(/_/g, " ")}`} dense>
            <DataTable
              rows={rows as unknown as Record<string, unknown>[]}
              columns={[
                { key: "value", label: "Value", render: (row) => String(row.value).replace(/_/g, " ") },
                { key: "bookings", label: "Bookings", align: "right", render: (row) => formatNumber(row.bookings as number) },
                { key: "completion_rate", label: "Completion", align: "right", render: (row) => formatPercent(row.completion_rate as number) },
                { key: "gbv", label: "GBV", align: "right", render: (row) => formatMoney(row.gbv as number) },
              ]}
            />
          </Section>
        ))}
      </Columns>
      <FreshnessNote freshness={data.freshness} filters={data.filters} />
    </Stack>
  );
}

function CancellationsTab({ params, search }: { params: Params; search: string }) {
  const { data, loading, error, reload } = useAnalytics<CancellationData>("trips/cancellations/", params);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return null;
  const whoMetrics: Metric[] = data.by_who.map((row) => ({
    key: `cancel_${row.key}`,
    label: row.label,
    value: row.count,
    previous: row.previous,
    change_pct: row.previous ? Math.round(((row.count - row.previous) / row.previous) * 1000) / 10 : null,
    unit: "count",
    availability: "available",
    note: null,
  }));
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
        <PeriodCaption period={data.period} comparison={data.comparison} />
        <ExportMenu path="trips/cancellations/" params={params} />
      </Stack>
      <KpiGrid
        metrics={[data.cancellation_rate, ...whoMetrics]}
        links={{ cancel_driver: recordsLink("trips", search, { status: "cancelled" }), cancel_rider_trip: recordsLink("trips", search, { status: "cancelled" }), cancel_rider_request: recordsLink("bookings", search, { status: "cancelled" }) }}
      />
      <Columns template={{ xs: "1fr", lg: "1fr 1fr" }}>
        <Section title="By stage">
          <CategoryBars data={data.by_stage} xKey="stage" series={[{ key: "count", label: "Cancellations" }]} horizontal height={220} />
        </Section>
        <Section title="Cancellations over time">
          <TrendChart
            data={data.trend}
            kind="bar"
            series={[
              { key: "requests_cancelled", label: "Rider, before match" },
              { key: "trips_cancelled_rider", label: "Rider, after match" },
              { key: "trips_cancelled_driver", label: "Driver" },
              { key: "trips_cancelled_system", label: "System" },
            ]}
            height={220}
          />
        </Section>
      </Columns>
      <Section title="Cancellation rate by hour of day" subtitle="Cancellations per booking in each Lagos hour">
        <CategoryBars data={data.by_hour.map((row) => ({ ...row, hour: hourLabel(row.hour) }))} xKey="hour" series={[{ key: "rate", label: "Cancellation rate", unit: "percent" }]} unit="percent" height={220} />
      </Section>
      <Columns template={{ xs: "1fr", lg: "1fr 1fr" }}>
        <Section title="Recorded reasons" subtitle={data.reason_note}>
          <DataTable
            rows={data.reasons as unknown as Record<string, unknown>[]}
            columns={[
              { key: "cancelled_by", label: "By" },
              { key: "reason", label: "Reason" },
              { key: "count", label: "Count", align: "right" },
            ]}
          />
        </Section>
        <Section title="Drivers with most cancellations" subtitle={data.top_drivers_note}>
          <DataTable
            rows={data.top_drivers as unknown as Record<string, unknown>[]}
            columns={[
              { key: "driver", label: "Driver", render: (row) => (row.driver as Person | null)?.name || String(row.driver_id) },
              { key: "cancelled", label: "Cancelled", align: "right" },
              { key: "matched", label: "Matched", align: "right" },
              { key: "rate", label: "Rate", align: "right", render: (row) => formatPercent(row.rate as number) },
            ]}
          />
        </Section>
      </Columns>
      <Section title="Areas with the highest cancellation rates">
        <DataTable
          rows={data.by_area as unknown as Record<string, unknown>[]}
          columns={[
            { key: "area", label: "Area" },
            { key: "bookings", label: "Bookings", align: "right" },
            { key: "cancellations", label: "Cancellations", align: "right" },
            { key: "rate", label: "Rate", align: "right", render: (row) => formatPercent(row.rate as number) },
          ]}
        />
      </Section>
    </Stack>
  );
}

function TimeTab({ params }: { params: Params }) {
  const { data, loading, error, reload } = useAnalytics<TimeData>("trips/time-patterns/", params);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return null;
  const peakTotal = (data.peak.peak_bookings || 0) + (data.peak.off_peak_bookings || 0);
  const peakShare = peakTotal ? ((data.peak.peak_bookings || 0) / peakTotal) * 100 : null;
  const info = (key: string, label: string, note: string): Metric => ({ key, label, value: null, previous: null, change_pct: null, unit: "count", availability: "available", note });
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
        <ExportMenu path="trips/time-patterns/" params={params} />
      </Stack>
      <KpiGrid
        metrics={[
          info("busiest", "Busiest hours", data.busiest_hours.map(hourLabel).join(", ") || "—"),
          info("quietest", "Quietest hours", data.quietest_hours.map(hourLabel).join(", ")),
          { key: "peak_share", label: "Bookings in peak hours", value: peakShare, previous: null, change_pct: null, unit: "percent", availability: "available", note: `Peak: ${data.peak.hours.map(hourLabel).join(", ") || "—"}` },
          { key: "weekend", label: "Weekend bookings per day", value: data.weekend_vs_weekday.weekend.avg_bookings_per_day, previous: null, change_pct: null, unit: "count", availability: "available", note: `Weekdays: ${data.weekend_vs_weekday.weekday.avg_bookings_per_day ?? "—"} per day` },
        ]}
      />
      <Section title="Demand by hour of day" subtitle={data.peak.definition}>
        <HourHeat rows={data.by_hour} valueKey="avg_bookings_per_day" label="Average bookings per day" />
        <Box sx={{ mt: 2 }}>
          <CategoryBars data={data.by_hour.map((row) => ({ ...row, hour: hourLabel(row.hour) }))} xKey="hour" series={[{ key: "bookings", label: "Bookings" }, { key: "completed", label: "Completed" }]} height={240} />
        </Box>
      </Section>
      <Section title="Revenue by hour of day">
        <CategoryBars data={data.by_hour.map((row) => ({ ...row, hour: hourLabel(row.hour) }))} xKey="hour" series={[{ key: "gbv", label: "GBV", unit: "ngn" }, { key: "commission", label: "Commission", unit: "ngn" }]} unit="ngn" height={240} />
      </Section>
      <Columns template={{ xs: "1fr", lg: "1fr 1fr" }}>
        <Section title="By day of week">
          <CategoryBars data={data.by_weekday} xKey="weekday" series={[{ key: "avg_bookings_per_day", label: "Average bookings per day" }]} height={220} />
        </Section>
        <Section title="By week of month">
          <CategoryBars data={data.by_week_of_month.map((row) => ({ ...row, week: `Week ${row.week}` }))} xKey="week" series={[{ key: "bookings", label: "Bookings" }, { key: "completed", label: "Completed" }]} height={220} />
        </Section>
      </Columns>
      {data.by_month.length > 1 && (
        <Section title="By month">
          <CategoryBars data={data.by_month} xKey="month" series={[{ key: "bookings", label: "Bookings" }, { key: "completed", label: "Completed" }]} height={220} />
        </Section>
      )}
    </Stack>
  );
}

export default function TripsAnalyticsPage() {
  const { apiParams, search } = useAnalyticsFilters();
  const [tab, setTab] = useState(0);
  return (
    <Stack spacing={2.5}>
      <GlobalFilterBar show={tab === 2 ? [] : ["ride_type", "payment_method", "vehicle_type", "area"]} />
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        textColor="inherit"
        slotProps={{ indicator: { style: { background: "var(--accent-gold)" } } }}
        sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, textTransform: "none" }, "@media print": { display: "none" } }}
      >
        <Tab label="Funnel and lifecycle" />
        <Tab label="Cancellations" />
        <Tab label="Time patterns" />
      </Tabs>
      {tab === 0 && <FunnelTab params={apiParams} search={search} />}
      {tab === 1 && <CancellationsTab params={apiParams} search={search} />}
      {tab === 2 && <TimeTab params={apiParams} />}
    </Stack>
  );
}
