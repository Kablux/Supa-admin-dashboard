import { Box, Typography } from "@mui/material";

interface MetaItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export function MetaItem({ icon, label, value }: MetaItemProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1,  }}
      >
        {icon}
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{value}</Typography>
      </Box>
      <Typography sx={{ fontSize: 12, color: "secondary.main" }}>
        {label}
      </Typography>
    </Box>
  );
}

export function Divider() {
  return (
    <Typography sx={{ fontSize: 24, color: "var(--text-secondary)" }}>
      |
    </Typography>
  );
}