import { useState } from "react";
import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { errorMessage, sendAnalytics, useAnalyticsMe } from "../api";
import { formatDateTime, formatValue } from "../format";
import type { AlertItem, Insight } from "../types";
import { Empty } from "./ui";

const TONE: Record<Insight["tone"], string> = { negative: "var(--danger)", positive: "var(--success)", neutral: "var(--info)" };

export function InsightList({ insights, compact = false }: { insights: Insight[]; compact?: boolean }) {
  if (!insights.length) return <Empty text="No significant changes compared with the previous period." />;
  return (
    <Stack spacing={1.5}>
      {insights.map((insight) => (
        <Box key={insight.key} sx={{ borderLeft: `3px solid ${TONE[insight.tone]}`, pl: 1.75, py: 0.5, breakInside: "avoid" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{insight.headline}</Typography>
          {insight.explanation && <Typography sx={{ fontSize: 13, color: "var(--text-secondary)", mt: 0.25 }}>{insight.explanation}</Typography>}
          {!compact && insight.evidence.length > 0 && (
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}>
              {insight.evidence.map((item) => (
                <Chip
                  key={item.label}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: "var(--border)", color: "var(--text-secondary)", fontSize: 11.5 }}
                  label={`${item.label}: ${formatValue(item.value, item.unit)}${item.previous !== null && item.previous !== undefined ? ` (was ${formatValue(item.previous, item.unit)})` : ""}`}
                />
              ))}
            </Stack>
          )}
          {insight.note && <Typography sx={{ fontSize: 12, color: "var(--text-muted)", mt: 0.5 }}>{insight.note}</Typography>}
        </Box>
      ))}
    </Stack>
  );
}

const SEVERITY_COLOR: Record<AlertItem["severity"], "default" | "warning" | "error" | "info"> = { info: "info", warning: "warning", critical: "error" };

export function AlertList({ alerts, onChanged }: { alerts: AlertItem[]; onChanged?: () => void }) {
  const { can } = useAnalyticsMe();
  const [notes, setNotes] = useState<Record<string, string>>({});
  if (!alerts.length) return <Empty text="No alerts. Detected anomalies will appear here." />;
  const update = async (alert: AlertItem, status: AlertItem["status"]) => {
    try {
      await sendAnalytics("patch", `alerts/${alert.id}/`, { status, note: notes[alert.id] ?? alert.note });
      toast.success(`Alert marked ${status}.`);
      onChanged?.();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };
  return (
    <Stack spacing={1.5}>
      {alerts.map((alert) => (
        <Box key={alert.id} sx={{ border: "1px solid var(--border)", borderRadius: 2, p: 2, breakInside: "avoid" }}>
          <Stack sx={{ justifyContent: "space-between" }} direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Stack sx={{ alignItems: "center", flexWrap: "wrap" }} direction="row" spacing={1}>
              <Chip size="small" color={SEVERITY_COLOR[alert.severity]} label={alert.severity} sx={{ textTransform: "capitalize" }} />
              <Chip size="small" variant="outlined" label={alert.category} sx={{ textTransform: "capitalize", borderColor: "var(--border)", color: "var(--text-secondary)" }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{alert.title}</Typography>
            </Stack>
            <Typography sx={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              Detected {formatDateTime(alert.detected_at)} · {alert.status}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 13, color: "var(--text-secondary)", mt: 1 }}>{alert.description}</Typography>
          <Typography sx={{ fontSize: 12.5, color: "var(--text-primary)", mt: 1 }}>
            <b>Investigate:</b> {alert.investigation}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "var(--text-muted)", mt: 0.5 }}>Metric: {alert.metric.replace(/_/g, " ")} · window {formatDateTime(alert.window_start)} to {formatDateTime(alert.window_end)}</Typography>
          {can("alerts.manage") && alert.status !== "resolved" && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1.5, "@media print": { display: "none" } }}>
              <TextField size="small" placeholder="Note (optional)" value={notes[alert.id] ?? alert.note} onChange={(e) => setNotes({ ...notes, [alert.id]: e.target.value })} sx={{ flex: 1 }} />
              {alert.status === "open" && (
                <Button size="small" variant="outlined" color="inherit" onClick={() => update(alert, "acknowledged")}>
                  Acknowledge
                </Button>
              )}
              <Button size="small" variant="contained" onClick={() => update(alert, "resolved")}>
                Resolve
              </Button>
            </Stack>
          )}
        </Box>
      ))}
    </Stack>
  );
}
