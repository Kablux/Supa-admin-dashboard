import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CancelIcon from "@mui/icons-material/Cancel";
import KycStatusChip from "./KycStatusChip";
import { CourierRider } from "../../types/common.types";
import AppButton from "../common/AppButton";

interface RiderDetailsModalProps {
  open: boolean;
  rider: CourierRider | null;
  kycApprovingId?: string | null;
  kycRejectingId?: string | null;
  onClose: () => void;
  onApproveKyc: (userId: string) => void;
  onRejectKyc: (rider: CourierRider) => void;
}

export default function RiderDetailsModal({
  open,
  rider,
  kycApprovingId,
  kycRejectingId,
  onClose,
  onApproveKyc,
  onRejectKyc,
}: RiderDetailsModalProps) {
  if (!rider) return null;

  const isVerified = rider.kyc_status === "VERIFIED";

const isEligibleForApproval = [
  "UNDER_REVIEW",
  "NEEDS_RESUBMISSION",
].includes(rider.kyc_status);

  const isEligibleForRejection =
  rider.account_status === "PENDING_APPROVAL" &&
  ["UNDER_REVIEW", "NEEDS_RESUBMISSION"].includes(rider.kyc_status);

  const isApproving = kycApprovingId === rider.id;
  const isRejecting = kycRejectingId === rider.id;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "var(--bg-card, #1A1D26)",
          backgroundImage: "none",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
          borderRadius: "16px",
          color: "var(--text-primary, #FFFFFF)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2.5,
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          backgroundColor: "var(--bg-secondary, #141721)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              backgroundColor: "rgba(254, 185, 20, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon sx={{ color: "var(--accent-gold, #FEB914)", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {rider.first_name} {rider.last_name}
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--text-muted, #8A92A6)" }}>
              ID: {rider.id}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "var(--text-secondary)" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {/* Status Badges Row */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 0.5 }}>
          <KycStatusChip status={rider.kyc_status} />
          <Chip
            label={`Account: ${rider.account_status}`}
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "var(--text-secondary)",
              fontSize: 11,
              fontWeight: 500,
            }}
          />
          <Chip
            label={rider.available_to_receive_order ? "🟢 Online / Available" : "⚪ Offline"}
            size="small"
            sx={{
              backgroundColor: rider.available_to_receive_order
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(255, 255, 255, 0.04)",
              color: rider.available_to_receive_order ? "#34D399" : "var(--text-muted)",
              fontSize: 11,
              fontWeight: 500,
            }}
          />
        </Box>

        {/* Contact & Personal Information */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500 }}>
            Contact &amp; General Information
          </Typography>
          <Box
            sx={{
              backgroundColor: "var(--bg-secondary, #141721)",
              borderRadius: "10px",
              p: 2,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Email Address</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: "break-all" }}>{rider.email || "N/A"}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Phone Number</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{rider.phone_number || "N/A"}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Gender &amp; DOB</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.gender || "N/A"} {rider.date_of_birth ? `(${rider.date_of_birth})` : ""}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>City / State</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {[rider.city, rider.state].filter(Boolean).join(", ") || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Referral Code</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: "monospace" }}>{rider.referral_code || "N/A"}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Date Joined</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.date_joined ? new Date(rider.date_joined).toLocaleDateString() : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Vehicle Information */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}>
            <LocalShippingIcon fontSize="small" /> Vehicle Information
          </Typography>
          <Box
            sx={{
              backgroundColor: "var(--bg-secondary, #141721)",
              borderRadius: "10px",
              p: 2,
              display: "grid",
              gridTemplateColumns: {sm:"repeat(3, 1fr)"},
              gap: 2,
              border: "1px solid var(--border, rgba(255,255,255,0.09))",
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Vehicle Type</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, textTransform: "capitalize" }}>
                {rider.vehicle_type || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Brand / Make</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.vehicle_brand || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Registration Number</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: "monospace" }}>
                {rider.vehicle_registration_number || "No plate number"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* KYC Documents & Uploads */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}>
            <DescriptionIcon fontSize="small" /> KYC Documents &amp; Media
          </Typography>
          <Box
            sx={{
              backgroundColor: "var(--bg-secondary, #141721)",
              borderRadius: "10px",
              p: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            {rider.rider_permit_url && (
              <Button
                variant="outlined"
                size="small"
                component="a"
                href={rider.rider_permit_url}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon fontSize="small" />}
                sx={{ textTransform: "none", color: "var(--text-primary)", borderColor: "var(--border, rgba(255,255,255,0.09))" }}
              >
                Rider Permit
              </Button>
            )}

            {rider.government_id_front_url && (
              <Button
                variant="outlined"
                size="small"
                component="a"
                href={rider.government_id_front_url}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon fontSize="small" />}
                sx={{ textTransform: "none", color: "var(--text-primary)", borderColor: "var(--border, rgba(255,255,255,0.09))" }}
              >
                Government ID
              </Button>
            )}

            {rider.vehicle_picture_url && (
              <Button
                variant="outlined"
                size="small"
                component="a"
                href={rider.vehicle_picture_url}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon fontSize="small" />}
                sx={{ textTransform: "none", color: "var(--text-primary)", borderColor: "var(--border, rgba(255,255,255,0.09))" }}
              >
                Vehicle Picture
              </Button>
            )}

            {!rider.rider_permit_url && !rider.government_id_front_url && !rider.vehicle_picture_url && (
              <Typography variant="body2" sx={{ color: "var(--text-muted)" }}>
                No document URLs available.
              </Typography>
            )}
          </Box>
        </Box>

        {/* Guarantors & Next of Kin */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon fontSize="small" /> Guarantors &amp; Next of Kin
          </Typography>
          <Box
            sx={{
              backgroundColor: "var(--bg-secondary, #141721)",
              borderRadius: "10px",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Next of Kin</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {rider.next_of_kin_full_name || "N/A"} ({rider.next_of_kin_phone_number || "No Phone"})
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "var(--border)" }} />

            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)", display: "block", mb: 1 }}>
                Registered Guarantors ({rider.guarantors?.length || 0})
              </Typography>
              {rider.guarantors && rider.guarantors.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {rider.guarantors.map((g) => (
                    <Box key={g.slot} sx={{ display: "flex", justifyContent: "space-between",flexWrap:"wrap", alignItems: "center", backgroundColor: "rgba(255,255,255,0.02)", p: 1, borderRadius: "6px" }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Slot {g.slot}: {g.full_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>
                          {g.phone_number}
                        </Typography>
                      </Box>
                      <Chip label={g.status} size="small" sx={{ fontSize: 10, height: 20 }} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "var(--text-muted)" }}>No guarantors listed.</Typography>
              )}
            </Box>

            <Box sx={{ mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Work Experience</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.previous_place_of_work ? `${rider.previous_place_of_work} (${rider.years_worked || "Duration N/A"})` : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Compliance Notes */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500 }}>
            Compliance Notes
          </Typography>
          <Box
            sx={{
              backgroundColor: "var(--bg-secondary, #141721)",
              borderRadius: "10px",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <Box sx={{ display: "flex",gap:1,fleWrap:"wrap", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Submitted At</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.kyc_submitted_at ? new Date(rider.kyc_submitted_at).toLocaleString() : "Not submitted"}
              </Typography>
            </Box>
            {rider.kyc_rejection_reason && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#EF4444" }}>Rejection Reason</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#EF4444" }}>
                  {rider.kyc_rejection_reason}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      {/* Modal Footer Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: "var(--bg-secondary, #141721)",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >

        <Box sx={{ display: "flex",justifyContent:"center", alignItems:"center", gap: 1.5, width: "100%" }}>
        <Box>
          {isEligibleForRejection && (
            <AppButton
              variant="outlined"
              size="small"
              disabled={isRejecting}
              startIcon={isRejecting ? <CircularProgress size={13} color="inherit" /> : <CancelIcon />}
              onClick={() => onRejectKyc(rider)}
              sx={{
                color: "#EF4444",
                border: "2px solid rgba(239, 68, 68, 0.3)",
                backgroundColor: "transparent",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
              }}
            >
              {isRejecting ? "Rejecting..." : "Reject KYC"}
            </AppButton>
          )}
        </Box>
         

      {isEligibleForApproval && (
              <AppButton
                variant="contained"
                size="small"
                disabled={isApproving}
                startIcon={
                  isApproving ? (
                    <CircularProgress size={13} color="inherit" />
                  ) : (
                    <VerifiedUserIcon />
                  )
                }
                onClick={() => onApproveKyc(rider.id)}
                sx={{
                  backgroundColor: "#FFBE18",
                  color: "#17130A",
                  border: "2px solid var(--border, rgba(255, 255, 255, 0.08))",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#F4B400",
                  },
                }}
              >
                {isApproving ? "Approving..." : "Approve KYC"}
              </AppButton>
            )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}