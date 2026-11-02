import { Link as RouterLink, useParams } from "react-router-dom";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { MdPrint } from "react-icons/md";
import { useAnalytics } from "../api";
import { GlobalFilterBar, useAnalyticsFilters } from "../filters";
import { formatDateTime } from "../format";
import { ErrorState, ExportMenu, Grid, Loading, Section } from "../components/ui";
import DataTable from "../components/DataTable";

interface Catalogue {
  reports: { key: string; title: string; default_period: string }[];
  can_export: boolean;
}

interface Report {
  key: string;
  title: string;
  period: { label: string; start: string; end: string };
  generated_at: string;
  sections: { title: string; columns: { key: string; label: string }[]; rows: Record<string, unknown>[] }[];
}

const DESCRIPTIONS: Record<string, string> = {
  daily_operations: "Yesterday hour by hour, with the alerts raised.",
  weekly_business: "Last week day by day with growth and revenue.",
  monthly_finance: "Last month's money: GBV, commission, discounts, earnings, cash, top-ups and payouts.",
  driver_performance: "Every active driver with rates, earnings and hours.",
  rider_retention: "Signup cohorts with first-trip and 30/60/90-day retention.",
  trip_cancellations: "Who cancelled, when, where and why.",
  geographic_demand: "Demand, supply and revenue by area, with flags.",
};

function cellText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") return value.toLocaleString("en-NG", { maximumFractionDigits: 2 });
  return String(value);
}

export function ReportView() {
  const { key = "" } = useParams();
  const { apiParams, values, search } = useAnalyticsFilters();
  const explicitPeriod = new URLSearchParams(search).has("period") || Boolean(values.start);
  const params = explicitPeriod ? apiParams : { ...apiParams, period: undefined };
  const { data, loading, error, reload } = useAnalytics<Report>(`reports/${key}/`, params);
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={1} sx={{ "@media print": { display: "none" } }}>
        <Link component={RouterLink} to="/analytics/reports" sx={{ fontSize: 13 }}>
          ← All reports
        </Link>
      </Stack>
      <GlobalFilterBar show={[]} onRefresh={reload} />
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <Stack spacing={2.5}>
          <Stack sx={{ justifyContent: "space-between" }} direction={{ xs: "column", md: "row" }} spacing={1}>
            <Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Kablux · {data.title}</Typography>
              <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {data.period.label} ({data.period.start} to {data.period.end}) · generated {formatDateTime(data.generated_at)} Lagos time
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ "@media print": { display: "none" } }}>
              <Button size="small" variant="outlined" color="inherit" startIcon={<MdPrint />} onClick={() => window.print()} sx={{ borderColor: "var(--border)", textTransform: "none" }}>
                Print
              </Button>
              <ExportMenu path={`reports/${key}/`} params={params} />
            </Stack>
          </Stack>
          {data.sections.map((section) => (
            <Section key={section.title} title={section.title}>
              <DataTable rows={section.rows} columns={section.columns.map((column, index) => ({ key: column.key, label: column.label, align: index === 0 ? "left" : "right", nowrap: index === 0, render: (row) => cellText(row[column.key]) }))} emptyText="Nothing to report for this period." />
            </Section>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}

export default function ReportsPage() {
  const { search } = useAnalyticsFilters();
  const { data, loading, error, reload } = useAnalytics<Catalogue>("reports/");
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
        Open a report to view or print it, then download it as CSV or Excel{data?.can_export ? "" : " (your role can view but not export)"}. Each report opens on its usual period; change it with the period filter.
      </Typography>
      <Grid min={260}>
        {(data?.reports || []).map((report) => (
          <Box key={report.key} component={RouterLink} to={`/analytics/reports/${report.key}${search ? `?${search}` : ""}`} sx={{ textDecoration: "none", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 3, p: 2.5, "&:hover": { borderColor: "var(--accent-gold)" } }}>
            <Typography sx={{ fontWeight: 600, color: "var(--text-primary)" }}>{report.title}</Typography>
            <Typography sx={{ fontSize: 13, color: "var(--text-secondary)", mt: 0.5 }}>{DESCRIPTIONS[report.key]}</Typography>
            <Typography sx={{ fontSize: 12, color: "var(--text-muted)", mt: 1.5 }}>Default period: {report.default_period.replace(/_/g, " ")}</Typography>
          </Box>
        ))}
      </Grid>
    </Stack>
  );
}
