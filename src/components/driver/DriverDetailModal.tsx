import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { MetricBox } from "../ModalMetricsBox";
import { fetchDriverDetails } from "../../api/xhr";
import { Driver } from "../../types/auth";

const infoBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  p: 1.5,
  border: "1px solid var(--border)",
  borderRadius: "8px",
};

interface DriverDetailsModalProps {
  driverId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DriverDetailsModal({
  driverId,
  isOpen,
  onClose,
}: DriverDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [driverData, setDriverData] = useState<Driver | null>(null);
  useEffect(() => {
    if (isOpen && driverId) {
      setLoading(true);
      fetchDriverDetails(driverId)
        .then((data) => setDriverData(data))
        .catch((err) => console.error("Failed to fetch driver details", err))
        .finally(() => setLoading(false));
    } else {
      setDriverData(null);
    }
  }, [isOpen, driverId]);
  const handleCopyEmail = () => {
    if (driverData?.email) navigator.clipboard.writeText(driverData.email);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card)",
          color: "primary",
          borderRadius: "18px",
          maxWidth: 425,
          width: "100%",
          p: 4,
          border: "1px solid var(--border)",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        },
      }}
    >
      {loading || !driverData ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "var(--accent-gold)" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Header section: Avatar and Basic Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={driverData.profile_picture_url}
                sx={{ width: 64, height: 64 }}
              />
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <StarIcon sx={{ color: "#ffb400", fontSize: 18 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 700, mr: 0.5 }}>
                    {parseFloat(driverData.rating || "0")}
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {driverData.full_name}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: "secondary.main" }}>
                  {driverData.email}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCopyEmail} sx={{ color: "#4d8eff" }}>
              <ContentCopyIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Customer Info Section */}
          <Box>
            <Typography sx={{ fontSize: 14, mb: 1.5, color: "secondary.main" }}>
              Customer Info
            </Typography>
            <Box className="gap-5 flex flex-col">
              <Box sx={infoBoxStyle}>
                <PhoneIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                <Typography sx={{ fontSize: 14 }}>
                  {driverData.phone_number || "N/A"}
                </Typography>
              </Box>
              <Box sx={infoBoxStyle}>
                <LocationOnIcon
                  sx={{ fontSize: 18, color: "secondary.main" }}
                />
                <Typography sx={{ fontSize: 14 }}>
                  {driverData.address || "No address provided"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Points Section */}
          <Box>
            <Typography sx={{ fontSize: 14, mb: 1.5, color: "secondary.main" }}>
              Points
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <MetricBox
                value={driverData.loyalty_points || "0"}
                label="Bonus"
                labelColor="#7a92f0"
              />
              <MetricBox
                value={driverData.mileage_points || "0"}
                label="Millage"
                labelColor="#50c878"
              />{" "}
            </Box>
          </Box>

          {/* Ride Overview Section */}
          <Box>
            <Typography sx={{ fontSize: 14, mb: 1.5, color: "secondary.main" }}>
              Ride overview
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <MetricBox
                value={driverData.total_rides || "0"}
                label="Total Ride"
                labelColor="#7a92f0"
              />
              <MetricBox
                value={driverData.completed_rides || "0"}
                label="Completed"
                labelColor="#50c878"
              />
              <MetricBox
                value={driverData.cancelled_rides || "0"}
                label="Canceled"
                labelColor="#ff6b6b"
              />
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
