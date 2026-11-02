import { useState } from "react";
import { Link as RouterLink, useParams, useSearchParams } from "react-router-dom";
import { Box, Link, Stack, Typography } from "@mui/material";
import { useAnalytics } from "../api";
import { FilterKey, GlobalFilterBar, useAnalyticsFilters } from "../filters";
import { formatDateTime, formatMoney, formatNumber } from "../format";
import type { Paged, Person } from "../types";
import { ErrorState, ExportMenu, Section } from "../components/ui";
import DataTable, { Column } from "../components/DataTable";

type Row = Record<string, unknown>;
const who = (value: unknown) => (value as Person | null)?.name || "—";

const KINDS: Record<string, { title: string; path: string; filters: FilterKey[]; columns: Column<Row>[]; back: string }> = {
  trips: {
    title: "Trips",
    path: "trips/records/",
    back: "/analytics/trips",
    filters: ["status", "ride_type", "payment_method", "area", "driver", "rider"],
    columns: [
      { key: "created_at", label: "Matched", nowrap: true, render: (r) => formatDateTime(r.created_at as string) },
      { key: "status", label: "Status" },
      { key: "payment_method", label: "Payment" },
      { key: "agreed_fare", label: "Fare", align: "right", render: (r) => formatMoney(r.agreed_fare as number) },
      { key: "promotional_discount", label: "Discount", align: "right", render: (r) => formatMoney(r.promotional_discount as number) },
      { key: "pickup_address", label: "Pickup", render: (r) => String(r.pickup_address || "—").slice(0, 40) },
      { key: "driver", label: "Driver", render: (r) => who(r.driver) },
      { key: "rider", label: "Rider", render: (r) => who(r.rider) },
      { key: "cancelled_by", label: "Cancelled by", render: (r) => String(r.cancelled_by || "—") },
      { key: "cancellation_reason", label: "Reason", render: (r) => String(r.cancellation_reason || "—").slice(0, 40) },
    ],
  },
  bookings: {
    title: "Booking requests",
    path: "bookings/records/",
    back: "/analytics/trips",
    filters: ["status", "ride_type", "payment_method", "area", "driver", "rider"],
    columns: [
      { key: "matching_started_at", label: "Booked", nowrap: true, render: (r) => formatDateTime(r.matching_started_at as string) },
      { key: "status", label: "Status" },
      { key: "ride__status", label: "Trip status", render: (r) => String(r.ride__status || "—") },
      { key: "drivers_notified", label: "Drivers notified", align: "right" },
      { key: "offers", label: "Offers", align: "right" },
      { key: "rider_offer", label: "Rider offer", align: "right", render: (r) => formatMoney(r.rider_offer as number) },
      { key: "estimated_fare", label: "Estimate", align: "right", render: (r) => formatMoney(r.estimated_fare as number) },
      { key: "pickup_address", label: "Pickup", render: (r) => String(r.pickup_address || "—").slice(0, 40) },
      { key: "rider", label: "Rider", render: (r) => who(r.rider) },
    ],
  },
  transactions: {
    title: "Ledger transactions",
    path: "finance/transactions/",
    back: "/analytics/finance",
    filters: [],
    columns: [
      { key: "created_at", label: "Created", nowrap: true, render: (r) => formatDateTime(r.created_at as string) },
      { key: "reference", label: "Reference" },
      { key: "type", label: "Type" },
      { key: "direction", label: "Direction" },
      { key: "status", label: "Status" },
      { key: "amount", label: "Amount", align: "right", render: (r) => formatMoney(r.amount as number, true) },
      { key: "wallet_id__user_type", label: "Wallet" },
      { key: "wallet_owner", label: "Owner", render: (r) => who(r.wallet_owner) },
      { key: "ride_ref", label: "Trip", render: (r) => String(r.ride_ref || "—").slice(0, 10) },
    ],
  },
  "trip-revenue": {
    title: "Trip revenue",
    path: "finance/trips/",
    back: "/analytics/finance",
    filters: ["payment_method", "ride_type", "driver", "rider"],
    columns: [
      { key: "end_time", label: "Completed", nowrap: true, render: (r) => formatDateTime(r.end_time as string) },
      { key: "payment_method", label: "Payment" },
      { key: "agreed_fare", label: "GBV", align: "right", render: (r) => formatMoney(r.agreed_fare as number, true) },
      { key: "promotional_discount", label: "Discount", align: "right", render: (r) => formatMoney(r.promotional_discount as number, true) },
      { key: "rider_paid", label: "Rider paid", align: "right", render: (r) => formatMoney(r.rider_paid as number, true) },
      { key: "commission", label: "Commission", align: "right", render: (r) => formatMoney(r.commission as number, true) },
      { key: "driver_earnings", label: "Driver earnings", align: "right", render: (r) => formatMoney(r.driver_earnings as number, true) },
      { key: "fee_rows", label: "Fee rows", align: "right", render: (r) => <span style={{ color: Number(r.fee_rows) === 1 ? undefined : "var(--danger)" }}>{formatNumber(r.fee_rows as number)}</span> },
      { key: "ledger_references", label: "Ledger references", render: (r) => <span title={String(r.ledger_references)}>{String(r.ledger_references || "—").slice(0, 28)}</span> },
      { key: "driver", label: "Driver", render: (r) => who(r.driver) },
    ],
  },
};

export default function RecordsPage() {
  const { kind = "trips" } = useParams();
  const config = KINDS[kind] || KINDS.trips;
  const { apiParams } = useAnalyticsFilters();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const extra = { type: searchParams.get("type") || undefined, tx_status: searchParams.get("tx_status") || undefined };
  const params = { ...apiParams, ...extra };
  const { data, loading, error, reload } = useAnalytics<Paged<Row> & { period: { label: string; start: string; end: string } }>(config.path, { ...params, page, page_size: pageSize });

  return (
    <Stack spacing={2.5}>
      <Link component={RouterLink} to={`${config.back}?${searchParams.toString()}`} sx={{ fontSize: 13 }}>
        ← Back
      </Link>
      <GlobalFilterBar show={config.filters} onRefresh={reload} />
      <Section
        title={config.title}
        subtitle={data ? `${formatNumber(data.count)} records · ${data.period.label} (${data.period.start} to ${data.period.end})${extra.type ? ` · type ${extra.type}` : ""}` : undefined}
        actions={<ExportMenu path={config.path} params={params} />}
      >
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : (
          <DataTable rows={data?.results || []} loading={loading} columns={config.columns} count={data?.count} page={page} pageSize={pageSize} onPage={setPage} onPageSize={(size) => { setPageSize(size); setPage(1); }} />
        )}
        <Box sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>Contact details are masked unless your role includes personal data. Viewing unmasked records is recorded in the audit log.</Typography>
        </Box>
      </Section>
    </Stack>
  );
}
