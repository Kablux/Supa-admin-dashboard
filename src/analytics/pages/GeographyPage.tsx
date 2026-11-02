import { useState } from "react";
import { Alert, Box, Chip, FormControlLabel, MenuItem, Stack, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useAnalytics } from "../api";
import { GlobalFilterBar, useAnalyticsFilters } from "../filters";
import { formatMoney, formatNumber, formatPercent } from "../format";
import type { Envelope } from "../types";
import { Columns, ErrorState, ExportMenu, FreshnessNote, Loading, PeriodCaption, Section } from "../components/ui";
import DataTable from "../components/DataTable";
import GeoMap, { GeoCell, LiveSupplyPoint } from "../components/GeoMap";

type Cell = GeoCell & {
  booking_requests: number;
  trips_completed: number;
  cancellations: number;
  requests_expired: number;
  dropoffs: number;
  gbv: number;
  completion_rate: number | null;
  cancellation_rate: number | null;
  unmet_rate: number | null;
  available_driver_hours: number;
  bookings_per_driver_hour: number | null;
  flags: string[];
};

interface GeoData extends Envelope {
  level: "area" | "cell";
  supply_tracked: boolean;
  supply_note: string | null;
  cells: Cell[];
  recruitment_opportunities: Cell[];
  top_destinations: { id: string; label: string; dropoffs: number }[];
  top_revenue: { id: string; label: string; gbv: number; commission: number }[];
  flag_definitions: Record<string, string>;
  live_supply: LiveSupplyPoint[];
}

interface RoutesData {
  routes: { origin: string; origin_label: string; destination: string; destination_label: string; trips: number; gbv: number }[];
}

const MEASURES: { key: string; label: string; format: (value: number) => string }[] = [
  { key: "booking_requests", label: "Booking requests", format: (v) => formatNumber(v) },
  { key: "trips_completed", label: "Completed trips", format: (v) => formatNumber(v) },
  { key: "requests_expired", label: "Unmet demand (expired)", format: (v) => formatNumber(v) },
  { key: "cancellation_rate", label: "Cancellation rate", format: (v) => formatPercent(v) },
  { key: "gbv", label: "Revenue (GBV)", format: (v) => formatMoney(v) },
  { key: "available_driver_hours", label: "Available driver-hours", format: (v) => formatNumber(v, 1) },
  { key: "bookings_per_driver_hour", label: "Bookings per driver-hour", format: (v) => formatNumber(v, 2) },
];

const shortLabel = (row: { label?: string; id: string }) => (row.label || row.id).slice(0, 60);

