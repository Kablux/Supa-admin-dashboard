import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  MenuItem,
  Select,
  TextField,
  Chip,
  Divider,
  FormControl,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export interface TripFilterState {
  payment_method?: string;
  driver?: string;
  rider?: string;
  created_at_after?: string;
  created_at_before?: string;
  start_time_after?: string;
  start_time_before?: string;
}

type Option = { value: string; label: string };

// ADJUST to match the backend's payment method enum.
export const PAYMENT_METHOD_OPTIONS: Option[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "wallet", label: "Wallet" },
];

const labelFor = (options: Option[], value?: string) =>
  options.find((o) => o.value === value)?.label ?? value ?? "";

/* ------------------------------ styles ---------------------------- */

const selectSx = {
  height: 42,
  borderRadius: "10px",
  color: "var(--text-primary)",
  backgroundColor: "rgba(255,255,255,0.02)",
  fontSize: 13.5,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--border, rgba(255,255,255,0.12))",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.25)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--accent-gold, #FFD700)",
  },
  "& .MuiSvgIcon-root": { color: "var(--text-secondary)" },
};

const menuProps = {
  slotProps: {
    paper: {
      sx: {
      mt: 0.5,
      backgroundColor: "var(--bg-card, #1E1E1E)",
      backgroundImage: "none",
      border: "1px solid var(--border, rgba(255,255,255,0.1))",
      borderRadius: "10px",
      boxShadow: "0 12px 28px rgba(0,0,0,0.5)",
      "& .MuiMenuItem-root": {
        fontSize: 14,
        color: "var(--text-primary)",
        "&:hover": {
          backgroundColor: "var(--bg-card-hover, rgba(255,255,255,0.05))",
        },
        "&.Mui-selected": { backgroundColor: "rgba(255,215,0,0.12)" },
        "&.Mui-selected:hover": { backgroundColor: "rgba(255,215,0,0.16)" },
      },
    },
  },
    }
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 42,
    borderRadius: "10px",
    fontSize: 13.5,
    color: "var(--text-secondary)",
    backgroundColor: "rgba(255,255,255,0.02)",
    "& fieldset": { borderColor: "var(--border, rgba(255,255,255,0.12))" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #FFD700)" },
  },
  "& .MuiInputBase-input::placeholder": {
    opacity: 1,
  },
};

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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontSize: 12,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      color: "var(--text-primary)",
      mb: 1.25,
    }}
  >
    {children}
  </Typography>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography sx={{ fontSize: 12,textTransform:"uppercase", color: "var(--text-primary)", mb: 0.6 }}>
    {children}
  </Typography>
);

/* ------------------------------------------------------------------ */

interface TripFiltersProps {
  value: TripFilterState;
  onChange: (next: TripFilterState) => void;
}

