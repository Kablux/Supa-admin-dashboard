import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Ride } from "../../types/auth";
import { getTripById } from "../../api/xhr"; // Import the new function
import { MdCancel, MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import KycStatusChip from "../driver/ChipBadge";

const infoBoxStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1.5,
  p: 1.5,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
};

interface RideDetailsModalProps {
  tripId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TripDetailsModal({
  tripId,
  isOpen,
  onClose,
}: RideDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<Ride | null>(null);

  useEffect(() => {
    if (isOpen && tripId) {
      setLoading(true);
      getTripById(tripId)
        .then((data) => setTripData(data))
        .catch((err) => console.error("Failed to fetch trip details", err))
        .finally(() => setLoading(false));
    } else {
      setTripData(null);
    }
  }, [isOpen, tripId]);

  const isPending = tripData?.status === "driver_on_way";
  const isCancelled = tripData?.status === "cancelled";
  const isCompleted = tripData?.status === "completed";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card, #1E1E1E)",
          color: "#fff",
          borderRadius: "18px",
          maxWidth: 579,
          width: "100%",
          p: 3,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "secondary.main",
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {loading || !tripData ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "var(--accent-gold, #FFD700)" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Header section: Overview */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              alignItems: "flex-end",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "var(--accent-gold, #FFD700)",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {tripData.driver?.charAt(0)?.toUpperCase() || "R"}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 500 }}>
                  {tripData.driver || "Unknown Rider"}
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: 14,
                mt: 0.5,
              }}
            >
              <KycStatusChip status={tripData.status} />
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

          {/* Location Details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Trip Route
            </Typography>
            <Box sx={infoBoxStyle}>
              <LocationOnIcon sx={{ color: "#4CAF50", mt: 0.2 }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  Pickup
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  {tripData.pickup_address}
                </Typography>
              </Box>
            </Box>

            <Box sx={infoBoxStyle}>
              <LocationOnIcon sx={{ color: "#F44336", mt: 0.2 }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  Dropoff
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  {tripData.dropoff_address}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box sx={infoBoxStyle}>
              <AccessTimeIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  Start Time
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {tripData.start_time
                    ? new Date(tripData.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box sx={infoBoxStyle}>
              <AccessTimeIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  End Time
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {tripData.end_time
                    ? new Date(tripData.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={infoBoxStyle}>
            <MdOutlineAirlineSeatReclineExtra />
            <Box>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                }}
              >
                Rider
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                {tripData.rider || "Unassigned"}
              </Typography>
            </Box>
          </Box>
          <Box>
            {tripData.status === "cancelled" && (
              <Box
                sx={{
                  border: "1px solid rgba(244,67,54,0.25)",
                  borderRadius: "12px",
                  p: 2,
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                }}
              >
                <MdCancel
                  size={22}
                  color="#F44336"
                  style={{ marginTop: "2px", flexShrink: 0 }}
                />

                <Box className="w-full">
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      mb: 0.5,
                    }}
                  >
                    Cancellation Reason
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                    }}
                  >
                    {tripData.cancellation_reason ||
                      "No cancellation reason was provided."}
                  </Typography>

                  {tripData.cancelled_by && (
                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: 12,
                        textAlign: "right",
                      }}
                    >
                      Cancelled by:{" "}
                      <Box
                        component="span"
                        sx={{
                          textAlign: "right",
                          fontWeight: 500,
                        }}
                      >
                        {tripData.cancelled_by}
                      </Box>
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Box>
          {/* Pricing Highlight */}

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: "4px",
                backgroundColor: "rgba(255, 193, 7, 0.05)",
                // backgroundColor: "rgba(255, 215, 0, 0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 12 }}>Trip Fare</Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  fontSize: 14
                }}
              >
                {tripData.fare ? `₦${tripData.fare}` : "N/A"}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: "4px",
                backgroundColor: "rgba(76, 175, 80, 0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 12 }}>Agreed Fare</Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#4CAF50",
                  fontSize: 14
                }}
              >
                {tripData.agreed_fare ? `₦${tripData.agreed_fare}` : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
