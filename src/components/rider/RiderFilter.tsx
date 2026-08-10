import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Popover,
  Typography,
  TextField,
  Chip,
  Divider,
} from "@mui/material";
import FilterListIcon  from "@mui/icons-material/FilterList";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export interface RiderFilterState {
  period?: "today" | "yesterday" | "this_week" | "this_month" | "";
  created_at_after?: string;
  created_at_before?: string;
}

type Period = NonNullable<RiderFilterState["period"]>;

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "", label: "All time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This week" },
  { value: "this_month", label: "This month" },
];

const periodLabel = (v?: string) =>
  PERIOD_OPTIONS.find((o) => o.value === v)?.label ?? v ?? "";

/* ------------------------------- styles ------------------------------- */

const dateFieldSx = {
  flex: 1,
  "& .MuiOutlinedInput-root": {
    height: 42,
    borderRadius: "10px",
    fontSize: 13.5,
    color: "var(--text-primary)",
    backgroundColor: "rgba(255,255,255,0.02)",
    "& fieldset": { borderColor: "var(--border, rgba(255,255,255,0.12))" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #FFD700)" },
    "& input::-webkit-calendar-picker-indicator": {
      filter: "invert(0.75)",
      cursor: "pointer",
    },
  },
  "& .MuiInputLabel-root": { color: "var(--text-secondary)", fontSize: 13 },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--accent-gold, #FFD700)",
  },
};

const MicroLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: "0.05em",
      textTransform: "capitalize",
      color: "secondary.main",
      mb: 1.25,
    }}
  >
    {children}
  </Typography>
);

/* ------------------------------------------------------------------ */

interface RiderFiltersProps {
  value: RiderFilterState;
  onChange: (newFilters: RiderFilterState) => void;
}

const EMPTY: RiderFilterState = {
  period: "",
  created_at_after: "",
  created_at_before: "",
};

