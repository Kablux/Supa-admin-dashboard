import React from "react";
import { Box, Typography } from "@mui/material";

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export default function Field({ label, hint, children }: FieldProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 500,
          color: "var(--text-primary)",
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      {children}
      {hint && (
        <Typography
          sx={{ fontSize: 12, color: "var(--text-secondary)", mt: 0.5 }}
        >
          {hint}
        </Typography>
      )}
    </Box>
  );
}