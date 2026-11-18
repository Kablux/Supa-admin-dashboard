import React from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  TextField,
  Chip,
  Divider,
  MenuItem,
  Select,
  FormControl,
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  PERIOD_OPTIONS,
  ACTIVITY_SEGMENT_OPTIONS,
  FCM_OPTIONS,
  STATUS_OPTIONS,
  statusLabel,
  segmentLabel,
  fcmLabel,
  periodLabel,
  orderingLabel,
} from "./constants";
import { RiderFilterState, RiderPeriod } from "../../../types/auth";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "10px",
    fontSize: 13,
    color: "var(--text-primary)",
    backgroundColor: "rgba(255,255,255,0.02)",
    "& fieldset": { borderColor: "var(--border, rgba(255,255,255,0.12))" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #FFD700)" },
  },
  "& .MuiSvgIcon-root": {
    color: "var(--text-secondary)",
  },
};

const dateFieldSx = {
  flex: 1,
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "10px",
    fontSize: 13,
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
  "& .MuiInputLabel-root": { color: "var(--text-secondary)", fontSize: 12.5 },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--accent-gold, #FFD700)",
  },
};

const MicroLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.03em",
      color: "var(--text-secondary, #8A92A6)",
      mb: 1,
    }}
  >
    {children}
  </Typography>
);

interface RiderFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  draft: RiderFilterState;
  setDraft: React.Dispatch<React.SetStateAction<RiderFilterState>>;
  onApply: () => void;
  onReset: () => void;
  filterCount: (f: RiderFilterState) => number;
}

