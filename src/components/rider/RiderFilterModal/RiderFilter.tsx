import React, { useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { RiderFilterState } from "../../../types/auth";
import RiderFilterDrawer from "./FilterDrawer";


const EMPTY_FILTERS: RiderFilterState = {
  activity_segment: "",
  has_fcm: "",
  status: "",
  tier: "",
  ordering: "",
  period: "",
  created_at_after: "",
  created_at_before: "",
};

interface RiderFiltersProps {
  value: RiderFilterState;
  onChange: (newFilters: RiderFilterState) => void;
}

export default function RiderFilters({ value, onChange }: RiderFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<RiderFilterState>(value);

  const handleOpen = () => {
    setDraft({ ...EMPTY_FILTERS, ...value });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const countOf = (f: RiderFilterState) =>
    [
      f.activity_segment,
      f.has_fcm,
      f.status?.trim(),
      f.tier?.trim(),
      f.ordering,
      f.period,
      f.created_at_after,
      f.created_at_before,
    ].filter(Boolean).length;

  const activeCount = useMemo(() => countOf(value), [value]);

  const apply = () => {
    onChange(draft);
    handleClose();
  };

  const resetDraft = () => setDraft(EMPTY_FILTERS);

  return (
    <>
      <Button
        onClick={handleOpen}
        startIcon={<FilterListIcon />}
        sx={{
          px: 2,
          height: 38,
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 500,
          color: activeCount > 0 ? "#000" : "text.primary",
          border:
            activeCount > 0
              ? "1px solid var(--accent-gold, #FFD700)"
              : "1px solid var(--border, rgba(255,255,255,0.16))",
          backgroundColor:
            activeCount > 0
              ? "var(--accent-gold, #FFD700)"
              : "rgba(255,255,255,0.03)",
          "&:hover": {
            backgroundColor:
              activeCount > 0
                ? "var(--accent-gold, #FFD700)"
                : "rgba(255,255,255,0.06)",
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

      <RiderFilterDrawer
        open={open}
        onClose={handleClose}
        draft={draft}
        setDraft={setDraft}
        onApply={apply}
        onReset={resetDraft}
        filterCount={countOf}
      />
    </>
  );
}