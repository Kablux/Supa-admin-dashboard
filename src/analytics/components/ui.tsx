import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Chip, CircularProgress, Menu, MenuItem, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { MdArrowDownward, MdArrowUpward, MdDownload, MdInfoOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { downloadAnalytics, errorMessage, useAnalyticsMe, useKpiDefinitions } from "../api";
import { AVAILABILITY_LABEL, FILTER_LABEL, formatDateTime, formatValue, isGoodChange } from "../format";
import type { FilterInfo, Freshness, Metric } from "../types";

export function Section({ title, subtitle, actions, children, dense = false }: { title?: string; subtitle?: string; actions?: ReactNode; children: ReactNode; dense?: boolean }) {
  return (
    <Box sx={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 3, p: dense ? 2 : { xs: 2, md: 3 }, breakInside: "avoid" }}>
      {(title || actions) && (
        <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box>
            {title && (
              <Typography sx={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}>
                {title}
              </Typography>
            )}
            {subtitle && <Typography sx={{ fontSize: 13, color: "var(--text-secondary)", mt: 0.25 }}>{subtitle}</Typography>}
          </Box>
          {actions && <Box sx={{ "@media print": { display: "none" } }}>{actions}</Box>}
        </Stack>
      )}
      {children}
    </Box>
  );
}

