import { useState } from "react";
import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useAnalytics } from "../api";
import { GlobalFilterBar, useAnalyticsFilters } from "../filters";
import { formatMoney, formatNumber, formatPercent } from "../format";
import type { Envelope, Metric, Paged, Person, SeriesRow } from "../types";
import { Columns, ErrorState, ExportMenu, FreshnessNote, KpiGrid, Loading, PeriodCaption, Section } from "../components/ui";
import { CohortHeatmap, CohortRow, Donut, TrendChart } from "../components/charts";
import DataTable from "../components/DataTable";

interface RidersData extends Envelope {
  metrics: Metric[];
  new_vs_returning: { new: number; returning: number };
  payment_preferences: { cash_trips: number; wallet_trips: number; cash_share: number | null };
  registrations: SeriesRow[];
  top_areas: { area: string; label: string; pickups: number; dropoffs: number }[];
}

type RiderRow = { rider_id: string; rider?: Person; spend?: number; trips?: number; bookings?: number; avg_trip_spend?: number; previous_bookings?: number; change_pct?: number } & Record<string, unknown>;

export default function RidersAnalyticsPage() {
  const { apiParams } = useAnalyticsFilters();
  const { data, loading, error, reload } = useAnalytics<RidersData>("riders/", apiParams);
  const [measure, setMeasure] = useState<"completing" | "active">("completing");
  const cohorts = useAnalytics<{ cohorts: CohortRow[]; definition: string }>("riders/cohorts/", { months: 12, measure });
  const [list, setList] = useState<"top" | "declining">("top");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const riders = useAnalytics<Paged<RiderRow> & { definition: string }>("riders/lists/", { ...apiParams, list, page, page_size: pageSize });

  return (
    <Stack spacing={2.5}>
      <GlobalFilterBar show={[]} onRefresh={reload} />
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <>
          <Stack sx={{ justifyContent: "space-between" }} direction={{ xs: "column", md: "row" }} spacing={1}>
            <PeriodCaption period={data.period} comparison={data.comparison} />
            <ExportMenu path="riders/" params={apiParams} />
          </Stack>
          <Section title="Rider activity">
            <KpiGrid metrics={data.metrics} />
          </Section>
          <Columns>
            <Section title="New rider registrations">
              <TrendChart data={data.registrations} kind="bar" series={[{ key: "new_riders", label: "New riders" }]} height={240} />
            </Section>
            <Section title="Payment preference" subtitle="Completed trips by payment method">
              <Donut data={[{ name: "Cash", value: data.payment_preferences.cash_trips }, { name: "Wallet", value: data.payment_preferences.wallet_trips }]} />
            </Section>
          </Columns>
          <Section title="Most frequent pickup areas" subtitle="Pickups and drop-offs by area in the period">
            <DataTable
              columns={[
                { key: "label", label: "Area (example address)", render: (row) => row.label || row.area },
                { key: "pickups", label: "Pickups (bookings)", align: "right", render: (row) => formatNumber(row.pickups) },
                { key: "dropoffs", label: "Drop-offs (completed)", align: "right", render: (row) => formatNumber(row.dropoffs) },
              ]}
              rows={data.top_areas}
            />
          </Section>
          <FreshnessNote freshness={data.freshness} filters={data.filters} />
        </>
      ) : null}

      <Section
        title="Cohort retention"
        subtitle={cohorts.data?.definition}
        actions={
          <Stack direction="row" spacing={1}>
            <ToggleButtonGroup size="small" exclusive sx={{ "& .MuiToggleButton-root": { textTransform: "none", px: 1.5 } }} value={measure} onChange={(_, value) => value && setMeasure(value)}>
              <ToggleButton value="completing">Completed a trip</ToggleButton>
              <ToggleButton value="active">Booked</ToggleButton>
            </ToggleButtonGroup>
            <ExportMenu path="riders/cohorts/" params={{ months: "12", measure }} />
          </Stack>
        }
      >
        {cohorts.loading && !cohorts.data ? <Loading height={200} /> : cohorts.error ? <ErrorState message={cohorts.error} /> : cohorts.data?.cohorts.length ? <CohortHeatmap cohorts={cohorts.data.cohorts} /> : <Typography sx={{ color: "var(--text-secondary)" }}>Cohorts appear after the nightly refresh.</Typography>}
      </Section>

      <Section
        title={list === "top" ? "Most valuable riders" : "Riders with declining activity"}
        subtitle={riders.data?.definition}
        actions={
          <Stack direction="row" spacing={1}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={list}
              onChange={(_, value) => {
                if (value) {
                  setList(value);
                  setPage(1);
                }
              }}
            >
              <ToggleButton value="top">Top spenders</ToggleButton>
              <ToggleButton value="declining">Declining</ToggleButton>
            </ToggleButtonGroup>
            <ExportMenu path="riders/lists/" params={{ ...apiParams, list }} />
          </Stack>
        }
      >
        <DataTable<RiderRow>
          loading={riders.loading}
          rows={riders.data?.results || []}
          count={riders.data?.count}
          page={page}
          pageSize={pageSize}
          onPage={setPage}
          onPageSize={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          columns={
            list === "top"
              ? [
                  { key: "rider", label: "Rider", render: (row) => row.rider?.name || row.rider_id },
                  { key: "email", label: "Email", render: (row) => row.rider?.email || "—" },
                  { key: "spend", label: "Spend", align: "right", render: (row) => formatMoney(row.spend) },
                  { key: "trips", label: "Completed trips", align: "right", render: (row) => formatNumber(row.trips) },
                  { key: "bookings", label: "Bookings", align: "right", render: (row) => formatNumber(row.bookings) },
                  { key: "avg_trip_spend", label: "Average trip", align: "right", render: (row) => formatMoney(row.avg_trip_spend) },
                ]
              : [
                  { key: "rider", label: "Rider", render: (row) => row.rider?.name || row.rider_id },
                  { key: "email", label: "Email", render: (row) => row.rider?.email || "—" },
                  { key: "previous_bookings", label: "Bookings before", align: "right", render: (row) => formatNumber(row.previous_bookings) },
                  { key: "bookings", label: "Bookings now", align: "right", render: (row) => formatNumber(row.bookings) },
                  { key: "change_pct", label: "Change", align: "right", render: (row) => formatPercent(row.change_pct) },
                ]
          }
        />
      </Section>
    </Stack>
  );
}
