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
  Divider,
  FormControl,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TripFilterState, countActiveFilters, buildTripFilterChips, labelFor, TRIP_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS, PERIOD_OPTIONS } from "./constants";
import DateRangeField from "./Range";
import { FieldLabel, menuProps, selectSx, textFieldSx } from "./styles";
import TripFilterChips from "./TripFilterChips";


interface TripFiltersProps {
  value: TripFilterState;
  onChange: (next: TripFilterState) => void;
}

export default function TripFilterDrawer({ value, onChange }: TripFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TripFilterState>(value);

  const handleOpen = () => {
    setDraft(value);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const update = <K extends keyof TripFilterState>(
    key: K,
    nextVal: TripFilterState[K]
  ) => {
    setDraft((prev) => {
      const next = { ...prev };
      if (nextVal === "" || nextVal === undefined) {
        delete next[key];
      } else {
        next[key] = nextVal;
      }
      return next;
    });
  };

  const apply = () => {
    onChange(draft);
    handleClose();
  };

  const resetDraft = () => setDraft({});

  const activeCount = useMemo(() => countActiveFilters(value), [value]);
  const draftCount = countActiveFilters(draft);
  const draftChips = useMemo(() => buildTripFilterChips(draft), [draft]);

  const removeDraftKey = (key: keyof TripFilterState) =>
    setDraft((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  return (
    <>
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
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Advanced Filters
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{ color: "secondary.main", mt: -0.5, mr: -0.5 }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <TripFilterChips chips={draftChips} onRemove={removeDraftKey} />

        <Divider />

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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <FieldLabel>Status</FieldLabel>
              <FormControl fullWidth size="small">
                <Select
                  displayEmpty
                  value={draft.status ?? ""}
                  onChange={(e) =>
                    update(
                      "status",
                      (e.target.value || undefined) as TripFilterState["status"]
                    )
                  }
                  MenuProps={menuProps}
                  sx={selectSx}
                  renderValue={(selected) =>
                    selected ? (
                      labelFor(TRIP_STATUS_OPTIONS, selected as string)
                    ) : (
                      <span style={{ color: "var(--text-secondary)" }}>
                        Any Status
                      </span>
                    )
                  }
                >
                  <MenuItem value="">Any Status</MenuItem>
                  {TRIP_STATUS_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

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

          <Box>
            <FieldLabel>Period</FieldLabel>
            <FormControl fullWidth size="small">
              <Select
                displayEmpty
                value={draft.period ?? ""}
                onChange={(e) =>
                  update(
                    "period",
                    (e.target.value || undefined) as TripFilterState["period"]
                  )
                }
                MenuProps={menuProps}
                sx={selectSx}
                renderValue={(selected) =>
                  selected ? (
                    labelFor(PERIOD_OPTIONS, selected as string)
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>
                      Any Period
                    </span>
                  )
                }
              >
                <MenuItem value="">Any Period</MenuItem>
                {PERIOD_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <DateRangeField
            sectionLabel="Created date"
            afterValue={draft.created_at_after}
            beforeValue={draft.created_at_before}
            onAfterChange={(val) => update("created_at_after", val)}
            onBeforeChange={(val) => update("created_at_before", val)}
          />

          <DateRangeField
            sectionLabel="Start time"
            afterValue={draft.start_time_after}
            beforeValue={draft.start_time_before}
            onAfterChange={(val) => update("start_time_after", val)}
            onBeforeChange={(val) => update("start_time_before", val)}
          />
        </Box>

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