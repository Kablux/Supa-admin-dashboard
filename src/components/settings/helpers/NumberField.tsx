import { TextField, InputAdornment } from "@mui/material";
import type { CSSProperties } from "react";
 
export const cardSx = {
  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--border, rgba(255,255,255,0.1))",
  borderRadius: "16px",
  overflow: "hidden",
};
 
export const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: 44,
    borderRadius: "10px",
    fontSize: 14,
    color: "var(--text-primary)",
    backgroundColor: "rgba(255,255,255,0.02)",
    "& fieldset": { borderColor: "var(--border, rgba(255,255,255,0.12))" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #FFD700)" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.35)",
    opacity: 1,
  },
};
 
export const adornSx: CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 13,
};

interface NumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  start?: string;
  end?: string;
  placeholder?: string;
}

export default function NumberField({
  value,
  onChange,
  start,
  end,
  placeholder,
}: NumberFieldProps) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      fullWidth
      sx={inputSx}
      slotProps={{
        input: {
          startAdornment: start ? (
            <InputAdornment position="start">
              <span style={adornSx}>{start}</span>
            </InputAdornment>
          ) : undefined,
          endAdornment: end ? (
            <InputAdornment position="end">
              <span style={adornSx}>{end}</span>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}