import { useState } from "react";
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useAnalytics } from "../api";
import { GlobalFilterBar, useAnalyticsFilters } from "../filters";
import type { Envelope, Insight, LiveSnapshot, Metric, SeriesRow } from "../types";
import { Columns, ErrorState, ExportMenu, FreshnessNote, KpiGrid, Loading, PeriodCaption, Section } from "../components/ui";
import { Donut, TrendChart } from "../components/charts";
import { InsightList } from "../components/intel";

interface ExecutiveData extends Envelope {
  sections: { business: Metric[]; financial?: Metric[]; growth: Metric[] };
  financial_visible: boolean;
  trend: SeriesRow[];
  revenue_trends: Record<"day" | "week" | "month", SeriesRow[]> | null;
  registrations: SeriesRow[];
  new_vs_returning: { new: number; returning: number; total: number };
  live: LiveSnapshot;
  insights: Insight[];
}

export function recordsLink(kind: string, search: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams(search);
  Object.entries(extra).forEach(([key, value]) => params.set(key, value));
  return `/analytics/records/${kind}?${params.toString()}`;
}

export default function ExecutivePage() {
  const { apiParams, search } = useAnalyticsFilters();
  const { data, loading, error, reload } = useAnalytics<ExecutiveData>("executive/", apiParams);
  const [grain, setGrain] = useState<"day" | "week" | "month">("day");

  const links = {
    booking_requests: recordsLink("bookings", search),
    failed_bookings: recordsLink("bookings", search, { status: "expired" }),
    request_cancellations: recordsLink("bookings", search, { status: "cancelled" }),
    total_trips: recordsLink("trips", search),
    completed_trips: recordsLink("trips", search, { status: "completed" }),
    cancelled_trips: recordsLink("trips", search, { status: "cancelled" }),
    gbv: recordsLink("trip-revenue", search),
    commission: recordsLink("trip-revenue", search),
    net_revenue: recordsLink("trip-revenue", search),
    driver_earnings: recordsLink("trip-revenue", search),
    topups: recordsLink("transactions", search, { type: "topup" }),
  };

  return (
    <Stack spacing={2.5}>
      <GlobalFilterBar onRefresh={reload} notApplicable={data?.filters.not_applicable} />
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <>
          <Stack sx={{ alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between" }} direction={{ xs: "column", md: "row" }} spacing={1}>
            <PeriodCaption period={data.period} comparison={data.comparison} />
            <ExportMenu path="executive/" params={apiParams} />
          </Stack>

          <Section title="What changed" subtitle="Explanations backed by the figures they cite. Compared with the previous equivalent period.">
            <InsightList insights={data.insights} compact />
          </Section>

          <Section title="Right now" subtitle={`Live as of ${new Date(data.live.as_of).toLocaleTimeString("en-GB", { timeZone: "Africa/Lagos" })}`} dense>
            <KpiGrid
              compact
              min={150}
              metrics={[
                { key: "ongoing_trips", label: "Ongoing trips", value: data.live.trips.ongoing, previous: null, change_pct: null, unit: "count", availability: "available", note: null },
                { key: "open_requests", label: "Open requests", value: data.live.trips.open_requests, previous: null, change_pct: null, unit: "count", availability: "available", note: null },
                { key: "online_drivers_now", label: "Drivers online", value: data.live.drivers.online, previous: null, change_pct: null, unit: "count", availability: "available", note: null },
                { key: "available_drivers", label: "Available drivers", value: data.live.drivers.available, previous: null, change_pct: null, unit: "count", availability: "available", note: null },
                { key: "on_trip_drivers", label: "Drivers on a trip", value: data.live.drivers.on_trip, previous: null, change_pct: null, unit: "count", availability: "available", note: null },
              ]}
            />
          </Section>

          <Section title="Business overview">
            <KpiGrid metrics={data.sections.business} links={links} />
          </Section>

          {data.financial_visible && data.sections.financial && (
            <Section
              title="Financial performance"
              subtitle="GBV is what riders agreed to pay before discounts. Commission is platform revenue. Net revenue is commission minus discounts the platform funds. Driver earnings are fares minus commission. Cash collection is not confirmed in the system."
            >
              <KpiGrid metrics={data.sections.financial} links={links} />
            </Section>
          )}

          <Columns>
            {data.financial_visible && data.revenue_trends ? (
              <Section
                title="Revenue trend"
                actions={
                  <ToggleButtonGroup size="small" exclusive sx={{ "& .MuiToggleButton-root": { textTransform: "none", px: 1.5 } }} value={grain} onChange={(_, value) => value && setGrain(value)}>
                    <ToggleButton value="day">Daily</ToggleButton>
                    <ToggleButton value="week">Weekly</ToggleButton>
                    <ToggleButton value="month">Monthly</ToggleButton>
                  </ToggleButtonGroup>
                }
              >
                <TrendChart
                  data={data.revenue_trends[grain]}
                  unit="ngn"
                  kind="line"
                  series={[
                    { key: "gbv", label: "GBV", unit: "ngn" },
                    { key: "commission", label: "Commission", unit: "ngn" },
                    { key: "net_revenue", label: "Net revenue", unit: "ngn" },
                    { key: "driver_earnings", label: "Driver earnings", unit: "ngn", dashed: true },
                  ]}
                />
              </Section>
            ) : (
              <Section title="Trips trend">
                <TrendChart data={data.trend} series={[{ key: "booking_requests", label: "Bookings" }, { key: "trips_completed", label: "Completed trips" }]} />
              </Section>
            )}
            <Section title="Riders with completed trips" subtitle="New = first ever completed trip in this period.">
              <Donut data={[{ name: "New", value: data.new_vs_returning.new }, { name: "Returning", value: data.new_vs_returning.returning }]} />
            </Section>
          </Columns>

          {data.financial_visible && (
            <Section title="Bookings and completed trips">
              <TrendChart data={data.trend} series={[{ key: "booking_requests", label: "Bookings" }, { key: "trips_completed", label: "Completed trips" }]} height={240} />
            </Section>
          )}

          <Columns template={{ xs: "1fr", lg: "1fr 1fr" }}>
            <Section title="Growth">
              <KpiGrid metrics={data.sections.growth} min={180} compact />
            </Section>
            <Section title="Registrations">
              <TrendChart data={data.registrations} kind="bar" series={[{ key: "new_riders", label: "New riders" }, { key: "new_drivers", label: "New drivers" }]} height={250} />
            </Section>
          </Columns>

          <FreshnessNote freshness={data.freshness} filters={data.filters} />
        </>
      ) : null}
    </Stack>
  );
}
