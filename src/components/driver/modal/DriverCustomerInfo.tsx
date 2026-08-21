import React from "react";
import { Box, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Driver } from "../../../types/auth";

const infoBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  p: 1.5,
  border: "1px solid var(--text-primary)",
  width: "100%",
  borderRadius: "4px",
};

export default function DriverCustomerInfo({ driver }: { driver: Driver }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 14, mb: 1.5, color: "primary" }}>
        Customer Info
      </Typography>
      <Box className="gap-4 flex">
        <Box sx={infoBoxStyle}>
          <PhoneIcon sx={{ fontSize: 18, color: "secondary.main" }} />
          <Typography sx={{ fontSize: 14 }}>
            {driver.phone_number || "N/A"}
          </Typography>
        </Box>
        <Box sx={infoBoxStyle}>
          <LocationOnIcon sx={{ fontSize: 18, color: "secondary.main" }} />
          <Typography sx={{ fontSize: 14 }}>
            {driver.address || "No address provided"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}