import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,

} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import KycStatusChip from "./KycStatusChip";
import { Rider } from "../../types/common.types";

interface RiderDetailsModalProps {
  open: boolean;
  rider: Rider | null;
  onClose: () => void;
}

export default function RiderDetailsModal({
  open,
  rider,
  onClose,
}: RiderDetailsModalProps) {
  if (!rider) return null;


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
      <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Status Badges Row */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt:1}} >
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
              backgroundColor: rider.available_to_receive_order ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.04)",
              color: rider.available_to_receive_order ? "#34D399" : "var(--text-muted)",
              fontSize: 11,
              fontWeight: 500,
            }}
          />
        </Box>

        {/* Contact & Personal Information */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500 }}>
            Contact & General Information
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
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Rating</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.rating ? `⭐ ${rider.rating.toFixed(1)}` : "No ratings yet"}
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
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>Vehicle Type</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, textTransform: "capitalize" }}>
                {rider.vehicle_type || "N/A"}
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

        {/* KYC & Verification Details */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500 }}>
            KYC & Compliance
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
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
    </Dialog>
  );
}