export default function TripFilters({ value, onChange }: TripFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TripFilterState>(value);

  const handleOpen = () => {
    setDraft(value);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const update = (
    key: keyof TripFilterState,
    val: string | undefined,
  ) => {
    setDraft((prev) => {
      const next = { ...prev };
      if (!val) delete next[key];
      else next[key] = val;
      return next;
    });
  };

  const apply = () => {
    onChange(draft);
    handleClose();
  };

  const resetDraft = () => setDraft({});

  const countOf = (f: TripFilterState) =>
    Object.values(f).filter((v) => v !== undefined && v !== "").length;

  const activeCount = useMemo(() => countOf(value), [value]);
  const draftCount = countOf(draft);

  const buildChips = (f: TripFilterState) => {
    const list: { key: keyof TripFilterState; label: string }[] = [];
    if (f.payment_method)
      list.push({
        key: "payment_method",
        label: `Payment: ${labelFor(PAYMENT_METHOD_OPTIONS, f.payment_method)}`,
      });
    if (f.rider) list.push({ key: "rider", label: `Rider: ${f.rider}` });
    if (f.driver) list.push({ key: "driver", label: `Driver: ${f.driver}` });
    if (f.created_at_after)
      list.push({ key: "created_at_after", label: `Created ≥ ${f.created_at_after}` });
    if (f.created_at_before)
      list.push({ key: "created_at_before", label: `Created ≤ ${f.created_at_before}` });
    if (f.start_time_after)
      list.push({ key: "start_time_after", label: `Started ≥ ${f.start_time_after}` });
    if (f.start_time_before)
      list.push({ key: "start_time_before", label: `Started ≤ ${f.start_time_before}` });
    return list;
  };

  const draftChips = buildChips(draft);

  const removeDraftKey = (key: keyof TripFilterState) =>
    setDraft((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  return (
    <>
      {/* Trigger */}
      <Button
        onClick={handleOpen}
        startIcon={<FilterListIcon sx={{ fontSize: 18 }} />}
        sx={{
          height: 40,
          px: 2,
          textTransform: "none",
          fontSize: 14,
          fontWeight: 600,
          borderRadius: "10px",
          color: activeCount ? "#000" : "var(--text-primary)",
          backgroundColor: activeCount
            ? "var(--accent-gold, #FFD700)"
            : "rgba(255,255,255,0.03)",
          border: "1px solid",
          borderColor: activeCount
            ? "var(--accent-gold, #FFD700)"
            : "var(--border, rgba(255,255,255,0.12))",
          "&:hover": {
            backgroundColor: activeCount
              ? "var(--accent-gold, #FFD700)"
              : "rgba(255,255,255,0.06)",
            borderColor: activeCount
              ? "var(--accent-gold, #FFD700)"
              : "rgba(255,255,255,0.25)",
          },
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

      {/* Right-side filter drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 400 },
              backgroundColor: "var(--bg-card, #1E1E1E)",
              backgroundImage: "none",
              borderLeft: "1px solid var(--border, rgba(255,255,255,0.1))",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Advanced Filters
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{ color: "secondary.main", mt: -0.5, mr: -0.5 }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {/* Active (draft) chips */}
        {draftChips.length > 0 && (
          <Box
            sx={{
              px: 3,
              pb: 2,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            {draftChips.map((chip) => (
              <Chip
                key={chip.key}
                size="small"
                label={chip.label}
                onDelete={() => removeDraftKey(chip.key)}
                deleteIcon={<CloseRoundedIcon />}
                sx={{
                  height: 28,
                  backgroundColor: "rgba(255,215,0,0.08)",
                  color: "var(--text-primary)",
                  border: "1px solid rgba(255,215,0,0.25)",
                  borderRadius: "8px",
                  fontSize: 12,
                  "& .MuiChip-deleteIcon": {
                    fontSize: 15,
                    color: "rgba(255,255,255,0.55)",
                    "&:hover": { color: "#fff" },
                  },
                }}
              />
            ))}
          </Box>
        )}

        <Divider />

        {/* Body */}
        <Box
          sx={{
            px: 2,
            py: 3,
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3.5,
          }}
        >
          {/* Details */}
          <Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <FieldLabel>Payment method</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select
                    displayEmpty
                    value={draft.payment_method ?? ""}
                    onChange={(e) =>
                      update("payment_method", e.target.value || undefined)
                    }
                    MenuProps={menuProps}
                    sx={selectSx}
                    renderValue={(selected) =>
                      selected ? (
                        labelFor(PAYMENT_METHOD_OPTIONS, selected as string)
                      ) : (
                        <span style={{ color: "var(--text-secondary)" }}>
                          Any
                        </span>
                      )
                    }
                  >
                    <MenuItem value="">Any</MenuItem>
                    {PAYMENT_METHOD_OPTIONS.map((o) => (
                      <MenuItem key={o.value} value={o.value}>
                        {o.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FieldLabel>Rider</FieldLabel>
                <TextField
                  value={draft.rider ?? ""}
                  onChange={(e) => update("rider", e.target.value || undefined)}
                  onKeyDown={(e) => e.key === "Enter" && apply()}
                  placeholder="Rider ID"
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
              </Box>
              <Box>
                <FieldLabel>Driver</FieldLabel>
                <TextField
                  value={draft.driver ?? ""}
                  onChange={(e) => update("driver", e.target.value || undefined)}
                  onKeyDown={(e) => e.key === "Enter" && apply()}
                  placeholder="Driver ID"
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
              </Box>
            </Box>
          </Box>

          {/* Created range */}
          <Box>
            <SectionLabel>Created date</SectionLabel>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                type="date"
                size="small"
                label="From"
                slotProps={{ inputLabel: { shrink: true } }}
                value={draft.created_at_after || ""}
                onChange={(e) => update("created_at_after", e.target.value)}
                sx={dateFieldSx}
              />
              <TextField
                type="date"
                size="small"
                label="To"
                slotProps={{ inputLabel: { shrink: true } }}
                value={draft.created_at_before || ""}
                onChange={(e) => update("created_at_before", e.target.value)}
                sx={dateFieldSx}
              />
            </Box>
          </Box>

          {/* Start time range */}
          <Box>
            <SectionLabel>Start time</SectionLabel>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                type="date"
                size="small"
                label="From"
                slotProps={{ inputLabel: { shrink: true } }}
                value={draft.start_time_after || ""}
                onChange={(e) => update("start_time_after", e.target.value)}
                sx={dateFieldSx}
              />
              <TextField
                type="date"
                size="small"
                label="To"
                slotProps={{ inputLabel: { shrink: true } }}
                value={draft.start_time_before || ""}
                onChange={(e) => update("start_time_before", e.target.value)}
                sx={dateFieldSx}
              />
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: 1.5,
          }}
        >
          <Button
            onClick={resetDraft}
            disabled={draftCount === 0}
            fullWidth
            sx={{
              height: 44,
              textTransform: "none",
              fontSize: 13.5,
              fontWeight: 600,
              borderRadius: "10px",
              color: "var(--text-primary)",
              border: "1px solid var(--border, rgba(255,255,255,0.15))",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.3)",
                backgroundColor: "rgba(255,255,255,0.03)",
              },
              "&.Mui-disabled": {
                color: "rgba(255,255,255,0.3)",
                borderColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            Reset
          </Button>
          <Button
            onClick={apply}
            fullWidth
            sx={{
              height: 44,
              textTransform: "none",
              fontSize: 13.5,
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
            {draftCount > 0 ? `Apply filters (${draftCount})` : "Apply filters"}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}