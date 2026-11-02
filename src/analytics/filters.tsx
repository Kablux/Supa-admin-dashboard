import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Button, Chip, MenuItem, Popover, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { MdFilterList, MdRefresh } from "react-icons/md";
import { useAnalytics, useAnalyticsMe } from "./api";
import { FILTER_LABEL } from "./format";

export const FILTER_KEYS = ["period", "start", "end", "area", "ride_type", "payment_method", "vehicle_type", "driver", "rider", "status"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];
export type FilterValues = Partial<Record<FilterKey, string>>;

const PERIODS = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["last_7_days", "Last 7 days"],
  ["last_30_days", "Last 30 days"],
  ["last_90_days", "Last 90 days"],
  ["this_week", "This week"],
  ["last_week", "Last week"],
  ["this_month", "This month"],
  ["last_month", "Last month"],
  ["this_year", "This year"],
  ["custom", "Custom range"],
] as const;

const OPTIONS: Partial<Record<FilterKey, [string, string][]>> = {
  ride_type: [["standard", "Standard"], ["premium", "Premium"], ["business", "Business"]],
  payment_method: [["cash", "Cash"], ["wallet", "Wallet"]],
  vehicle_type: [["standard", "Standard"], ["premium", "Premium"]],
  status: [["driver_on_way", "Driver on the way"], ["arrived", "Arrived"], ["started", "Started"], ["completed", "Completed"], ["cancelled", "Cancelled"]],
};

export function useAnalyticsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const values = useMemo(() => {
    const result: FilterValues = {};
    FILTER_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) result[key] = value;
    });
    if (!result.period && !result.start) result.period = "last_30_days";
    return result;
  }, [searchParams]);

  const setValues = (next: FilterValues) => {
    const params = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach((key) => {
      const value = next[key];
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (next.period && next.period !== "custom") {
      params.delete("start");
      params.delete("end");
    }
    if (next.period === "custom") params.delete("period");
    setSearchParams(params, { replace: true });
  };

  const apiParams = useMemo(() => {
    const { period, ...rest } = values;
    return rest.start && rest.end ? rest : { ...rest, period };
  }, [values]);

  return { values, setValues, apiParams, search: searchParams.toString() };
}

function AreaOptions({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { data } = useAnalytics<{ cells: { id: string; label: string; booking_requests: number }[] }>("geography/", { period: "last_90_days", level: "area" });
  const options = (data?.cells || []).slice(0, 60);
  return (
    <TextField select size="small" label="Location" value={value} onChange={(event) => onChange(event.target.value)} sx={{ minWidth: 220 }}>
      <MenuItem value="">All locations</MenuItem>
      {options.map((cell) => (
        <MenuItem key={cell.id} value={cell.id}>
          {(cell.label || cell.id).slice(0, 48)} ({cell.booking_requests})
        </MenuItem>
      ))}
    </TextField>
  );
}

export function GlobalFilterBar({ show = ["ride_type", "payment_method", "vehicle_type", "area"], onRefresh, notApplicable = [] }: { show?: FilterKey[]; onRefresh?: () => void; notApplicable?: string[] }) {
  const { values, setValues } = useAnalyticsFilters();
  const { can } = useAnalyticsMe();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [draft, setDraft] = useState<FilterValues>(values);
  const period = values.start && values.end ? "custom" : values.period || "last_30_days";
  const extra = show.filter((key) => !["period", "start", "end"].includes(key));
  const activeCount = extra.filter((key) => values[key]).length;

  const choosePeriod = (key: string) => {
    if (key === "custom") {
      setDraft({ ...values, period: "custom" });
      setAnchor(document.getElementById("analytics-filter-button"));
      return;
    }
    setValues({ ...values, period: key, start: undefined, end: undefined });
  };

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ alignItems: { xs: "stretch", md: "center" }, "@media print": { display: "none" } }}>
      <TextField select size="small" label="Period" value={period} onChange={(event) => choosePeriod(event.target.value)} sx={{ minWidth: 170 }}>
        {PERIODS.map(([key, label]) => (
          <MenuItem key={key} value={key}>
            {label}
          </MenuItem>
        ))}
      </TextField>
      {period === "custom" && values.start && values.end && <Chip size="small" label={`${values.start} → ${values.end}`} onClick={() => choosePeriod("custom")} />}
      {extra.length > 0 && (
        <Button
          id="analytics-filter-button"
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<MdFilterList />}
          onClick={(event) => {
            setDraft(values);
            setAnchor(event.currentTarget);
          }}
          sx={{ borderColor: "var(--border)", textTransform: "none", height: 40 }}
        >
          Filters{activeCount ? ` (${activeCount})` : ""}
        </Button>
      )}
      {extra
        .filter((key) => values[key])
        .map((key) => (
          <Chip
            key={key}
            size="small"
            color={notApplicable.includes(key === "driver" ? "driver_id" : key === "rider" ? "rider_id" : key) ? "default" : "primary"}
            variant="outlined"
            label={`${FILTER_LABEL[key] || FILTER_LABEL[`${key}_id`] || key}: ${OPTIONS[key]?.find(([v]) => v === values[key])?.[1] || values[key]}`}
            onDelete={() => setValues({ ...values, [key]: undefined })}
          />
        ))}
      <Box sx={{ flex: 1 }} />
      {onRefresh && (
        <Tooltip title="Reload from the latest summaries">
          <Button size="small" color="inherit" startIcon={<MdRefresh />} onClick={onRefresh} sx={{ textTransform: "none" }}>
            Refresh
          </Button>
        </Tooltip>
      )}

      <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Stack spacing={2} sx={{ p: 2.5, width: 320 }}>
          <Typography sx={{ fontWeight: 600 }}>Filters</Typography>
          {(draft.period === "custom" || (draft.start && draft.end)) && (
            <Stack direction="row" spacing={1}>
              <TextField type="date" size="small" label="From" value={draft.start || ""} onChange={(e) => setDraft({ ...draft, start: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} fullWidth />
              <TextField type="date" size="small" label="To" value={draft.end || ""} onChange={(e) => setDraft({ ...draft, end: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} fullWidth />
            </Stack>
          )}
          {extra.map((key) => {
            if (key === "area") return can("geography.view") ? <AreaOptions key={key} value={draft.area || ""} onChange={(value) => setDraft({ ...draft, area: value })} /> : null;
            if (key === "driver" || key === "rider")
              return <TextField key={key} size="small" label={`${key === "driver" ? "Driver" : "Rider"} id`} value={draft[key] || ""} onChange={(e) => setDraft({ ...draft, [key]: e.target.value.trim() })} />;
            return (
              <TextField key={key} select size="small" label={FILTER_LABEL[key] || key} value={draft[key] || ""} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}>
                <MenuItem value="">All</MenuItem>
                {(OPTIONS[key] || []).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            );
          })}
          <Stack sx={{ justifyContent: "flex-end" }} direction="row" spacing={1}>
            <Button size="small" color="inherit" onClick={() => setDraft(Object.fromEntries(Object.entries(draft).filter(([key]) => ["period", "start", "end"].includes(key))))}>
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={draft.period === "custom" && !(draft.start && draft.end)}
              onClick={() => {
                setValues(draft.period === "custom" ? { ...draft, period: undefined } : draft);
                setAnchor(null);
              }}
            >
              Apply
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </Stack>
  );
}
