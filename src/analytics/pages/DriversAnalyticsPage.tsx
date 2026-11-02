import { useState } from "react";
import { Box, Drawer, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { MdClose } from "react-icons/md";
import { useAnalytics } from "../api";
import { GlobalFilterBar, useAnalyticsFilters } from "../filters";
import { formatMoney, formatNumber, formatPercent } from "../format";
import type { Envelope, Metric, Paged, Person, SeriesRow } from "../types";
import { ErrorState, ExportMenu, FreshnessNote, KpiGrid, Loading, PeriodCaption, Section } from "../components/ui";
import { TrendChart } from "../components/charts";
import DataTable from "../components/DataTable";

interface DriversData extends Envelope {
  status: Record<string, number>;
  registered_drivers: number;
  metrics: Metric[];
  trend: SeriesRow[];
  availability_tracked_days: number;
}

type LeaderRow = {
  driver_id: string;
  driver?: Person;
  rank: number;
  value: number;
  vehicle_type: string;
  trips_completed: number;
  trips_matched: number;
  acceptance_rate: number | null;
  completion_rate: number | null;
  cancellation_rate: number | null;
  earnings: number;
  online_hours: number | null;
  utilisation: number | null;
  rating: number | null;
  earnings_per_online_hour: number | null;
} & Record<string, unknown>;

const MEASURES: [string, string][] = [
  ["earnings", "Highest earnings"],
  ["trips_completed", "Most completed trips"],
  ["acceptance_rate", "Highest acceptance rate"],
  ["completion_rate", "Highest completion rate"],
  ["rating", "Best customer rating"],
  ["cancellation_rate", "Lowest cancellation rate"],
  ["utilisation", "Highest utilisation"],
  ["earnings_per_online_hour", "Earnings per online hour"],
];

const STATUS_LABELS: [string, string][] = [
  ["approved", "Approved"],
  ["pending_verification", "Pending verification"],
  ["in_review", "In review"],
  ["rejected", "Rejected"],
  ["suspended", "Suspended"],
  ["online", "Online"],
  ["offline", "Offline (approved)"],
  ["on_trip", "On a trip"],
  ["available", "Available for requests"],
];

function DriverDrawer({ driverId, onClose, params }: { driverId: string | null; onClose: () => void; params: Record<string, string | undefined> }) {
  const detail = useAnalytics<{ driver: Person; profile: Record<string, unknown>; rates: Record<string, number | null>; totals: Record<string, number>; daily: Record<string, number | string>[] }>(driverId ? `drivers/${driverId}/` : null, params);
  return (
    <Drawer anchor="right" open={Boolean(driverId)} onClose={onClose} slotProps={{ paper: { sx: { width: { xs: "100%", sm: 520 }, background: "var(--bg-secondary)", p: 3 } } }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>{detail.data?.driver?.name || "Driver"}</Typography>
        <IconButton onClick={onClose}>
          <MdClose />
        </IconButton>
      </Stack>
      {detail.loading && !detail.data ? (
        <Loading height={180} />
      ) : detail.error ? (
        <ErrorState message={detail.error} />
      ) : detail.data ? (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
            {String(detail.data.profile.type || "—")} · KYC {String(detail.data.profile.kyc_status)} · {detail.data.profile.ready_for_dispatch ? "online" : "offline"}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            {[
              ["Completed trips", formatNumber(detail.data.totals.trips_completed)],
              ["Earnings", formatMoney(detail.data.totals.earnings)],
              ["Acceptance", formatPercent(detail.data.rates.acceptance_rate)],
              ["Completion", formatPercent(detail.data.rates.completion_rate)],
              ["Cancellation", formatPercent(detail.data.rates.cancellation_rate)],
              ["Rating", detail.data.rates.rating ? `${detail.data.rates.rating} ★` : "—"],
              ["Online hours", detail.data.rates.online_hours ?? "Not tracked"],
              ["Utilisation", formatPercent(detail.data.rates.utilisation)],
            ].map(([label, value]) => (
              <Box key={String(label)} sx={{ border: "1px solid var(--border)", borderRadius: 2, p: 1.5 }}>
                <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{String(value)}</Typography>
              </Box>
            ))}
          </Box>
          <TrendChart data={detail.data.daily.map((row) => ({ ...row, bucket: row.date }))} kind="bar" series={[{ key: "trips_completed", label: "Completed" }, { key: "trips_cancelled_by_driver", label: "Cancelled by driver" }]} height={220} />
        </Stack>
      ) : null}
    </Drawer>
  );
}

export default function DriversAnalyticsPage() {
  const { apiParams } = useAnalyticsFilters();
  const { data, loading, error, reload } = useAnalytics<DriversData>("drivers/", apiParams);
  const [sort, setSort] = useState("earnings");
  const [minTrips, setMinTrips] = useState(5);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selected, setSelected] = useState<string | null>(null);
  const board = useAnalytics<Paged<LeaderRow> & { definition: string; min_trips: number | null }>("drivers/leaderboard/", { ...apiParams, sort, min_trips: minTrips, page, page_size: pageSize });
  const measureLabel = MEASURES.find(([key]) => key === sort)?.[1] || sort;
  const formatMeasure = (row: LeaderRow) =>
    ["earnings", "earnings_per_online_hour"].includes(sort) ? formatMoney(row.value) : sort.endsWith("rate") || sort === "utilisation" ? formatPercent(row.value) : sort === "rating" ? `${row.value} ★` : formatNumber(row.value);

  return (
    <Stack spacing={2.5}>
      <GlobalFilterBar show={["vehicle_type"]} onRefresh={reload} notApplicable={data?.filters.not_applicable} />
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
            <PeriodCaption period={data.period} comparison={data.comparison} />
            <ExportMenu path="drivers/" params={apiParams} />
          </Stack>
          <Section title="Driver network right now" subtitle={`${formatNumber(data.registered_drivers)} registered drivers`} dense>
            <KpiGrid compact min={150} metrics={STATUS_LABELS.map(([key, label]) => ({ key, label, value: data.status[key] ?? null, previous: null, change_pct: null, unit: "count", availability: "available", note: null }))} />
          </Section>
          <Section title="Performance in the period" subtitle={data.availability_tracked_days ? undefined : "Online hours and utilisation start once availability sampling is running."}>
            <KpiGrid metrics={data.metrics} />
          </Section>
          <Section title="Completed trips">
            <TrendChart data={data.trend} kind="bar" series={[{ key: "trips_completed", label: "Completed trips" }]} height={220} />
          </Section>
          <FreshnessNote freshness={data.freshness} filters={data.filters} />
        </>
      ) : null}

      <Section
        title="Driver leaderboard"
        subtitle={board.data?.definition}
        actions={
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              select
              size="small"
              label="Rank by"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              sx={{ minWidth: 220 }}
            >
              {MEASURES.map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              type="number"
              label="Min. matched trips"
              value={minTrips}
              onChange={(e) => {
                setMinTrips(Math.max(0, Number(e.target.value)));
                setPage(1);
              }}
              sx={{ width: 150 }}
            />
            <ExportMenu path="drivers/leaderboard/" params={{ ...apiParams, sort, min_trips: String(minTrips) }} />
          </Stack>
        }
      >
        <DataTable<LeaderRow>
          loading={board.loading}
          rows={board.data?.results || []}
          count={board.data?.count}
          page={page}
          pageSize={pageSize}
          onPage={setPage}
          onPageSize={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          columns={[
            { key: "rank", label: "#", width: 48 },
            {
              key: "driver",
              label: "Driver",
              render: (row) => (
                <Box component="span" onClick={() => setSelected(row.driver_id)} sx={{ cursor: "pointer", color: "var(--accent-gold)", fontWeight: 500 }}>
                  {row.driver?.name || row.driver_id}
                </Box>
              ),
            },
            { key: "value", label: measureLabel, align: "right", render: formatMeasure },
            { key: "trips_completed", label: "Completed", align: "right" },
            { key: "acceptance_rate", label: "Acceptance", align: "right", render: (row) => formatPercent(row.acceptance_rate) },
            { key: "completion_rate", label: "Completion", align: "right", render: (row) => formatPercent(row.completion_rate) },
            { key: "cancellation_rate", label: "Cancellation", align: "right", render: (row) => formatPercent(row.cancellation_rate) },
            { key: "earnings", label: "Earnings", align: "right", render: (row) => formatMoney(row.earnings) },
            { key: "online_hours", label: "Online h", align: "right", render: (row) => (row.online_hours === null ? "—" : formatNumber(row.online_hours, 1)) },
            { key: "utilisation", label: "Utilisation", align: "right", render: (row) => formatPercent(row.utilisation) },
            { key: "rating", label: "Rating", align: "right", render: (row) => (row.rating ? `${row.rating} ★` : "—") },
          ]}
        />
      </Section>
      <DriverDrawer driverId={selected} onClose={() => setSelected(null)} params={apiParams} />
    </Stack>
  );
}
