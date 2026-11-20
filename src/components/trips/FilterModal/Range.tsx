import React from "react";
import { Box, TextField } from "@mui/material";
import { SectionLabel, dateFieldSx } from "./styles";


interface DateRangeFieldProps {
  sectionLabel: string;
  afterValue?: string;
  beforeValue?: string;
  onAfterChange: (val: string) => void;
  onBeforeChange: (val: string) => void;
}

export default function DateRangeField({
  sectionLabel,
  afterValue,
  beforeValue,
  onAfterChange,
  onBeforeChange,
}: DateRangeFieldProps) {
  return (
    <Box>
      <SectionLabel>{sectionLabel}</SectionLabel>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <TextField
          type="date"
          size="small"
          label="From"
          slotProps={{ inputLabel: { shrink: true } }}
          value={afterValue || ""}
          onChange={(e) => onAfterChange(e.target.value)}
          sx={dateFieldSx}
        />
        <TextField
          type="date"
          size="small"
          label="To"
          slotProps={{ inputLabel: { shrink: true } }}
          value={beforeValue || ""}
          onChange={(e) => onBeforeChange(e.target.value)}
          sx={dateFieldSx}
        />
      </Box>
    </Box>
  );
}