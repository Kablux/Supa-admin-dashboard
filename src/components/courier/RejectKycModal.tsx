import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import AppButton from "../common/AppButton";

interface RejectKycConfirmationModalProps {
  open: boolean;
  riderName?: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const RejectKycConfirmationModal: React.FC<
  RejectKycConfirmationModalProps
> = ({ open, riderName, loading, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason || loading) return;

    onConfirm(trimmedReason);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "var(--bg-card, #11141D)",
            backgroundImage: "none",
            border: "1px solid var(--border, rgba(255,255,255,0.08))",
            color: "var(--text-primary, #FFFFFF)",
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
            m: 2,
          },
        },
      }}
    >

      <DialogContent
        sx={{
          px: { xs: 2.5, sm: 3 },
          pt: 5,
          pb: 2,
        }}
      >
        {/* Warning icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            mx: "auto",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "18px",
            color: "#EF4444",
            background:
              "linear-gradient(145deg, rgba(239,68,68,0.16), rgba(239,68,68,0.05))",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <GppBadOutlinedIcon sx={{ fontSize: 24 }} />
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.4px",
            mb: 1,
          }}
        >
          Reject KYC submission?
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            color: "var(--text-secondary, #8A92A6)",
            fontSize: 14,
            lineHeight: 1.8,
            mb: 2.5,
          }}
        >
          You are about to reject the KYC submission for{" "}
          <Box
            component="span"
            sx={{
              color: "var(--text-primary, #FFFFFF)",
              fontWeight: 600,
            }}
          >
            {riderName || "this rider"}
          </Box>
          . Provide a clear reason so the rider knows what needs to be
          corrected before resubmitting their documents.
        </Typography>


        {/* Rejection reason */}
        <Box>
          <Typography
            component="label"
            htmlFor="kyc-rejection-reason"
            sx={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              mb: 1,
              color: "var(--text-primary, #FFFFFF)",
            }}
          >
            Reason for rejection
            <Box component="span" sx={{ color: "#EF4444" }}>
              {" "}*
            </Box>
          </Typography>

          <TextField
            id="kyc-rejection-reason"
            multiline
            minRows={3}
            maxRows={6}
            fullWidth
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain what needs to be corrected..."
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ alignSelf: "flex-start", mt: 1.5 }}
                  >
                    <EditNoteOutlinedIcon
                      sx={{ color: "var(--text-muted, #8A92A6)" }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  alignItems: "flex-start",
                  fontSize: 12,
                  color: "var(--text-primary, #FFFFFF)",
                  backgroundColor: "rgba(255,255,255,0.025)",
                  borderRadius: "8px",
                  border: "1px solid var(--border, rgba(255,255,255,0.08))",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.24)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#EF4444",
                    borderWidth: "1px",
                  },
                  "&.Mui-disabled": {
                    opacity: 0.6,
                  },
                },
              },
            }}
            sx={{
              "& textarea": {
                lineHeight: 1.7,
              },
              "& textarea::placeholder": {
                color: "var(--text-muted, #8A92A6)",
                opacity: 1,
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0.75,
              gap: 1,
            }}
          >
            <Typography
              sx={{
                color: "var(--text-muted, #8A92A6)",
                fontSize: 11,
              }}
            >
              Be specific and constructive.
            </Typography>

            <Typography
              sx={{
                color: "var(--text-muted, #8A92A6)",
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              {reason.length} characters
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3 },
          pb: 3,
          pt: 1,
          gap: 1.5,
          display: "flex",
          "& > *": {
            flex: 1,
            minWidth: 0,
          },
        }}
      >
        <AppButton
          onClick={handleClose}
          disabled={loading}
          fullWidth
          sx={{
            border: "2px solid var(--border, rgba(255,255,255,0.08))",
            backgroundColor: "transparent",
            color: "var(--text-primary, #FFFFFF)",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.08)",
              boxShadow: "none",
            },
          }}
        >
          Cancel
        </AppButton>

        <AppButton
          onClick={handleSubmit}
          disabled={loading || !reason.trim()}
          fullWidth
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <CancelOutlinedIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
                color: "#EF4444",
                border: "2px solid rgba(239, 68, 68, 0.3)",
                backgroundColor: "transparent",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)",boxShadow:"none" },
              }}
        >
          {loading ? "Rejecting..." : "Confirm Rejection"}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default RejectKycConfirmationModal;