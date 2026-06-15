import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export default function AdminTextField(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      sx={{
        "& .MuiInputLabel-root": {
          fontSize: "13.5px",
          color: "var(--text-muted)",
          "&.Mui-focused": { color: "var(--accent-gold)" },
          "&.Mui-error": { color: "#ef4444" },
        },
        "& .MuiFormHelperText-root": {
          fontSize: "11.5px",
          marginLeft: 0,
          marginTop: "6px",
        },
        "& .MuiOutlinedInput-root": {
          height: 54,
          borderRadius: "14px",

          backgroundColor: "var(--bg-secondary)",

          transition: "all .2s ease",

          "& fieldset": {
            borderColor: "var(--border)",
          },

          "&:hover": {
            backgroundColor: "var(--bg-card)",
          },

          "&:hover fieldset": {
            borderColor: "var(--text-muted)",
          },

          "&.Mui-focused": {
            boxShadow: "0 0 0 4px rgba(245,197,24,.08)",
          },

          "&.Mui-focused fieldset": {
            borderColor: "var(--accent-gold)",
          },
        },
        ...props.sx, 
      }}
    />
  );
}
