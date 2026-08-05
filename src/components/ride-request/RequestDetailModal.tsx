import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  CircularProgress,
  IconButton,
  Typography,
  Chip,
  Divider,
  Stack,
  Avatar,
  Grid,
  Collapse,
} from "@mui/material";

import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RouteIcon from "@mui/icons-material/Route";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { MdExpandMore } from "react-icons/md";

import { useAppDispatch } from "../../redux/hooks"; // Assuming standard Redux setup
import { fetchRideRequestDetails } from "../../api/xhrHelper";
import { RideRequestDetail, RideDispatch } from "../../types/common.types";

interface RequestDetailModalProps {
  rideRequestId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper for Status Colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "matched":
    case "accepted":
    case "completed":
      return "success";
    case "pending":
    case "searching":
      return "warning";
    case "cancelled":
    case "expired":
    case "rejected":
    case "timeout":
      return "error";
    default:
      return "default";
  }
};

// Reusable Metric Component
const DetailMetric = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
    <Box sx={{ color: "text.secondary", mt: 0.5 }}>{icon}</Box>
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontSize: 10,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{fontSize:12, fontWeight: 500 }} color="text.primary">
        {value || "N/A"}
      </Typography>
    </Box>
  </Box>
);

export default function RequestDetailModal({
  rideRequestId,
  isOpen,
  onClose,
}: RequestDetailModalProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RideRequestDetail | null>(null);
  const [showDispatchHistory, setShowDispatchHistory] = useState(false);

  useEffect(() => {
    if (isOpen && rideRequestId) {
      setLoading(true);
      dispatch(fetchRideRequestDetails(rideRequestId) as any)
        .unwrap()
        .then((res: RideRequestDetail) => {
          setData(res);
        })
        .catch((err: any) => {
          console.error("Failed to fetch ride details:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setData(null);
    }
  }, [isOpen, rideRequestId, dispatch]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card)",
          color: "text.primary",
          borderRadius: "16px",
          maxWidth: 684,
          width: "100%",
          border: "1px solid var(--border, rgba(255,255,255,0.1))",
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          m: 2,
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          color: "text.secondary",
          bgcolor: "rgba(255,255,255,0.05)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {loading || !data ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "var(--accent-gold, #D4AF37)" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {/* HEADER: Rider & Status */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                  {data.rider.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography  sx={{ fontWeight: 600 }}>
                    {data.rider}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{textTransform:"capitalize"}}>
                    {`${data.type}`} Ride •{" "}
                    {formatDate(data.created_at)}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={data.status}
                color={getStatusColor(data.status)}
                size="small"
                sx={{ textTransform: "capitalize", fontWeight: 600 }}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: "var(--border)" }} />

          {/* ROUTE: Pickup & Dropoff */}
          <Box sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Box sx={{ display: "flex", gap: 2, position: "relative" }}>
                {/* Visual Timeline Line */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 11,
                    top: 24,
                    bottom: -8,
                    width: "2px",
                    bgcolor: "rgba(255,255,255,0.1)",
                  }}
                />
                <MyLocationIcon
                  sx={{ color: "info.main", fontSize: 20, zIndex: 1 }}
                />
                <Box>
                  <Typography
                    // variant="caption"
                    sx={{
                      display: "block",
                      color: "secondary.main",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    PICKUP
                  </Typography>
                  <Typography sx={{ fontSize: 12, }} color="text.primary">
                    {data.pickup_address || "Address not provided"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <LocationOnIcon
                  sx={{ color: "error.main", fontSize: 20, zIndex: 1 }}
                />
                <Box>
                  <Typography
                    sx={{
                     display: "block",
                      color: "secondary.main",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    DROPOFF
                  </Typography>
                  <Typography sx={{ fontSize: 12, }} color="text.primary">
                    {data.dropoff_address || "Address not provided"}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
          {/* METRICS GRID */}

          <Box sx={{ p: 3, borderTop: "1px solid var(--border)" }}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DetailMetric
                icon={<PaymentsIcon fontSize="small" />}
                label="Est. Fare"
                value={
                  data.estimated_fare !== "-" && data.estimated_fare
                    ? `₦${Number(data.estimated_fare).toLocaleString()}`
                    : "N/A"
                }
              />

              <DetailMetric
                icon={<LocalOfferIcon fontSize="small" />}
                label="Rider Offer"
                value={
                  data.rider_offer !== "-" && data.rider_offer
                    ? `₦${Number(data.rider_offer).toLocaleString()}`
                    : "No offer"
                }
              />

              {/* NEW: Promotional Discount Check */}
              {data.is_eligible_for_promotion &&
                data.promotional_discount_amount && (
                  <DetailMetric
                    icon={
                      <MoneyOffIcon
                        fontSize="small"
                        sx={{ color: "success.main" }}
                      />
                    }
                    label="Promo Discount"
                    value={
                      <Typography
                        component="span"
                        sx={{ color: "success.main",fontSize:12, fontWeight: 600 }}
                      >
                        -₦
                        {Number(
                          data.promotional_discount_amount,
                        ).toLocaleString()}
                      </Typography>
                    }
                  />
                )}

              <DetailMetric
                icon={<RouteIcon fontSize="small" />}
                label="Est. Distance"
                value={
                  data.estimated_distance
                    ? `${data.estimated_distance} km`
                    : "N/A"
                }
              />

              <DetailMetric
                icon={<AccessTimeIcon fontSize="small" />}
                label="Est. Duration"
                value={
                  data.estimated_duration
                    ? `${data.estimated_duration } mins`
                    : "N/A"
                }
              />

              {/* UPDATED: Scheduled For Check (Handling Null Dates gracefully) */}
              {data.is_scheduled && (
                <DetailMetric
                  icon={<EventAvailableIcon fontSize="small" color="primary" />}
                  label="Scheduled For"
                  value={
                    data.schedule_date && data.schedule_time
                      ? `${data.schedule_date} at ${data.schedule_time}`
                      : data.schedule_date
                        ? data.schedule_date
                        : data.schedule_time
                          ? data.schedule_time
                          : "Date/Time Pending"
                  }
                />
              )}
            </div>
          </Box>

          <Divider sx={{ border: "var(--border)" }} />

          {/* DISPATCH HISTORY (Only show if there are dispatches) */}
          {data.dispatches && data.dispatches.length > 0 && (
            <>
              <Divider sx={{ borderColor: "var(--border)" }} />

              <Box sx={{ px: 3, py: 1.5 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: data.dispatches.length > 1 ? "pointer" : "default",
                    mb: 2,
                  }}
                  onClick={() => {
                    if (data.dispatches.length > 1) {
                      setShowDispatchHistory((prev) => !prev);
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "text.secondary",
                      letterSpacing: 0.5,
                    }}
                  >
                    Dispatch History ({data.dispatches.length})
                  </Typography>

                  {data.dispatches.length > 1 && (
                    <MdExpandMore
                      size={20}
                      style={{
                        transform: showDispatchHistory
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform .25s ease",
                      }}
                    />
                  )}
                </Box>

                <Collapse
                  in={data.dispatches.length === 1 || showDispatchHistory}
                  timeout={250}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,

                      maxHeight: 215,
                      overflowY: "auto",

                      pr: 1,

                      "&::-webkit-scrollbar": {
                        width: 6,
                      },

                      "&::-webkit-scrollbar-thumb": {
                        background: "rgba(255,255,255,.15)",
                        borderRadius: 10,
                      },

                      "&::-webkit-scrollbar-track": {
                        background: "transparent",
                      },
                    }}
                  >
                    {data.dispatches.map((dispatchItem: RideDispatch) => (
                      <Box
                        key={dispatchItem.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",

                          p: 1.75,

                          borderRadius: "10px",

                          background:
                            "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))",

                          border: "1px solid #a4a4a4",

                          transition: ".2s",

                          "&:hover": {
                            borderColor: "rgba(255,193,7,.3)",
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
                          },
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            {dispatchItem.driver || "Unknown Driver"}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.5,
                              fontSize: 12,
                              color: "text.secondary",
                            }}
                          >
                            {formatDate(dispatchItem.dispatched_at)}
                          </Typography>

                          {dispatchItem.distance_to_pickup && (
                            <Typography
                              sx={{
                                mt: 0.5,
                                fontSize: 11,
                                color: "#8b9cff",
                              }}
                            >
                              {dispatchItem.distance_to_pickup} km to pickup
                            </Typography>
                          )}
                        </Box>

                        <Chip
                          label={dispatchItem.status}
                          size="small"
                          color={getStatusColor(dispatchItem.status)}
                          variant="outlined"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            </>
          )}

          {/* CANCELLATION INFO (If applicable) */}
          {data.status === "cancelled" && (
            <Box sx={{ p: 3, pt: 1 , borderTop: "1px solid var(--border)"}}>
              <Typography
                sx={{ display: "block", mb: 0.5, opacity: 0.8, fontSize: 12, textTransform: "capitalize" }}
              >
                Cancelled by the {data.cancelled_by || "Unknown"} at {formatDate(data.cancelled_at)}
              </Typography>
              <Typography sx={{ display: "block", mb: 0.5, fontSize: 12, textTransform: "capitalize" }}>
                <b>Cancellation Reason:</b> "{data.cancellation_reason || "Unknown reason"}"
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Dialog>
  );
}
