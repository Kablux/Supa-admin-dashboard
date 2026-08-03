import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAppSelector } from "../../redux/hooks";
import { ReferralUser } from "../../types/common.types";

interface ReferralDetailModalProps {
  referralId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

// Reusable row for displaying key-value data
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
      {value || "N/A"}
    </Typography>
  </Box>
);

// Reusable card for user details (used for both Referrer and Referred User)
const UserDetailsCard = ({
  title,
  user,
  icon,
}: {
  title: string;
  user?: ReferralUser;
  icon: React.ReactNode;
}) => {
  if (!user) return null;

  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 2,
        py: 2.5,
        px:1,
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 193, 7, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-gold, #FFC107)",
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{title}</Typography>
      </Box>

      <DetailRow
        label="Full Name"
        value={`${user.first_name} ${user.last_name}`}
      />
      <DetailRow label="Email" value={user.email} />
      <DetailRow label="Phone" value={user.phone_number} />
      <DetailRow
        label="User ID"
        value={
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            {user.id}
          </Typography>
        }
      />

      <Box sx={{ my: 2 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
      </Box>

      <DetailRow
        label="Role"
        value={
          <Typography sx={{ textTransform: "capitalize", fontSize: 14 }}>
            {user.role}
          </Typography>
        }
      />
      <DetailRow label="Referral Code" value={user.referral_code} />
      <DetailRow
        label="Account Status"
        value={
          <Chip
            label={user.status}
            size="small"
            sx={{
              textTransform: "capitalize",
              height: 20,
              fontSize: 12,
              bgcolor:
                user.status === "active"
                  ? "rgba(76, 175, 80, 0.1)"
                  : "rgba(255,255,255,0.1)",
              color: user.status === "active" ? "#4CAF50" : "text.secondary",
            }}
          />
        }
      />
    </Box>
  );
};

export default function ReferralDetailModal({
  referralId,
  isOpen,
  onClose,
}: ReferralDetailModalProps) {
  // Grab the specific referral directly from the Redux store
  const referral = useAppSelector((state) =>
    state.referrals.referrals.find((r) => r.id === referralId),
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
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
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>Referral Details</Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {!referral ? (
          <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
            <Typography>Referral details not found.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Meta Information */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: { xs: 2, md: 4 },
                p: 2,
                bgcolor: "rgba(0,0,0,0.2)",
                borderRadius: 1,
              }}
            >
              <Box>
                <Typography
                  sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}
                >
                  Referral Context
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {referral.role}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}
                >
                  Created At
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {formatDate(referral.created_at)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}
                >
                  Last Updated
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {formatDate(referral.updated_at)}
                </Typography>
              </Box>
            </Box>

            <Box>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <UserDetailsCard
                  title="Referrer (Sent the code)"
                  user={referral.user}
                  icon={<PersonIcon />}
                />

                <UserDetailsCard
                  title="Referred User (Used the code)"
                  user={referral.referred_user}
                  icon={<PersonAddIcon />}
                />
              </div>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