export function Grid({ min = 220, gap = 2, children }: { min?: number; gap?: number; children: ReactNode }) {
  return <Box sx={{ display: "grid", gap, gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))` }}>{children}</Box>;
}

export function Columns({ children, template = { xs: "1fr", lg: "2fr 1fr" } }: { children: ReactNode; template?: Record<string, string> }) {
  return <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: template, alignItems: "start" }}>{children}</Box>;
}

function ChangeChip({ metricKey, change }: { metricKey: string; change: number | null }) {
  if (change === null || change === undefined) return null;
  const good = change === 0 ? null : isGoodChange(metricKey, change);
  // null = neutral (no change, or a measure where neither direction is better)
  const color = good === null ? "var(--text-secondary)" : good ? "var(--success)" : "var(--danger)";
  const Icon = change >= 0 ? MdArrowUpward : MdArrowDownward;
  return (
    <Stack direction="row" spacing={0.25} sx={{ alignItems: "center", color, fontSize: 12, fontWeight: 600 }}>
      <Icon size={13} />
      <span>{Math.abs(change).toFixed(1)}%</span>
    </Stack>
  );
}

export function KpiCard({ metric, to, compact = false }: { metric: Metric; to?: string; compact?: boolean }) {
  const definitions = useKpiDefinitions();
  const navigate = useNavigate();
  const definition = definitions[metric.key];
  const unavailable = metric.value === null && metric.availability !== "available";
  const tooltip = definition ? (
    <Box sx={{ p: 0.5, maxWidth: 320 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.5 }}>{definition.label}</Typography>
      <Typography sx={{ fontSize: 12, mb: 0.75 }}>{definition.definition}</Typography>
      <Typography sx={{ fontSize: 11, opacity: 0.8 }}>Formula: {definition.formula}</Typography>
      <Typography sx={{ fontSize: 11, opacity: 0.8 }}>Source: {definition.source}</Typography>
      <Typography sx={{ fontSize: 11, opacity: 0.8 }}>Dated by: {definition.date_field}</Typography>
      {definition.missing_data && <Typography sx={{ fontSize: 11, opacity: 0.8 }}>Missing data: {definition.missing_data}</Typography>}
    </Box>
  ) : (
    metric.note || metric.label
  );

  return (
    <Box
      onClick={to ? () => navigate(to) : undefined}
      sx={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 2.5,
        p: compact ? 1.5 : 2,
        cursor: to ? "pointer" : "default",
        transition: "border-color 0.2s ease, background 0.2s ease",
        "&:hover": to ? { borderColor: "var(--accent-gold)", background: "var(--bg-card-hover)" } : undefined,
        minHeight: compact ? 84 : 108,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        breakInside: "avoid",
      }}
    >
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "var(--text-secondary)" }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.3 }}>{metric.label}</Typography>
        <Tooltip title={tooltip} arrow placement="top">
          <Box component="span" sx={{ display: "inline-flex", opacity: 0.7 }}>
            <MdInfoOutline size={13} />
          </Box>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: "baseline", justifyContent: "space-between", mt: 1 }}>
        {unavailable ? (
          <Chip size="small" label={AVAILABILITY_LABEL[metric.availability] || "Not available"} sx={{ fontSize: 11, height: 22 }} />
        ) : (
          <Typography sx={{ fontSize: compact ? 20 : 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
            {formatValue(metric.value, metric.unit)}
          </Typography>
        )}
        <ChangeChip metricKey={metric.key} change={metric.change_pct} />
      </Stack>
      {(metric.previous !== null && metric.previous !== undefined) || metric.note ? (
        <Typography sx={{ fontSize: 11.5, color: "var(--text-muted)", mt: 0.5 }} noWrap title={metric.note || undefined}>
          {metric.previous !== null && metric.previous !== undefined ? `Previous: ${formatValue(metric.previous, metric.unit)}` : metric.note}
        </Typography>
      ) : null}
    </Box>
  );
}

export function KpiGrid({ metrics, links = {}, min = 200, compact = false }: { metrics: Metric[]; links?: Record<string, string>; min?: number; compact?: boolean }) {
  return (
    <Grid min={min}>
      {metrics.map((metric) => (
        <KpiCard key={metric.key + metric.label} metric={metric} to={links[metric.key]} compact={compact} />
      ))}
    </Grid>
  );
}

export function Loading({ height = 260 }: { height?: number }) {
  return (
    <Stack spacing={2}>
      <Grid>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={104} sx={{ bgcolor: "var(--bg-card-hover)" }} />
        ))}
      </Grid>
      <Skeleton variant="rounded" height={height} sx={{ bgcolor: "var(--bg-card-hover)" }} />
    </Stack>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Alert severity="warning" action={onRetry ? <Button color="inherit" size="small" onClick={onRetry}>Retry</Button> : undefined} sx={{ borderRadius: 2 }}>
      {message}
    </Alert>
  );
}

export function Empty({ text = "No data for this period yet." }: { text?: string }) {
  return <Typography sx={{ color: "var(--text-secondary)", fontSize: 14, py: 4, textAlign: "center" }}>{text}</Typography>;
}

export function FreshnessNote({ freshness, filters }: { freshness?: Freshness; filters?: FilterInfo }) {
  if (!freshness) return null;
  const ignored = (filters?.not_applicable || []).map((key) => FILTER_LABEL[key] || key);
  return (
    <Stack spacing={1}>
      {!freshness.has_data && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No summaries have been built yet. Run <code>python manage.py analytics_backfill</code> on this environment, then refresh.
        </Alert>
      )}
      <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
        Data refreshed {freshness.last_refreshed_at ? formatDateTime(freshness.last_refreshed_at) : "never"} (Lagos time)
        {freshness.history_starts ? ` · history from ${freshness.history_starts}` : ""}
        {ignored.length ? ` · not applied on this page: ${ignored.join(", ")}` : ""}
      </Typography>
    </Stack>
  );
}

export function ExportMenu({ path, params, label = "Export" }: { path: string; params: Record<string, string | undefined>; label?: string }) {
  const { can } = useAnalyticsMe();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [busy, setBusy] = useState(false);
  if (!can("reports.export")) return null;
  const run = async (format: "csv" | "xlsx") => {
    setAnchor(null);
    setBusy(true);
    try {
      await downloadAnalytics(path, params, format);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Button size="small" color="inherit" variant="outlined" startIcon={busy ? <CircularProgress size={14} /> : <MdDownload />} onClick={(e) => setAnchor(e.currentTarget)} sx={{ borderColor: "var(--border)", textTransform: "none" }} disabled={busy}>
        {label}
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => run("csv")}>CSV</MenuItem>
        <MenuItem onClick={() => run("xlsx")}>Excel (.xlsx)</MenuItem>
      </Menu>
    </>
  );
}

export function PeriodCaption({ period, comparison }: { period?: { label: string; start: string; end: string }; comparison?: { start: string; end: string } | null }) {
  if (!period) return null;
  return (
    <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
      {period.label} ({period.start} to {period.end}){comparison ? ` · compared with ${comparison.start} to ${comparison.end}` : ""}
    </Typography>
  );
}
