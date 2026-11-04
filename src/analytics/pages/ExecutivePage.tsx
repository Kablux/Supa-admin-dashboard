
import { useState } from "react";
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { MdBolt, MdShowChart } from "react-icons/md";

import { useAnalytics } from "../api";
import { GlobalFilterBar, useAnalyticsFilters } from "../filters";
import type {
  Envelope,
  Insight,
  LiveSnapshot,
  Metric,
  SeriesRow,
} from "../types";

import {
  Columns,
  ErrorState,
  ExportMenu,
  FreshnessNote,
  KpiGrid,
  Loading,
  PeriodCaption,
  Section,
} from "../components/ui";

import { Donut, TrendChart } from "../components/charts";
import { InsightList } from "../components/intel";

interface ExecutiveData extends Envelope {
  sections: {
    business: Metric[];
    financial?: Metric[];
    growth: Metric[];
  };
  financial_visible: boolean;
  trend: SeriesRow[];
  revenue_trends: Record<"day" | "week" | "month", SeriesRow[]> | null;
  registrations: SeriesRow[];
  new_vs_returning: {
    new: number;
    returning: number;
    total: number;
  };
  live: LiveSnapshot;
  insights: Insight[];
}

export function recordsLink(
  kind: string,
  search: string,
  extra: Record<string, string> = {}
) {
  const params = new URLSearchParams(search);
  Object.entries(extra).forEach(([key, value]) => params.set(key, value));

  return `/analytics/records/${kind}?${params.toString()}`;
}

const toggleButtonStyles = {
  textTransform: "none",
  fontSize: 12,
  fontWeight: 600,
  px: 1.75,
  py: 0.75,
  minWidth: 65,
  border: "1px solid rgba(255,255,255,0.08) !important",
  color: "var(--text-secondary, #A0A6B5)",
  background: "rgba(255,255,255,0.025)",
  transition: "all 0.2s ease",

  "&:hover": {
    background: "rgba(255,190,24,0.08)",
    color: "#FFBE18",
  },

  "&.Mui-selected": {
    color: "#FFBE18",
    background: "rgba(255,190,24,0.12)",
    borderColor: "rgba(255,190,24,0.3) !important",
  },

  "&.Mui-selected:hover": {
    background: "rgba(255,190,24,0.17)",
  },
};

