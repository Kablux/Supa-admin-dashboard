import { Box, Typography } from "@mui/material";

export default function MapLegend() {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 12,
        left: 16,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "secondary.main",
        px: 1.5,
        py: 0.75,
        borderRadius: 1,
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Typography sx={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>
        Low
      </Typography>
      <Box
        sx={{
          width: 64,
          height: 6,
          borderRadius: 3,
          background:
            "linear-gradient(90deg, #0000ff, #00ff00, #ffff00, #ff0000)",
        }}
      />
      <Typography sx={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>
        High
      </Typography>
      <Typography sx={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", ml: 0.5 }}>
        · driver density
      </Typography>
    </Box>
  );
}