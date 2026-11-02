import { Box, Stack, Tooltip as MuiTooltip, Typography } from "@mui/material";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatAxis, formatDateLabel, formatValue } from "../format";
import { usePalette } from "../palette";
import type { Unit } from "../types";

export interface SeriesDef {
  key: string;
  label: string;
  unit?: Unit;
  dashed?: boolean;
}

function useTooltipStyle() {
  const palette = usePalette();
  return {
    contentStyle: { background: palette.tooltipBg, border: `1px solid ${palette.tooltipBorder}`, borderRadius: 8, fontSize: 12, color: palette.text },
    labelStyle: { color: palette.text, fontWeight: 600 },
  };
}

export function TrendChart({ data, series, unit = "count", height = 280, kind = "area", xKey = "bucket" }: { data: Record<string, unknown>[]; series: SeriesDef[]; unit?: Unit; height?: number; kind?: "area" | "line" | "bar"; xKey?: string }) {
  const palette = usePalette();
  const tooltip = useTooltipStyle();
  const common = (
    <>
      <CartesianGrid stroke={palette.grid} vertical={false} />
      <XAxis dataKey={xKey} tickFormatter={(value) => formatDateLabel(String(value))} stroke={palette.axis} fontSize={11} tickLine={false} axisLine={false} minTickGap={16} />
      <YAxis tickFormatter={(value) => formatAxis(Number(value), unit)} stroke={palette.axis} fontSize={11} tickLine={false} axisLine={false} width={64} />
      <Tooltip {...tooltip} labelFormatter={(value) => formatDateLabel(String(value))} formatter={(value, name) => [formatValue(Number(value), series.find((s) => s.label === name)?.unit || unit), name]} />
      {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
    </>
  );
  return (
    <Box sx={{ width: "100%", height }}>
      <ResponsiveContainer>
        {kind === "bar" ? (
          <BarChart data={data}>
            {common}
            {series.map((s, i) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={palette.series[i % palette.series.length]} radius={[3, 3, 0, 0]} stackId={series.length > 2 ? "stack" : undefined} />
            ))}
          </BarChart>
        ) : kind === "line" ? (
          <LineChart data={data}>
            {common}
            {series.map((s, i) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={palette.series[i % palette.series.length]} strokeWidth={2} dot={false} strokeDasharray={s.dashed ? "5 4" : undefined} connectNulls />
            ))}
          </LineChart>
        ) : (
          <AreaChart data={data}>
            <defs>
              {series.map((s, i) => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.series[i % palette.series.length]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={palette.series[i % palette.series.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {common}
            {series.map((s, i) => (
              <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={palette.series[i % palette.series.length]} strokeWidth={2} fill={`url(#grad-${s.key})`} strokeDasharray={s.dashed ? "5 4" : undefined} />
            ))}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}

export function CategoryBars({ data, xKey, series, unit = "count", height = 260, horizontal = false }: { data: Record<string, unknown>[]; xKey: string; series: SeriesDef[]; unit?: Unit; height?: number; horizontal?: boolean }) {
  const palette = usePalette();
  const tooltip = useTooltipStyle();
  return (
    <Box sx={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ left: horizontal ? 24 : 0 }}>
          <CartesianGrid stroke={palette.grid} vertical={horizontal} horizontal={!horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" tickFormatter={(v) => formatAxis(Number(v), unit)} stroke={palette.axis} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey={xKey} stroke={palette.axis} fontSize={11} tickLine={false} axisLine={false} width={150} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} stroke={palette.axis} fontSize={11} tickLine={false} axisLine={false} interval={0} />
              <YAxis tickFormatter={(v) => formatAxis(Number(v), unit)} stroke={palette.axis} fontSize={11} tickLine={false} axisLine={false} width={56} />
            </>
          )}
          <Tooltip {...tooltip} formatter={(value, name) => [formatValue(Number(value), series.find((s) => s.label === name)?.unit || unit), name]} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={palette.series[i % palette.series.length]} radius={horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export function Donut({ data, unit = "count", height = 220 }: { data: { name: string; value: number }[]; unit?: Unit; height?: number }) {
  const palette = usePalette();
  const tooltip = useTooltipStyle();
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  return (
    <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
      <Box sx={{ width: height, height }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="none">
              {data.map((_, i) => (
                <Cell key={i} fill={palette.series[i % palette.series.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltip} formatter={(value, name) => [formatValue(Number(value), unit), name]} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Stack spacing={1}>
        {data.map((item, i) => (
          <Stack sx={{ alignItems: "center" }} key={item.name} direction="row" spacing={1}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: palette.series[i % palette.series.length] }} />
            <Typography sx={{ fontSize: 13, color: "var(--text-primary)" }}>
              {item.name}: <b>{formatValue(item.value, unit)}</b> {total ? `(${((item.value / total) * 100).toFixed(1)}%)` : ""}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export interface FunnelStage {
  key: string;
  label: string;
  count: number;
  share_of_bookings: number | null;
  lost_from_previous: number;
  loss_rate: number | null;
}

export function Funnel({ stages, largestLoss }: { stages: FunnelStage[]; largestLoss?: string | null }) {
  const palette = usePalette();
  const top = stages[0]?.count || 0;
  return (
    <Stack spacing={1.25}>
      {stages.map((stage, index) => {
        const width = top ? Math.max((stage.count / top) * 100, 2) : 2;
        const isWorst = largestLoss === stage.label;
        return (
          <Box key={stage.key}>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={{ fontSize: 13, color: "var(--text-primary)", fontWeight: isWorst ? 700 : 500 }}>
                {index + 1}. {stage.label}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                {stage.count.toLocaleString()} {stage.share_of_bookings !== null ? `· ${stage.share_of_bookings}%` : ""}
                {index > 0 && stage.lost_from_previous > 0 ? (
                  <Box component="span" sx={{ color: isWorst ? palette.negative : "var(--text-muted)", ml: 1 }}>
                    −{stage.lost_from_previous.toLocaleString()} ({stage.loss_rate}%)
                  </Box>
                ) : null}
              </Typography>
            </Stack>
            <Box sx={{ height: 10, borderRadius: 5, background: "var(--bg-card-hover)", overflow: "hidden" }}>
              <Box sx={{ width: `${width}%`, height: "100%", borderRadius: 5, background: isWorst ? palette.negative : palette.series[0], transition: "width 0.4s ease" }} />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

export interface CohortRow {
  cohort_month: string;
  cohort_size?: number;
  first_trip_rate?: number | null;
  retained_30d?: number | null;
  retained_60d?: number | null;
  retained_90d?: number | null;
  months: { month: number; riders: number; rate: number | null }[];
}

export function CohortHeatmap({ cohorts }: { cohorts: CohortRow[] }) {
  const palette = usePalette();
  const maxMonths = Math.max(0, ...cohorts.map((cohort) => cohort.months.length));
  const cell = { px: 1, py: 0.75, fontSize: 12, textAlign: "center" as const, whiteSpace: "nowrap" as const, fontVariantNumeric: "tabular-nums" as const };
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={{ borderCollapse: "separate", borderSpacing: "3px", minWidth: 640 }}>
        <thead>
          <tr>
            {["Signup month", "Riders", "First trip", "30d", "60d", "90d"].map((head) => (
              <Box component="th" key={head} sx={{ ...cell, color: "var(--text-secondary)", fontWeight: 600, textAlign: head === "Signup month" ? "left" : "center" }}>
                {head}
              </Box>
            ))}
            {Array.from({ length: maxMonths }).map((_, index) => (
              <Box component="th" key={index} sx={{ ...cell, color: "var(--text-secondary)", fontWeight: 600 }}>
                M{index}
              </Box>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((cohort) => (
            <tr key={cohort.cohort_month}>
              <Box component="td" sx={{ ...cell, textAlign: "left", color: "var(--text-primary)", fontWeight: 500 }}>
                {new Date(`${cohort.cohort_month}T00:00:00`).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </Box>
              <Box component="td" sx={{ ...cell, color: "var(--text-primary)" }}>{cohort.cohort_size ?? "—"}</Box>
              {[cohort.first_trip_rate, cohort.retained_30d, cohort.retained_60d, cohort.retained_90d].map((value, index) => (
                <Box component="td" key={index} sx={{ ...cell, color: "var(--text-primary)" }}>
                  {value === null || value === undefined ? "—" : `${value}%`}
                </Box>
              ))}
              {Array.from({ length: maxMonths }).map((_, index) => {
                const month = cohort.months.find((item) => item.month === index);
                const rate = month?.rate ?? null;
                return (
                  <MuiTooltip key={index} title={month ? `${month.riders} riders (${rate ?? 0}%) in month ${index}` : "Not reached yet"}>
                    <Box component="td" sx={{ ...cell, borderRadius: 1, minWidth: 44, background: month ? palette.heat((rate || 0) / 100) : "transparent", color: (rate || 0) > 55 ? "#111" : "var(--text-primary)" }}>
                      {month ? `${rate ?? 0}%` : ""}
                    </Box>
                  </MuiTooltip>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}

export function HourHeat({ rows, valueKey, label }: { rows: { hour: number; [key: string]: number | null }[]; valueKey: string; label: string }) {
  const palette = usePalette();
  const max = Math.max(1, ...rows.map((row) => Number(row[valueKey] || 0)));
  return (
    <Stack spacing={0.75}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: "3px" }}>
        {rows.map((row) => (
          <MuiTooltip key={row.hour} title={`${String(row.hour).padStart(2, "0")}:00 · ${label}: ${row[valueKey] ?? 0}`}>
            <Box sx={{ height: 34, borderRadius: 1, background: palette.heat(Number(row[valueKey] || 0) / max) }} />
          </MuiTooltip>
        ))}
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: "3px" }}>
        {rows.map((row) => (
          <Typography key={row.hour} sx={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center" }}>
            {row.hour % 3 === 0 ? row.hour : ""}
          </Typography>
        ))}
      </Box>
    </Stack>
  );
}