export default function ExecutivePage() {
  const { apiParams, search } = useAnalyticsFilters();

  const { data, loading, error, reload } = useAnalytics<ExecutiveData>(
    "executive/",
    apiParams
  );

  const [grain, setGrain] = useState<"day" | "week" | "month">("day");

  const links = {
    booking_requests: recordsLink("bookings", search),
    failed_bookings: recordsLink("bookings", search, {
      status: "expired",
    }),
    request_cancellations: recordsLink("bookings", search, {
      status: "cancelled",
    }),
    total_trips: recordsLink("trips", search),
    completed_trips: recordsLink("trips", search, {
      status: "completed",
    }),
    cancelled_trips: recordsLink("trips", search, {
      status: "cancelled",
    }),
    gbv: recordsLink("trip-revenue", search),
    commission: recordsLink("trip-revenue", search),
    net_revenue: recordsLink("trip-revenue", search),
    driver_earnings: recordsLink("trip-revenue", search),
    topups: recordsLink("transactions", search, {
      type: "topup",
    }),
  };

  return (
    <Stack spacing={3}>
      {/* Global filters */}
      <GlobalFilterBar
        onRefresh={reload}
        notApplicable={data?.filters.not_applicable}
      />

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <>
          {/* Page overview */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
              <PeriodCaption
                period={data.period}
                comparison={data.comparison}
              />

            <Box sx={{ flexShrink: 0 }}>
              <ExportMenu path="executive/" params={apiParams} />
            </Box>
          </Box>

          {/* Insights */}
          <Section
            title="What changed"
            subtitle="Explanations backed by the figures they cite. Compared with the previous equivalent period."
          >
            <InsightList insights={data.insights} compact />
          </Section>

          {/* Live metrics */}
          <Section
            title="Right now"
            subtitle="A real-time snapshot of current platform activity."
            dense
          >
            <Stack
              spacing={1.5}
              sx={{
                mb: 2,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color: "var(--text-muted, #8A92A6)",
                }}
              >
                Last snapshot:{" "}
                {new Date(data.live.as_of).toLocaleTimeString("en-GB", {
                  timeZone: "Africa/Lagos",
                })}{" "}
                (Lagos time)
              </Typography>

              <Stack direction="row" spacing={0.6}>
                <MdBolt size={15} color="#FFBE18" />
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#FFBE18",
                    fontWeight: 600,
                  }}
                >
                  Current platform activity
                </Typography>
              </Stack>
            </Stack>

            <KpiGrid
              compact
              min={150}
              metrics={[
                {
                  key: "ongoing_trips",
                  label: "Ongoing trips",
                  value: data.live.trips.ongoing,
                  previous: null,
                  change_pct: null,
                  unit: "count",
                  availability: "available",
                  note: null,
                },
                {
                  key: "open_requests",
                  label: "Open requests",
                  value: data.live.trips.open_requests,
                  previous: null,
                  change_pct: null,
                  unit: "count",
                  availability: "available",
                  note: null,
                },
                {
                  key: "online_drivers_now",
                  label: "Drivers online",
                  value: data.live.drivers.online,
                  previous: null,
                  change_pct: null,
                  unit: "count",
                  availability: "available",
                  note: null,
                },
                {
                  key: "available_drivers",
                  label: "Available drivers",
                  value: data.live.drivers.available,
                  previous: null,
                  change_pct: null,
                  unit: "count",
                  availability: "available",
                  note: null,
                },
                {
                  key: "on_trip_drivers",
                  label: "Drivers on a trip",
                  value: data.live.drivers.on_trip,
                  previous: null,
                  change_pct: null,
                  unit: "count",
                  availability: "available",
                  note: null,
                },
              ]}
            />
          </Section>

          {/* Business KPIs */}
          <Section
            title="Business overview"
            subtitle="Key indicators showing booking activity and overall platform performance."
          >
            <KpiGrid metrics={data.sections.business} links={links} />
          </Section>

          {/* Financial KPIs */}
          {data.financial_visible && data.sections.financial && (
            <Section
              title="Financial performance"
              subtitle="GBV is what riders agreed to pay before discounts.
                  Commission is platform revenue. Net revenue is commission
                  minus discounts the platform funds. Driver earnings are
                  fares minus commission. Cash collection is not confirmed
                  in the system."
            >
              <KpiGrid
                metrics={data.sections.financial}
                links={links}
              />
            </Section>
          )}

          {/* Revenue and rider trends */}
          <Columns>
            {data.financial_visible && data.revenue_trends ? (
              <Section
                title="Revenue trend"
                subtitle="Track gross booking value, commission and net revenue over time."
                actions={
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={grain}
                    onChange={(_, value) => value && setGrain(value)}
                    sx={{
                      p: 0.4,
                      gap: 1,
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.025)",
                      "& .MuiToggleButtonGroup-grouped": {
                        borderRadius: "7px !important",
                      },
                    }}
                  >
                    <ToggleButton value="day" sx={toggleButtonStyles}>
                      Daily
                    </ToggleButton>

                    <ToggleButton value="week" sx={toggleButtonStyles}>
                      Weekly
                    </ToggleButton>

                    <ToggleButton value="month" sx={toggleButtonStyles}>
                      Monthly
                    </ToggleButton>
                  </ToggleButtonGroup>
                }
              >
                <TrendChart
                  data={data.revenue_trends[grain]}
                  unit="ngn"
                  kind="line"
                  series={[
                    { key: "gbv", label: "GBV", unit: "ngn" },
                    {
                      key: "commission",
                      label: "Commission",
                      unit: "ngn",
                    },
                    {
                      key: "net_revenue",
                      label: "Net revenue",
                      unit: "ngn",
                    },
                    {
                      key: "driver_earnings",
                      label: "Driver earnings",
                      unit: "ngn",
                      dashed: true,
                    },
                  ]}
                />
              </Section>
            ) : (
              <Section
                title="Trips trend"
                subtitle="Booking requests compared with completed trips."
              >
                <TrendChart
                  data={data.trend}
                  series={[
                    {
                      key: "booking_requests",
                      label: "Bookings",
                    },
                    {
                      key: "trips_completed",
                      label: "Completed trips",
                    },
                  ]}
                />
              </Section>
            )}

            <Section
              title="Riders with completed trips"
              subtitle="New riders completing their first trip versus returning riders."
            >
              <Donut
                data={[
                  {
                    name: "New",
                    value: data.new_vs_returning.new,
                  },
                  {
                    name: "Returning",
                    value: data.new_vs_returning.returning,
                  },
                ]}
              />

              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: "9px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid var(--border, rgba(255,255,255,0.06))",
                }}
              >
                <Stack
                  direction="row"
                  // justifyContent="space-between"
                  // alignItems="center"
                >
                  <Typography
                    sx={{
                      color: "var(--text-secondary, #A0A6B5)",
                      fontSize: 12,
                    }}
                  >
                    Total riders
                  </Typography>

                  <Typography
                    sx={{
                      color: "var(--text-primary, #fff)",
                      fontSize: 17,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {data.new_vs_returning.total.toLocaleString()}
                  </Typography>
                </Stack>
              </Box>
            </Section>
          </Columns>

          {/* Booking trends */}
          {data.financial_visible && (
            <Section
              title="Bookings and completed trips"
              subtitle="Compare booking demand against successfully completed trips."
            >
              <TrendChart
                data={data.trend}
                series={[
                  {
                    key: "booking_requests",
                    label: "Bookings",
                  },
                  {
                    key: "trips_completed",
                    label: "Completed trips",
                  },
                ]}
                height={240}
              />
            </Section>
          )}

          {/* Growth and registrations */}
          <Columns template={{ xs: "1fr", lg: "1fr 1fr" }}>
            <Section
              title="Growth"
              subtitle="Key platform growth indicators for the selected period."
            >
              <KpiGrid
                metrics={data.sections.growth}
                min={180}
                compact
              />
            </Section>

            <Section
              title="Registrations"
              subtitle="New rider and driver registrations over time."
            >
              <TrendChart
                data={data.registrations}
                kind="bar"
                series={[
                  {
                    key: "new_riders",
                    label: "New riders",
                  },
                  {
                    key: "new_drivers",
                    label: "New drivers",
                  },
                ]}
                height={250}
              />
            </Section>
          </Columns>

          {/* Data freshness */}
          <Box
            sx={{
              p: 2,
              borderRadius: "11px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border, rgba(255,255,255,0.06))",
            }}
          >
            <FreshnessNote
              freshness={data.freshness}
              filters={data.filters}
            />
          </Box>
        </>
      ) : null}
    </Stack>
  );
}
