import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MdFilterList, MdRefresh } from "react-icons/md";
import { useAnalytics, useAnalyticsMe } from "./api";
import { FILTER_LABEL } from "./format";

export const FILTER_KEYS = [
  "period",
  "start",
  "end",
  "area",
  "ride_type",
  "payment_method",
  "vehicle_type",
  "driver",
  "rider",
  "status",
] as const;
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
  ride_type: [
    ["standard", "Standard"],
    ["premium", "Premium"],
    ["business", "Business"],
  ],
  payment_method: [
    ["cash", "Cash"],
    ["wallet", "Wallet"],
  ],
  vehicle_type: [
    ["standard", "Standard"],
    ["premium", "Premium"],
  ],
  status: [
    ["driver_on_way", "Driver on the way"],
    ["arrived", "Arrived"],
    ["started", "Started"],
    ["completed", "Completed"],
    ["cancelled", "Cancelled"],
  ],
};

// Common Input/Select styling matching app theme
const selectFieldSx = {
  minWidth: 170,
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "14px",
    color: "var(--text-primary, #FFF)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    "& fieldset": { borderColor: "var(--border, rgba(255, 255, 255, 0.12))" },
    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.25)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #FEB914)" },
  },
  "& .MuiInputLabel-root": { color: "var(--text-secondary, #8A92A6)", fontSize: "13px" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent-gold, #FEB914)" },
  "& .MuiSelect-icon": { color: "var(--text-secondary, #8A92A6)" },
};

const popoverFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "13px",
    color: "var(--text-primary, #FFF)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    "& fieldset": { borderColor: "var(--border, rgba(255, 255, 255, 0.12))" },
    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.25)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #FEB914)" },
  },
  "& .MuiInputLabel-root": { color: "var(--text-secondary, #8A92A6)", fontSize: "12.5px" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent-gold, #FEB914)" },
  "& .MuiSelect-icon": { color: "var(--text-secondary, #8A92A6)" },
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
  const { data } = useAnalytics<{ cells: { id: string; label: string; booking_requests: number }[] }>(
    "geography/",
    { period: "last_90_days", level: "area" }
  );
  const options = (data?.cells || []).slice(0, 60);

  return (
    <TextField
      select
      size="small"
      label="Location"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sx={{ ...popoverFieldSx, minWidth: 220 }}
    >
      <MenuItem value="">All locations</MenuItem>
      {options.map((cell) => (
        <MenuItem key={cell.id} value={cell.id}>
          {(cell.label || cell.id).slice(0, 48)} ({cell.booking_requests})
        </MenuItem>
      ))}
    </TextField>
  );
}