export default function RiderFilters({ value, onChange }: RiderFiltersProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [draft, setDraft] = useState<RiderFilterState>(value);

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setDraft(value);
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const countOf = (f: RiderFilterState) =>
    (f.period ? 1 : 0) +
    (f.created_at_after ? 1 : 0) +
    (f.created_at_before ? 1 : 0);

  const activeCount = useMemo(() => countOf(value), [value]);

  // Preset and custom range are mutually exclusive.
  const selectPeriod = (value: Period) =>
    setDraft({ period: value, created_at_after: "", created_at_before: "" });

  const setDate = (
    key: "created_at_after" | "created_at_before",
    value: string,
  ) => setDraft((d) => ({ ...d, [key]: value, period: "" }));

  const apply = () => {
    onChange(draft);
    handleClose();
  };

  const resetDraft = () => setDraft(EMPTY);

  const removeChip = (key: keyof RiderFilterState) =>
    setDraft((d) => ({ ...d, [key]: "" }));

  const chips: { key: keyof RiderFilterState; label: string }[] = [];
  if (draft.period)
    chips.push({ key: "period", label: `Period: ${periodLabel(draft.period)}` });
  if (draft.created_at_after)
    chips.push({ key: "created_at_after", label: `From: ${draft.created_at_after}` });
  if (draft.created_at_before)
    chips.push({ key: "created_at_before", label: `To: ${draft.created_at_before}` });

  return (
    <>
      {/* Trigger */}
      <Button
        onClick={handleOpen}
        startIcon={<FilterListIcon />}
        sx={{
          px: 2,
          textTransform: "none",
          fontWeight: 500,
          borderColor: "divider",
          color: "text.primary",
          border: "1px solid var(--text-secondary)",
          backgroundColor: activeCount
            ? "var(--accent-gold, #FFD700)"
            : "rgba(255,255,255,0.03)",
          "&:hover": { color: "var(--text-primary)", backgroundColor: "rgba(255,255,255,0.06)" },
        }}
      >
        Filters
        {activeCount > 0 && (
          <Box
            component="span"
            sx={{
              ml: 1,
              minWidth: 20,
              height: 20,
              px: 0.5,
              borderRadius: "10px",
              backgroundColor: "rgba(0,0,0,0.85)",
              color: "var(--accent-gold, #FFD700)",
              fontSize: 12,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {activeCount}
          </Box>
        )}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: { xs: "calc(100vw - 32px)", sm: 360 },
              maxWidth: 360,
              backgroundColor: "var(--bg-card, #1E1E1E)",
              backgroundImage: "none",
              border: "1px solid var(--border, rgba(255,255,255,0.1))",
              borderRadius: "16px",
              boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
              overflow: "hidden",
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            Filter riders
          </Typography>
          <Button
            onClick={resetDraft}
            disabled={countOf(draft) === 0}
            sx={{
              textTransform: "none",
              fontSize: 12,
              fontWeight: 600,
              minWidth: "auto",
              px: 1,
              color: "var(--text-secondary)",
              "&:hover": {
                color: "var(--text-primary)",
                backgroundColor: "transparent",
              },
              "&.Mui-disabled": { color: "rgba(255,255,255,0.25)" },
            }}
          >
            Reset
          </Button>
        </Box>

        {/* Active chips */}
        {chips.length > 0 && (
          <Box
            sx={{ px: 2.5, pb: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}
          >
            {chips.map((chip) => (
              <Chip
                key={chip.key}
                size="small"
                label={chip.label}
                onDelete={() => removeChip(chip.key)}
                deleteIcon={<CloseRoundedIcon />}
                sx={{
                  height: 28,
                  backgroundColor: "rgba(255,215,0,0.08)",
                  color: "var(--text-primary)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  borderRadius: "8px",
                  fontSize: 12,
                  "& .MuiChip-deleteIcon": {
                    fontSize: 14,
                    color: "rgba(255,255,255,0.55)",
                    "&:hover": { color: "#fff" },
                  },
                }}
              />
            ))}
          </Box>
        )}

        <Divider sx={{borderColor: "var(--border)" }} />

        {/* Body */}
        <Box sx={{ px: 2.5, py: 2.5 }}>
          {/* Period presets */}
          <MicroLabel>Date preset</MicroLabel>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {PERIOD_OPTIONS.map((opt) => {
              const selected = (draft.period ?? "") === opt.value;
              return (
                <Box
                  key={opt.value || "all"}
                  onClick={() => selectPeriod(opt.value)}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "8px",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.15s ease",
                    backgroundColor: selected
                      ? "var(--accent-gold, #FFD700)"
                      : "rgba(255,255,255,0.03)",
                    color: selected ? "#000" : "var(--text-secondary)",
                    border: "1px solid",
                    borderColor: selected
                      ? "var(--accent-gold, #FFD700)"
                      : "var(--border, rgba(255,255,255,0.12))",
                    "&:hover": {
                      borderColor: selected
                        ? "var(--accent-gold, #FFD700)"
                        : "rgba(255,255,255,0.25)",
                      color: selected ? "#000" : "var(--text-primary)",
                    },
                  }}
                >
                  {opt.label}
                </Box>
              );
            })}
          </Box>

          {/* Divider with "or" */}
        <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      my: 2.5,
                    }}
                  >
                    <Divider sx={{ flex: 1, borderColor: "var(--border)" }} />
                    <Typography sx={{ fontSize: 12, color: "secondary.main" }}>
                      or custom range
                    </Typography>
                    <Divider sx={{ flex: 1, borderColor: "var(--border)" }} />
                  </Box>

          {/* Custom date range */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <TextField
              type="date"
              size="small"
              label="From"
              slotProps={{ inputLabel: { shrink: true } }}
              value={draft.created_at_after || ""}
              onChange={(e) => setDate("created_at_after", e.target.value)}
              sx={dateFieldSx}
            />
            <TextField
              type="date"
              size="small"
              label="To"
              slotProps={{ inputLabel: { shrink: true } }}
              value={draft.created_at_before || ""}
              onChange={(e) => setDate("created_at_before", e.target.value)}
              sx={dateFieldSx}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: "var(--border)" }} />

        {/* Footer */}
        <Box sx={{ display: "flex", gap: 1.5, px: 2.5, py: 2 }}>
                  <Button
                    onClick={handleClose}
                    fullWidth
                    sx={{
                      textTransform: "capitalize",
                      fontSize: 14,
                      fontWeight: 600,
                      borderRadius: "10px",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border, rgba(255,255,255,0.15))",
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.3)",
                        backgroundColor: "rgba(255,255,255,0.03)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={apply}
                    fullWidth
                    sx={{
                      textTransform: "capitalize",
                      fontSize: 14,
                      fontWeight: 700,
                      borderRadius: "10px",
                      backgroundColor: "var(--accent-gold, #FFD700)",
                      color: "#000",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "var(--accent-gold, #FFD700)",
                        boxShadow: "0 4px 12px rgba(255,215,0,0.25)",
                      },
                    }}
                  >
                    Apply filter
                  </Button>
                </Box>
      </Popover>
    </>
  );
}