import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { toast } from "react-toastify";
import { Rider } from "../../types/auth";
import { fetchRiderDetails, verifyRiderEmail } from "../../api/xhr";
import { MetricBox } from "../ModalMetricsBox";

const infoBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  p: 1.5,
  border: "1px solid var(--border)",
  borderRadius: "8px",
};

interface RiderDetailsModalProps {
  riderId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onVerified?: () => void;
}

// Helper to determine chip colors and labels based on status
const getStatusProps = (status: string | undefined) => {
  switch (status) {
    case "active":
      return { label: "Active", color: "success" as const };
    case "pending_verification":
      return { label: "Pending Verification", color: "warning" as const };
    case "suspended":
      return { label: "Suspended", color: "error" as const };
    case "deleted":
      return { label: "Cancelled", color: "default" as const };
    default:
      return { label: status || "Unknown", color: "default" as const };
  }
};

export default function RiderDetailsModal({
  riderId,
  isOpen,
  onClose,
  onVerified,
}: RiderDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [riderData, setRiderData] = useState<Rider | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

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

  const handleCopyEmail = async () => {
    if (!riderData?.email) return;
    await navigator.clipboard.writeText(riderData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyId = async () => {
    if (!riderData?.id) return;
    await navigator.clipboard.writeText(riderData.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleVerifyRider = async () => {
    if (!riderId) return;
    setIsVerifying(true);
    try {
      await verifyRiderEmail(riderId);
      toast.success(
        `${riderData?.full_name || "Rider"} verified successfully`,
      );
      onVerified?.();
      onClose(); 
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to verify rider",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card)",
          color: "var(--text-primary, #fff)",
          borderRadius: "18px",
          maxWidth: 684,
          width: "100%",
          p: 4,
          border: "1px solid var(--border)",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          position: "relative",
          overflow: "hidden",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "secondary.main",
          zIndex: 3,
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Circular loading overlay while verifying */}
      {isVerifying && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
            borderRadius: "18px",
          }}
        >
          <CircularProgress sx={{ color: "var(--accent-gold)" }} />
          <Typography sx={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>
            Verifying rider…
          </Typography>
        </Box>
      )}

      {loading || !riderData ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "var(--accent-gold)" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Header section: Avatar, Basic Info, and Status Options */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
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
                  <StarIcon sx={{ color: "#ffb400", fontSize: 18 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 700, mr: 0.5 }}>
                    {parseFloat(riderData.rating || "0")}
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {riderData.full_name}
                  </Typography>
                </Box>

                {/* Email and Copy Actions */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: 14, color: "secondary.main" }}>
                    {riderData.email}
                  </Typography>
                  <IconButton
                    onClick={handleCopyEmail}
                    size="small"
                    sx={{ color: "#4d8eff" }}
                  >
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  {copied && (
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "success.main",
                      }}
                    >
                      Copied
                    </Typography>
                  )}
                </Box>

                {/* Rider ID */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "monospace",
                    }}
                  >
                    {riderData.id}
                  </Typography>
                  <IconButton
                    onClick={handleCopyId}
                    size="small"
                    sx={{ color: "#4d8eff", p: 0.3 }}
                  >
                    <ContentCopyIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                  {copiedId && (
                    <Typography sx={{ fontSize: 11, color: "success.main" }}>
                      Copied
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Top Right: Status Chip & Actions */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1.5,
                mt: 0.5,
                pr: 2,
              }}
            >
              <Chip
                label={getStatusProps(riderData.status).label}
                color={getStatusProps(riderData.status).color}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, p:2, fontSize: 12 }}
              />
              {riderData.status === "pending_verification" && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleVerifyRider}
                  disabled={isVerifying}
                  startIcon={
                    isVerifying ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <VerifiedUserIcon />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                  }}
                >
                  Verify Rider
                </Button>
              )}
            </Box>
          </Box>

          {/* Customer Info Section */}
          <Box>
            <Typography sx={{ fontSize: 14, mb: 1.5, color: "secondary.main" }}>
              Customer Info
            </Typography>
            <Box className="gap-5 flex flex-col">
              <Box sx={infoBoxStyle}>
                <PhoneIcon sx={{ fontSize: 18, color: "#4caf50" }} />
                <Typography sx={{ fontSize: 14 }}>
                  {riderData.phone_number || "N/A"}
                </Typography>
              </Box>
              <Box sx={infoBoxStyle}>
                <LocationOnIcon sx={{ fontSize: 18, color: "#f44336" }} />
                <Typography sx={{ fontSize: 14 }}>
                  {riderData.address || "No address provided"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Points Section */}
          <Box className="w-1/3">
            <Typography sx={{ fontSize: 14, mb: 1.5, color: "secondary.main" }}>
              Points
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <MetricBox
                value={riderData.loyalty_points || "0"}
                label="Bonus"
                labelColor="#7a92f0"
              />
            </Box>
          </Box>

          {/* Ride Overview Section */}
          <Box>
            <Typography sx={{ fontSize: 14, mb: 1.5, color: "secondary.main" }}>
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