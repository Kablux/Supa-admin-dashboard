import React from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AppButton from "../common/AppButton";

interface ApproveKycConfirmationModalProps {
  open: boolean;
  riderName?: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ApproveKycConfirmationModal: React.FC<
  ApproveKycConfirmationModalProps
> = ({ open, riderName, loading, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "var(--bg-card, #11141D)",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
          borderRadius: "16px",
          color: "var(--text-primary)",
          p: 1,
          backgroundImage: "none",
        },
      }}
    >
      <DialogContent sx={{ textAlign: "center", pt: 3, pb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 190, 24, 0.12)",
            border: "1px solid rgba(255, 190, 24, 0.2)",
            color: "var(--accent-gold, #FFBE18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <VerifiedUserIcon sx={{ fontSize: 24 }} />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: 18,
            color: "var(--text-primary)",
            mb: 1,
          }}
        >
          Approve Rider KYC?
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "var(--text-secondary, #8A92A6)",
            fontSize: 14,
            lineHeight: 1.8,
          }}
        >
          Are you sure you want to approve KYC for{" "}
          <Typography
            component="span"
            variant="body2"
            sx={{ fontWeight: 500, color: "var(--text-primary)" }}
          >
            {riderName || "this rider"}
          </Typography>
          ? This will grant them active fulfillment privileges.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 1.5,
          pb: 2.5,
          px: 2,
        }}
      >
        <AppButton
          onClick={onClose}
          disabled={loading}
          fullWidth
          sx={{
            flex: 1,
            py: 1.1,
            border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            textTransform: "none",
            color: "var(--text-primary)",
            "&:hover": {
              backgroundColor: "transparent",
              boxShadow: "none",
               border: "2px solid var(--border, rgba(255, 255, 255, 0.05))",
            },
          }}
        >
          Cancel
        </AppButton>

        <AppButton
          onClick={onConfirm}
          disabled={loading}
          fullWidth
          startIcon={
            loading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <VerifiedUserIcon sx={{ fontSize: 17 }} />
            )
          }
          sx={{
            flex: 1,
            color: "#17130A",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#F4B400",
              boxShadow: "0 3px 12px rgba(255, 190, 24, 0.15)",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(255, 190, 24, 0.45)",
              color: "#39301A",
            },
          }}
        >
          {loading ? "Approving..." : "Approve KYC"}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveKycConfirmationModal;