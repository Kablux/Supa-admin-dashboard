import { Box, Typography } from "@mui/material";

export const MetricBox = ({
  value,
  label,
  labelColor,
}: {
  value: string | number;
  label: string;
  labelColor: string;
}) => (
  <Box
    sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 1.5,
      border: "1px solid var(--border)",
      borderRadius: "8px",
    }}
  >
    <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 0.5 }}>
      {value}
    </Typography>
    <Typography sx={{ fontSize: 12, color: labelColor }}>{label}</Typography>
  </Box>
);