export function GlobalFilterBar({
  show = ["ride_type", "payment_method", "vehicle_type", "area"],
  onRefresh,
  notApplicable = [],
}: {
  show?: FilterKey[];
  onRefresh?: () => void;
  notApplicable?: string[];
}) {
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
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.5}
      sx={{
        alignItems: { xs: "stretch", md: "center" },
        "@media print": { display: "none" },
      }}
    >
      {/* Period Dropdown */}
      <TextField
        select
        size="small"
        label="Period"
        value={period}
        onChange={(event) => choosePeriod(event.target.value)}
        sx={selectFieldSx}
      >
        {PERIODS.map(([key, label]) => (
          <MenuItem key={key} value={key} sx={{ fontSize: 13 }}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      {/* Custom Date Range Chip */}
      {period === "custom" && values.start && values.end && (
        <Chip
          size="small"
          label={`${values.start} → ${values.end}`}
          onClick={() => choosePeriod("custom")}
          sx={{
            height: 32,
            backgroundColor: "rgba(254, 185, 20, 0.12)",
            color: "var(--accent-gold, #FEB914)",
            border: "1px solid rgba(254, 185, 20, 0.3)",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(254, 185, 20, 0.2)" },
          }}
        />
      )}

      {/* Filter Trigger Button */}
      {extra.length > 0 && (
        <Button
          id="analytics-filter-button"
          variant="outlined"
          size="small"
          startIcon={<MdFilterList size={18} />}
          onClick={(event) => {
            setDraft(values);
            setAnchor(event.currentTarget);
          }}
          sx={{
            height: 40,
            px: 2,
            textTransform: "none",
            fontSize: 13.5,
            fontWeight: 600,
            borderRadius: "10px",
            color: activeCount > 0 ? "var(--accent-gold, #FEB914)" : "var(--text-primary, #FFF)",
            backgroundColor: activeCount > 0 ? "rgba(254, 185, 20, 0.08)" : "rgba(255, 255, 255, 0.03)",
            border: "1px solid",
            borderColor: activeCount > 0 ? "var(--accent-gold, #FEB914)" : "var(--border, rgba(255, 255, 255, 0.12))",
            "&:hover": {
              borderColor: "var(--accent-gold, #FEB914)",
              backgroundColor: "rgba(254, 185, 20, 0.12)",
            },
          }}
        >
          Filters{activeCount ? ` (${activeCount})` : ""}
        </Button>
      )}

      {/* Applied Active Filter Chips */}
      {extra
        .filter((key) => values[key])
        .map((key) => (
          <Chip
            key={key}
            size="small"
            variant="outlined"
            label={`${FILTER_LABEL[key] || FILTER_LABEL[`${key}_id`] || key}: ${
              OPTIONS[key]?.find(([v]) => v === values[key])?.[1] || values[key]
            }`}
            onDelete={() => setValues({ ...values, [key]: undefined })}
            sx={{
              height: 32,
              borderRadius: "8px",
              backgroundColor: notApplicable.includes(
                key === "driver" ? "driver_id" : key === "rider" ? "rider_id" : key
              )
                ? "rgba(255, 255, 255, 0.04)"
                : "rgba(254, 185, 20, 0.08)",
              color: notApplicable.includes(
                key === "driver" ? "driver_id" : key === "rider" ? "rider_id" : key
              )
                ? "var(--text-secondary, #8A92A6)"
                : "var(--accent-gold, #FEB914)",
              borderColor: notApplicable.includes(
                key === "driver" ? "driver_id" : key === "rider" ? "rider_id" : key
              )
                ? "var(--border, rgba(255, 255, 255, 0.12))"
                : "var(--accent-gold, #FEB914)",
              fontSize: 12,
              fontWeight: 500,
              "& .MuiChip-deleteIcon": {
                color: "inherit",
                opacity: 0.7,
                "&:hover": { opacity: 1 },
              },
            }}
          />
        ))}

      <Box sx={{ flex: 1 }} />

      {/* Refresh Button */}
      {onRefresh && (
        <Tooltip title="Reload from the latest summaries">
          <Button
            size="small"
            color="inherit"
            startIcon={<MdRefresh size={18} />}
            onClick={onRefresh}
            sx={{
              height: 40,
              px: 2,
              textTransform: "none",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: "10px",
              color: "var(--text-secondary, #8A92A6)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
              "&:hover": {
                color: "var(--text-primary, #FFF)",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            Refresh
          </Button>
        </Tooltip>
      )}

      {/* Filter Popover Panel */}
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--bg-card, #11141D)",
              border: "1px solid var(--border, rgba(255, 255, 255, 0.12))",
              borderRadius: "14px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
              backgroundImage: "none",
              mt: 1,
            },
          },
        }}
      >
        <Stack spacing={2} sx={{ p: 2.5, width: 320 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary, #FFF)" }}>
            Filters
          </Typography>

          {/* Custom Date Inputs */}
          {(draft.period === "custom" || (draft.start && draft.end)) && (
            <Stack direction="row" spacing={1}>
              <TextField
                type="date"
                size="small"
                label="From"
                value={draft.start || ""}
                onChange={(e) => setDraft({ ...draft, start: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                sx={popoverFieldSx}
              />
              <TextField
                type="date"
                size="small"
                label="To"
                value={draft.end || ""}
                onChange={(e) => setDraft({ ...draft, end: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                sx={popoverFieldSx}
              />
            </Stack>
          )}

          {/* Dynamic Extra Filter Fields */}
          {extra.map((key) => {
            if (key === "area")
              return can("geography.view") ? (
                <AreaOptions
                  key={key}
                  value={draft.area || ""}
                  onChange={(value) => setDraft({ ...draft, area: value })}
                />
              ) : null;

            if (key === "driver" || key === "rider")
              return (
                <TextField
                  key={key}
                  size="small"
                  label={`${key === "driver" ? "Driver" : "Rider"} ID`}
                  value={draft[key] || ""}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value.trim() })}
                  sx={popoverFieldSx}
                />
              );

            return (
              <TextField
                key={key}
                select
                size="small"
                label={FILTER_LABEL[key] || key}
                value={draft[key] || ""}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                sx={popoverFieldSx}
              >
                <MenuItem value="">All</MenuItem>
                {(OPTIONS[key] || []).map(([value, label]) => (
                  <MenuItem key={value} value={value} sx={{ fontSize: 13 }}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            );
          })}

          {/* Popover Action Buttons */}
          <Stack sx={{ justifyContent: "flex-end", pt: 1 }} direction="row" spacing={1}>
            <Button
              size="small"
              onClick={() =>
                setDraft(
                  Object.fromEntries(
                    Object.entries(draft).filter(([key]) => ["period", "start", "end"].includes(key))
                  )
                )
              }
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-secondary, #8A92A6)",
                textTransform: "none",
                "&:hover": { color: "var(--text-primary, #FFF)" },
              }}
            >
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
              sx={{
                px: 2.5,
                fontSize: 13,
                fontWeight: 700,
                borderRadius: "8px",
                textTransform: "none",
                backgroundColor: "var(--accent-gold, #FEB914)",
                color: "#17130A",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#F4B400", boxShadow: "none" },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(254, 185, 20, 0.3)",
                  color: "rgba(23, 19, 10, 0.5)",
                },
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