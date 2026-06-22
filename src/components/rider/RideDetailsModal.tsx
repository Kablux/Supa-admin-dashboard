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
import { Rider } from "../../types/auth";
import { fetchRiderDetails } from "../../api/xhr";
import { MetricBox } from "./ModalMetricsBox";

const infoBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  p: 1.5,
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: "8px",
};

interface RiderDetailsModalProps {
  riderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RiderDetailsModal({
  riderId,
  isOpen,
  onClose,
}: RiderDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [riderData, setRiderData] = useState<Rider | null>(null);
  useEffect(() => {
    if (isOpen && riderId) {
      setLoading(true);
      fetchRiderDetails(riderId)
        .then((data) => setRiderData(data))
        .catch((err) => console.error("Failed to fetch rider details", err))
        .finally(() => setLoading(false));
    } else {
      setRiderData(null);
    }
  }, [isOpen, riderId]);
  const handleCopyEmail = () => {
    if (riderData?.email) navigator.clipboard.writeText(riderData.email);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "#1E1E20",
          color: "#fff",
          borderRadius: "18px",
          maxWidth: 425,
          width: "100%",
          p: 4,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        },
      }}
    >
      {loading || !riderData ? (
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
                src={riderData.profile_image_url}
                sx={{ width: 64, height: 64 }}
              />
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <StarIcon sx={{ color: "#ffb400", fontSize: 20 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 700, mr: 0.5 }}>
                    {parseFloat(riderData.rating || "0")}
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {riderData.full_name}
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}
                >
                  {riderData.email}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCopyEmail} sx={{ color: "#4d8eff" }}>
              <ContentCopyIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Customer Info Section */}
          <Box>
            <Typography
              sx={{ fontSize: 14, mb: 1.5, color: "rgba(255,255,255,0.85)" }}
            >
              Customer Info
            </Typography>
            <Box className="gap-5 flex flex-col">
              <Box sx={infoBoxStyle}>
                <PhoneIcon
                  sx={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}
                />
                <Typography sx={{ fontSize: 14 }}>
                  {riderData.phone_number || "N/A"}
                </Typography>
              </Box>
              <Box sx={infoBoxStyle}>
                <LocationOnIcon
                  sx={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}
                />
                <Typography sx={{ fontSize: 14 }}>
                  {riderData.address || "No address provided"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Points Section */}
          <Box>
            <Typography
              sx={{ fontSize: 14, mb: 1.5, color: "rgba(255,255,255,0.85)" }}
            >
              Points
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <MetricBox
                value={riderData.loyalty_points || "0"}
                label="Bonus"
                labelColor="#7a92f0"
              />
              <MetricBox value="0" label="Millage" labelColor="#50c878" />{" "}
              {/* Assuming placeholder for Millage if not in API */}
            </Box>
          </Box>

          {/* Ride Overview Section */}
          <Box>
            <Typography
              sx={{ fontSize: 14, mb: 1.5, color: "rgba(255,255,255,0.85)" }}
            >
              Ride overview
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <MetricBox
                value={riderData.total_rides || "0"}
                label="Total Ride"
                labelColor="#7a92f0"
              />
              <MetricBox
                value={riderData.completed_rides || "0"}
                label="Completed"
                labelColor="#50c878"
              />
              <MetricBox
                value={riderData.cancelled_rides || "0"}
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