export default function GeographyPage() {
  const { apiParams } = useAnalyticsFilters();
  const [level, setLevel] = useState<"area" | "cell">("area");
  const [measure, setMeasure] = useState("booking_requests");
  const [showLive, setShowLive] = useState(true);
  const { data, loading, error, reload } = useAnalytics<GeoData>("geography/", { ...apiParams, level });
  const routes = useAnalytics<RoutesData>("geography/routes/", apiParams);
  const chosen = MEASURES.find((item) => item.key === measure) || MEASURES[0];

  return (
    <Stack spacing={2.5}>
      <GlobalFilterBar show={["area"]} onRefresh={reload} notApplicable={data?.filters.not_applicable} />
      {loading && !data ? (
        <Loading height={460} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <>
          <Stack sx={{ justifyContent: "space-between" }} direction={{ xs: "column", md: "row" }} spacing={1}>
            <PeriodCaption period={data.period} />
            <ExportMenu path="geography/" params={{ ...apiParams, level }} />
          </Stack>
          {data.supply_note && <Alert severity="info" sx={{ borderRadius: 2 }}>{data.supply_note}</Alert>}
          <Section
            title="Demand and supply map"
            subtitle="Hexagons are H3 cells. Red outlines mark areas with insufficient drivers or high unmet demand."
            actions={
              <Stack sx={{ alignItems: "center" }} direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField select size="small" label="Colour by" value={measure} onChange={(e) => setMeasure(e.target.value)} sx={{ minWidth: 220 }}>
                  {MEASURES.map((item) => (
                    <MenuItem key={item.key} value={item.key}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <ToggleButtonGroup size="small" exclusive sx={{ "& .MuiToggleButton-root": { textTransform: "none", px: 1.5 } }} value={level} onChange={(_, value) => value && setLevel(value)}>
                  <ToggleButton value="area">Areas</ToggleButton>
                  <ToggleButton value="cell">Detail</ToggleButton>
                </ToggleButtonGroup>
                <FormControlLabel control={<Switch size="small" checked={showLive} onChange={(e) => setShowLive(e.target.checked)} />} label={<Typography sx={{ fontSize: 13 }}>Drivers now</Typography>} />
              </Stack>
            }
          >
            {data.cells.length ? <GeoMap cells={data.cells} metric={measure} label={chosen.label} format={chosen.format} live={showLive ? data.live_supply : []} /> : <Typography sx={{ color: "var(--text-secondary)" }}>No located bookings in this period.</Typography>}
          </Section>

          <Section title="Driver recruitment opportunities" subtitle="Areas where demand outstrips available drivers, ranked by unmet bookings.">
            <DataTable<Cell>
              rows={data.recruitment_opportunities}
              columns={[
                { key: "label", label: "Area", render: shortLabel },
                { key: "booking_requests", label: "Bookings", align: "right", render: (row) => formatNumber(row.booking_requests) },
                { key: "requests_expired", label: "Expired unmatched", align: "right", render: (row) => formatNumber(row.requests_expired) },
                { key: "unmet_rate", label: "Unmet rate", align: "right", render: (row) => formatPercent(row.unmet_rate) },
                { key: "available_driver_hours", label: "Driver-hours", align: "right", render: (row) => (data.supply_tracked ? formatNumber(row.available_driver_hours, 1) : "not tracked") },
                { key: "bookings_per_driver_hour", label: "Bookings / driver-hour", align: "right", render: (row) => formatNumber(row.bookings_per_driver_hour, 2) },
              ]}
              emptyText="No areas currently show demand exceeding supply."
            />
          </Section>

          <Section title="All areas">
            <DataTable<Cell>
              rows={data.cells.slice(0, 100)}
              columns={[
                { key: "label", label: "Area", render: shortLabel },
                { key: "booking_requests", label: "Bookings", align: "right" },
                { key: "trips_completed", label: "Completed", align: "right" },
                { key: "completion_rate", label: "Completion", align: "right", render: (row) => formatPercent(row.completion_rate) },
                { key: "cancellation_rate", label: "Cancellation", align: "right", render: (row) => formatPercent(row.cancellation_rate) },
                { key: "gbv", label: "GBV", align: "right", render: (row) => formatMoney(row.gbv) },
                { key: "flags", label: "Flags", render: (row) => (
                    <Stack sx={{ flexWrap: "wrap", gap: 0.5 }} direction="row">
                      {row.flags.map((flag) => (
                        <Chip key={flag} size="small" label={flag.replace(/_/g, " ")} title={data.flag_definitions[flag]} sx={{ fontSize: 11, height: 20 }} />
                      ))}
                    </Stack>
                  ) },
              ]}
            />
          </Section>

          <Columns template={{ xs: "1fr", lg: "1fr 1fr" }}>
            <Section title="Most popular destinations">
              <DataTable rows={data.top_destinations as unknown as Record<string, unknown>[]} columns={[{ key: "label", label: "Area", render: (row) => shortLabel(row as unknown as Cell) }, { key: "dropoffs", label: "Drop-offs", align: "right" }]} />
            </Section>
            <Section title="Highest revenue areas">
              <DataTable rows={data.top_revenue as unknown as Record<string, unknown>[]} columns={[{ key: "label", label: "Area", render: (row) => shortLabel(row as unknown as Cell) }, { key: "gbv", label: "GBV", align: "right", render: (row) => formatMoney(row.gbv as number) }, { key: "commission", label: "Commission", align: "right", render: (row) => formatMoney(row.commission as number) }]} />
            </Section>
          </Columns>
          <Box>
            <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
              Flags: {Object.entries(data.flag_definitions).map(([key, text]) => `${key.replace(/_/g, " ")} = ${text}`).join(" · ")}
            </Typography>
          </Box>
          <FreshnessNote freshness={data.freshness} filters={data.filters} />
        </>
      ) : null}

      <Section title="Popular routes" subtitle="Completed trips between areas" actions={<ExportMenu path="geography/routes/" params={apiParams} />}>
        <DataTable
          loading={routes.loading}
          rows={(routes.data?.routes || []) as unknown as Record<string, unknown>[]}
          columns={[
            { key: "origin_label", label: "From", render: (row) => String(row.origin_label || row.origin).slice(0, 50) },
            { key: "destination_label", label: "To", render: (row) => String(row.destination_label || row.destination).slice(0, 50) },
            { key: "trips", label: "Trips", align: "right" },
            { key: "gbv", label: "GBV", align: "right", render: (row) => formatMoney(row.gbv as number) },
          ]}
        />
      </Section>
    </Stack>
  );
}
