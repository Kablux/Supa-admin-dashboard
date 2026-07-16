import { Box, Typography } from "@mui/material";
import AppButton from "../common/AppButton";
import heroImage from "../../assets/inspect-bg.png";

export function HeroBanner() {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 240,
        borderRadius: "16px",
        // 1. Combine gradient overlay and image.
        // Using rgba() ensures the gradient is semi-transparent so the image shows through.
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
        border: "1px solid var(--border)",
        p: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Improved Title Typography */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: 24, sm: 32 },
            color: "#ffffff",
            lineHeight: 1.2,
            mb: 1.5,
            maxWidth: 375,
            letterSpacing: "-0.5px", // Modern, tight kerning
            fontFamily: "'Inter', 'Roboto', sans-serif",
          }}
        >
          Easy way to Inspect your car at a low rate
        </Typography>

        {/* Improved Subtitle Typography */}
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: 1.6,
            maxWidth: 310,
            fontSize: 14,
            mb: 3,
          }}
        >
          Providing cheap car rental services and safe, comfortable facilities
          for your peace of mind.
        </Typography>

        <AppButton
          size="medium"
          sx={{
            borderRadius: "8px",
            px: 3,
            py: 1,
          }}
        >
          Inspect Now
        </AppButton>
      </Box>
    </Box>
  );
}