export default function RiderFilterDrawer({
  open,
  onClose,
  draft,
  setDraft,
  onApply,
  onReset,
  filterCount,
}: RiderFilterDrawerProps) {
  const selectPeriod = (nextPeriod: RiderPeriod | "") =>
    setDraft((d) => ({
      ...d,
      period: nextPeriod,
      created_at_after: "",
      created_at_before: "",
    }));

  const setDate = (
    key: "created_at_after" | "created_at_before",
    nextDate: string
  ) =>
    setDraft((d) => ({
      ...d,
      [key]: nextDate,
      period: "",
    }));

  const removeChip = (key: keyof RiderFilterState) =>
    setDraft((d) => ({ ...d, [key]: "" }));

  const chips: { key: keyof RiderFilterState; label: string }[] = [];
  if (draft.status?.trim())
    chips.push({ key: "status", label: `Status: ${statusLabel(draft.status.trim())}` });
  if (draft.activity_segment)
    chips.push({
      key: "activity_segment",
      label: `Segment: ${segmentLabel(draft.activity_segment)}`,
    });
  if (draft.has_fcm)
    chips.push({ key: "has_fcm", label: `FCM: ${fcmLabel(draft.has_fcm)}` });
  if (draft.tier?.trim())
    chips.push({ key: "tier", label: `Tier: ${draft.tier.trim()}` });
  if (draft.ordering)
    chips.push({ key: "ordering", label: `Sort: ${orderingLabel(draft.ordering)}` });
  if (draft.period)
    chips.push({ key: "period", label: `Period: ${periodLabel(draft.period)}` });
  if (draft.created_at_after)
    chips.push({ key: "created_at_after", label: `From: ${draft.created_at_after}` });
  if (draft.created_at_before)
    chips.push({ key: "created_at_before", label: `To: ${draft.created_at_before}` });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 400 },
            maxWidth: "100vw",
            backgroundColor: "var(--bg-card, #1A1D26)",
            backgroundImage: "none",
            color: "var(--text-primary, #FFFFFF)",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 2,
          borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
            Filter Riders
          </Typography>
          {filterCount(draft) > 0 && (
            <Chip
              size="small"
              label={`${filterCount(draft)} selected`}
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: "rgba(255,215,0,0.12)",
                color: "var(--accent-gold, #FFD700)",
              }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Button
            onClick={onReset}
            disabled={filterCount(draft) === 0}
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
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: "var(--text-secondary)" }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Chips */}
      {chips.length > 0 && (
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            display: "flex",
            flexWrap: "wrap",
            gap: 0.75,
            borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
            backgroundColor: "rgba(255,255,255,0.015)",
          }}
        >
          {chips.map((chip) => (
            <Chip
              key={chip.key}
              size="small"
              label={chip.label}
              onDelete={() => removeChip(chip.key)}
              deleteIcon={<CloseRoundedIcon />}
              sx={{
                height: 26,
                backgroundColor: "rgba(255,215,0,0.08)",
                color: "var(--text-primary)",
                border: "1px solid rgba(255,215,0,0.25)",
                borderRadius: "8px",
                fontSize: 11.5,
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

      {/* Body Controls */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2.5,
          py: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 3.5,
        }}
      >
        {/* Status */}
        <Box>
          <MicroLabel>Account Status</MicroLabel>
          <FormControl fullWidth size="small">
            <Select
              displayEmpty
              value={draft.status ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, status: e.target.value }))
              }
              sx={inputSx}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      backgroundColor: "var(--bg-card, #1A1D26)",
                      color: "var(--text-primary, #FFF)",
                      border: "1px solid var(--border, rgba(255,255,255,0.1))",
                      borderRadius: 2,
                      mt: 0.5,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      "& .MuiMenuItem-root": {
                        fontSize: 13,
                        "&:hover": { backgroundColor: "rgba(255,190,24,0.06)" },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(255,190,24,0.12)",
                          color: "#FFBE18",
                        },
                      },
                    },
                  },
                },
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value || "all"} value={opt.value} sx={{ fontSize: 13 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Activity Segment */}
        <Box>
          <MicroLabel>Activity Segment</MicroLabel>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {ACTIVITY_SEGMENT_OPTIONS.map((opt) => {
              const selected = (draft.activity_segment ?? "") === opt.value;
              return (
                <Box
                  key={opt.value || "all"}
                  onClick={() =>
                    setDraft((d) => ({ ...d, activity_segment: opt.value }))
                  }
                  sx={{
                    px: 1.25,
                    py: 0.65,
                    borderRadius: "8px",
                    fontSize: 12,
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
                  }}
                >
                  {opt.label}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* FCM */}
        <Box>
          <MicroLabel>FCM Token (has_fcm)</MicroLabel>
          <Box sx={{ display: "flex", gap: 0.75 }}>
            {FCM_OPTIONS.map((opt) => {
              const selected = (draft.has_fcm ?? "") === opt.value;
              return (
                <Box
                  key={opt.value || "all"}
                  onClick={() => setDraft((d) => ({ ...d, has_fcm: opt.value }))}
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    px: 1,
                    py: 0.75,
                    borderRadius: "8px",
                    fontSize: 12,
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
                  }}
                >
                  {opt.label}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Divider sx={{ borderColor: "var(--border, rgba(255,255,255,0.08))" }} />

        {/* Created Date */}
        <Box>
          <MicroLabel>Created Date Preset (period)</MicroLabel>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {PERIOD_OPTIONS.map((opt) => {
              const selected = (draft.period ?? "") === opt.value;
              return (
                <Box
                  key={opt.value || "all"}
                  onClick={() => selectPeriod(opt.value)}
                  sx={{
                    px: 1.25,
                    py: 0.65,
                    borderRadius: "8px",
                    fontSize: 12,
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
                  }}
                >
                  {opt.label}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 2 }}>
            <Divider sx={{ flex: 1, borderColor: "var(--border)" }} />
            <Typography sx={{ fontSize: 11.5, color: "var(--text-secondary)" }}>
              or custom created date range
            </Typography>
            <Divider sx={{ flex: 1, borderColor: "var(--border)" }} />
          </Box>

          <Box sx={{ display: "flex", gap: 1.25 }}>
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
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          px: 2.5,
          py: 2,
          borderTop: "1px solid var(--border, rgba(255,255,255,0.08))",
          backgroundColor: "var(--bg-secondary, #141721)",
        }}
      >
        <Button
          onClick={onClose}
          fullWidth
          sx={{
            textTransform: "none",
            fontSize: 13.5,
            fontWeight: 600,
            height: 40,
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
          onClick={onApply}
          fullWidth
          sx={{
            textTransform: "none",
            fontSize: 13.5,
            fontWeight: 700,
            height: 40,
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
    </Drawer>
  );
}