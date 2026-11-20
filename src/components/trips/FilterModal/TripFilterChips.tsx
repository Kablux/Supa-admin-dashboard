import React from "react";
import { Box, Chip } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { FilterChipItem, TripFilterState } from "./constants";

interface TripFilterChipsProps {
  chips: FilterChipItem[];
  onRemove: (key: keyof TripFilterState) => void;
}

export default function TripFilterChips({
  chips,
  onRemove,
}: TripFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
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
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          size="small"
          label={chip.label}
          onDelete={() => onRemove(chip.key)}
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
  );
}