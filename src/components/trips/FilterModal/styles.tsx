import React from "react";
import { Typography } from "@mui/material";

export const selectSx = {
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

export const menuProps = {
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
  },
};

export const textFieldSx = {
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

export const dateFieldSx = {
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

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
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

export const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontSize: 12,
      textTransform: "uppercase",
      color: "var(--text-primary)",
      mb: 0.6,
    }}
  >
    {children}
  </Typography>
);