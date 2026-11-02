import { useEffect, useState } from "react";
import { Button, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { errorMessage, sendAnalytics, useAnalytics, useAnalyticsMe } from "../api";
import { useAnalyticsFilters } from "../filters";
import type { AlertItem, Insight, LiveSnapshot, Paged } from "../types";
import { Columns, ErrorState, KpiGrid, Loading, Section } from "../components/ui";
import { CategoryBars } from "../components/charts";
import { AlertList, InsightList } from "../components/intel";
import DataTable from "../components/DataTable";
import MapWidget from "../../components/dashboard/map/MapWidget";

interface OperationsData {
  live: LiveSnapshot;
  today: { hour: number; bookings: number; completed: number; expired: number; avg_available_drivers: number | null; usual_bookings: number; usual_completed: number }[];
  open_alerts: AlertItem[];
  open_alert_count: number;
}

interface Rule {
  key: string;
  name: string;
  category: string;
  metric: string;
  direction: string;
  warning_threshold_pct: number;
  critical_threshold_pct: number;
  min_volume: number;
  is_enabled: boolean;
  investigation: string;
}

function RulesTable() {
  const { can } = useAnalyticsMe();
  const { data, loading, reload } = useAnalytics<{ rules: Rule[] }>("alert-rules/");
  const [drafts, setDrafts] = useState<Record<string, Partial<Rule>>>({});
  useEffect(() => setDrafts({}), [data]);
  const editable = can("alerts.manage");
  const save = async (rule: Rule) => {
    try {
      await sendAnalytics("patch", "alert-rules/", { key: rule.key, ...drafts[rule.key] });
      toast.success("Threshold saved.");
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };
  const field = (rule: Rule, name: "warning_threshold_pct" | "critical_threshold_pct" | "min_volume") =>
    editable ? (
      <TextField size="small" type="number" value={drafts[rule.key]?.[name] ?? rule[name]} onChange={(e) => setDrafts({ ...drafts, [rule.key]: { ...drafts[rule.key], [name]: Number(e.target.value) } })} sx={{ width: 90 }} />
    ) : (
      rule[name]
    );
  return (
    <DataTable<Rule & Record<string, unknown>>
      loading={loading}
      rows={(data?.rules || []) as (Rule & Record<string, unknown>)[]}
      columns={[
        { key: "name", label: "Rule", render: (rule) => <span title={rule.investigation}>{rule.name}</span> },
        { key: "direction", label: "Watches", render: (rule) => (rule.direction === "both" ? "rise or drop" : rule.direction) },
        { key: "warning_threshold_pct", label: "Warning %", render: (rule) => field(rule, "warning_threshold_pct") },
        { key: "critical_threshold_pct", label: "Critical %", render: (rule) => field(rule, "critical_threshold_pct") },
        { key: "min_volume", label: "Min. volume", render: (rule) => field(rule, "min_volume") },
        { key: "is_enabled", label: "On", render: (rule) => <Switch size="small" disabled={!editable} checked={drafts[rule.key]?.is_enabled ?? rule.is_enabled} onChange={(e) => setDrafts({ ...drafts, [rule.key]: { ...drafts[rule.key], is_enabled: e.target.checked } })} /> },
        { key: "save", label: "", render: (rule) => (editable && drafts[rule.key] ? <Button size="small" variant="contained" onClick={() => save(rule)}>Save</Button> : null) },
      ]}
    />
  );
}

export default function OperationsPage() {
  const { apiParams } = useAnalyticsFilters();
  const { data, loading, error, reload } = useAnalytics<OperationsData>("operations/");
  const [status, setStatus] = useState("open");
  const [page, setPage] = useState(1);
  const alerts = useAnalytics<Paged<AlertItem>>("alerts/", { alert_status: status, page, page_size: 10 });
  const insights = useAnalytics<{ insights: Insight[] }>("insights/", apiParams);
  const { can } = useAnalyticsMe();

  useEffect(() => {
    const timer = window.setInterval(reload, 60_000);
    return () => window.clearInterval(timer);
  }, [reload]);

  const refreshAll = () => {
    reload();
    alerts.reload();
  };

  return (
    <Stack spacing={2.5}>
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        <>
          <Section title="Live operations" subtitle="Refreshes every minute" dense>
            <KpiGrid
              compact
              min={150}
              metrics={[
                ["Ongoing trips", data.live.trips.ongoing],
                ["Driver on the way", data.live.trips.driver_on_way],
                ["Driver arrived", data.live.trips.arrived],
                ["Trip in progress", data.live.trips.started],
                ["Open requests", data.live.trips.open_requests],
                ["Drivers online", data.live.drivers.online],
                ["Drivers available", data.live.drivers.available],
                ["Open alerts", data.open_alert_count],
              ].map(([label, value]) => ({ key: String(label), label: String(label), value: Number(value), previous: null, change_pct: null, unit: "count", availability: "available" as const, note: null }))}
            />
          </Section>
          <Columns>
            <Section title="Today by hour vs usual" subtitle="Usual = average of the same weekday over the previous four weeks">
              <CategoryBars
                data={data.today.map((row) => ({ ...row, hour: `${String(row.hour).padStart(2, "0")}` }))}
                xKey="hour"
                series={[
                  { key: "bookings", label: "Bookings today" },
                  { key: "usual_bookings", label: "Usual bookings" },
                  { key: "completed", label: "Completed today" },
                  { key: "expired", label: "Expired today" },
                ]}
                height={280}
              />
            </Section>
            <Section title="What changed" subtitle="Selected period vs the previous one">
              {insights.loading && !insights.data ? <Loading height={120} /> : <InsightList insights={insights.data?.insights || []} />}
            </Section>
          </Columns>
          {can("drivers.view") && <MapWidget />}
        </>
      ) : null}

      <Section
        title="Alerts"
        subtitle="Anomalies to investigate. An alert is a prompt to look, not a finding about any rider or driver."
        actions={
          <Stack direction="row" spacing={1}>
            <TextField select size="small" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} sx={{ minWidth: 150 }}>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="acknowledged">Acknowledged</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="">All</MenuItem>
            </TextField>
          </Stack>
        }
      >
        {alerts.loading && !alerts.data ? <Loading height={120} /> : alerts.error ? <ErrorState message={alerts.error} /> : <AlertList alerts={alerts.data?.results || []} onChanged={refreshAll} />}
        {alerts.data && alerts.data.count > 10 && (
          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", mt: 2 }}>
            <Button size="small" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Typography sx={{ fontSize: 13, alignSelf: "center" }}>Page {page}</Typography>
            <Button size="small" disabled={page * 10 >= alerts.data.count} onClick={() => setPage(page + 1)}>Next</Button>
          </Stack>
        )}
      </Section>

      <Section title="Alert thresholds" subtitle="Percent change versus the four-week baseline that raises a warning or critical alert. Windows below the minimum volume are ignored.">
        <RulesTable />
      </Section>
    </Stack>
  );
}
