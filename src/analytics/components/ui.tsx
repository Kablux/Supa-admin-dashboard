import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Chip, CircularProgress, Menu, MenuItem, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { MdArrowDownward, MdArrowUpward, MdDownload, MdInfoOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { downloadAnalytics, errorMessage, useAnalyticsMe, useKpiDefinitions } from "../api";
import { AVAILABILITY_LABEL, FILTER_LABEL, formatDateTime, formatValue, isGoodChange } from "../format";
import type { FilterInfo, Freshness, Metric } from "../types";


export function Section({
  title,
  subtitle,
  actions,
  children,
  dense = false,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  dense?: boolean;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        // background: "var(--bg-card, #1A1D26)",
        border: "1px solid var(--border, rgba(255,255,255,0.08))",
        borderRadius: "8px",
        p: dense ? 2 : { xs: 2, md: 2.5 },
        minWidth: 0,
        breakInside: "avoid",
        transition: "border-color 0.2s ease",
        "&:hover": {
          borderColor: "rgba(255,190,24,0.16)",
        },
      }}
    >
      {(title || actions) && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title && (
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--text-primary, #fff)",
                  letterSpacing: "-0.015em",
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                sx={{
                  fontSize: 12,
                  color: "var(--text-secondary, #8A92A6)",
                  mt: 0.6,
                  lineHeight: 1.65,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && (
            <Box
              sx={{
                flexShrink: 0,
                maxWidth: "100%",
                "@media print": { display: "none" },
              }}
            >
              {actions}
            </Box>
          )}
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

export function KpiCard({
  metric,
  to,
  compact = false,
}: {
  metric: Metric;
  to?: string;
  compact?: boolean;
}) {
  const definitions = useKpiDefinitions();
  const navigate = useNavigate();

  const definition = definitions[metric.key];
  const unavailable =
    metric.value === null && metric.availability !== "available";

  const tooltip = definition ? (
    <Box sx={{ p: 0.75, maxWidth: 320 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.75 }}>
        {definition.label}
      </Typography>

      <Typography sx={{ fontSize: 12, lineHeight: 1.6, mb: 1 }}>
        {definition.definition}
      </Typography>

      <Typography sx={{ fontSize: 11, opacity: 0.75, mb: 0.35 }}>
        Formula: {definition.formula}
      </Typography>

      <Typography sx={{ fontSize: 11, opacity: 0.75, mb: 0.35 }}>
        Source: {definition.source}
      </Typography>

      <Typography sx={{ fontSize: 11, opacity: 0.75 }}>
        Dated by: {definition.date_field}
      </Typography>

      {definition.missing_data && (
        <Typography sx={{ fontSize: 11, opacity: 0.75, mt: 0.5 }}>
          Missing data: {definition.missing_data}
        </Typography>
      )}
    </Box>
  ) : (
    metric.note || metric.label
  );

  return (
    <Box
      onClick={to ? () => navigate(to) : undefined}
      onKeyDown={
        to
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(to);
              }
            }
          : undefined
      }
      role={to ? "button" : undefined}
      tabIndex={to ? 0 : undefined}
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, var(--bg-card, #1A1D26) 0%, var(--bg-secondary, #141721) 100%)",
        border: "1px solid var(--border, rgba(255,255,255,0.08))",
        borderRadius: "8px",
        p: 2,
        minHeight: compact ? 100 : 124,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 1.5,
        cursor: to ? "pointer" : "default",
        transition: "all 0.25s ease",
        breakInside: "avoid",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "42px",
          height: "3px",
          borderRadius: "0 0 4px 0",
          background: "#FFBE18",
          opacity: 0.8,
        },

        "&:hover": to
          ? {
              borderColor: "rgba(255,190,24,0.45)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            }
          : undefined,

        "&:focus-visible": {
          outline: "2px solid #FFBE18",
          outlineOffset: 3,
        },
      }}
    >
      <Stack
        direction="row"
        // justifyContent="space-between"
        spacing={1}
      >
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ minWidth: 0 }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-secondary, #A0A6B5)",
              lineHeight: 1.4,
            }}
          >
            {metric.label}
          </Typography>

          <Tooltip title={tooltip} arrow placement="top">
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                color: "var(--text-muted, #8A92A6)",
                cursor: "help",
                "&:hover": { color: "#FFBE18" },
              }}
            >
              <MdInfoOutline size={14} />
            </Box>
          </Tooltip>
        </Stack>

        {to && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 25,
              height: 25,
              borderRadius: "7px",
              background: "rgba(255,190,24,0.08)",
              color: "#FFBE18",
              flexShrink: 0,
              opacity: 0.8,
            }}
          >
            <MdArrowUpward size={13} style={{ transform: "rotate(45deg)" }} />
          </Box>
        )}
      </Stack>

      <Stack
        direction="row"
        spacing={1}
      >
        {unavailable ? (
          <Chip
            size="small"
            label={
              AVAILABILITY_LABEL[metric.availability] || "Not available"
            }
            sx={{
              height: 25,
              borderRadius: "7px",
              fontSize: 10.5,
              fontWeight: 600,
              color: "#A0A6B5",
              background: "rgba(160,166,181,0.1)",
              border: "1px solid rgba(160,166,181,0.15)",
            }}
          />
        ) : (
          <Typography
            sx={{
              fontSize: compact ? 18 : 24,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.035em",
              lineHeight: 1.2,
              fontVariantNumeric: "tabular-nums",
              overflowWrap: "anywhere",
            }}
          >
            {formatValue(metric.value, metric.unit)}
          </Typography>
        )}

        <ChangeChip metricKey={metric.key} change={metric.change_pct} />
      </Stack>

      {(metric.previous !== null && metric.previous !== undefined) ||
      metric.note ? (
        <Typography
          noWrap
          title={metric.note || undefined}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-muted, #8A92A6)",
            pt: 0.75,
            borderTop: "1px solid var(--border, rgba(255,255,255,0.06))",
          }}
        >
          {metric.previous !== null && metric.previous !== undefined
            ? `Previous: ${formatValue(metric.previous, metric.unit)}`
            : metric.note}
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
      <Button
          size="small"
          variant="outlined"
          startIcon={
            busy ? (
              <CircularProgress size={15} sx={{ color: "#FFBE18" }} />
            ) : (
              <MdDownload  />
            )
          }
          onClick={(e) => setAnchor(e.currentTarget)}
          disabled={busy}
            sx={{
              px: 2,
              textTransform: "none",
              fontSize: 14,
              fontWeight: 500,
              borderRadius: "8px",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border, rgba(255,255,255,0.12))",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.25)",
                backgroundColor: "rgba(255,255,255,0.06)",
              },
            }}
        >
          {busy ? "Exporting..." : label}
        </Button>
        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 124,
                borderRadius: "8px",
                background: "#1A1D26",
                border: "1px solid var(--border, rgba(255,255,255,0.12))",
                boxShadow: "0 12px 35px rgba(0,0,0,0.05)",
                overflow: "hidden",
                "& .MuiList-root": {
                  p: 0.75,
                },
              },
            },
          }}
        >
          {[
            { value: "csv" as const, label: " CSV" },
            { value: "xlsx" as const, label: "Excel (.xlsx)" },
          ].map((item) => (
            <MenuItem
              key={item.value}
              onClick={() => run(item.value)}
              sx={{
                minHeight: 39,
                borderRadius: "7px",
                px: 1.5,
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text-primary, #FFFFFF)",
                transition: "all 0.2s ease",

                "&:hover": {
                  color: "var(--accent-gold, #FFC107)",
                  background: "rgba(255,190,24,0.09)",
                },
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
    </>
  );
}

export function PeriodCaption({ period, comparison }: { period?: { label: string; start: string; end: string }; comparison?: { start: string; end: string } | null }) {
  if (!period) return null;
  return (
    <Typography sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
      {period.label} ({period.start} to {period.end}){comparison ? ` · compared with ${comparison.start} to ${comparison.end}` : ""}
    </Typography>
  );
}
