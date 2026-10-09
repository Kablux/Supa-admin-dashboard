import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface ConfirmDeleteModalProps {
  open: boolean;
  isDeleting: boolean;
  promoName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  open,
  isDeleting,
  promoName,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "var(--bg-card, #11141D)",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
          borderRadius: "16px",
          color: "#FFF",
          p: 1,
        },
      }}
    >
      <DialogContent sx={{ textAlign: "center", pt: 3, pb: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            color: "#EF4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, color: "var(--text-primary)", mb: 1 }}>
          Delete Promotion?
        </Typography>

        <Typography variant="body2" sx={{ color: "var(--text-secondary, #8A92A6)", lineHeight: 1.5 }}>
          Are you sure you want to delete{" "}
          <Typography component="span" variant="body2" sx={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {promoName ? `"${promoName}"` : "this promotion"}
          </Typography>
          ?<br/> This action cannot be undone. 
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1.5, pb: 2.5, px: 3 }}>
        <Button
          onClick={onClose}
          disabled={isDeleting}
          sx={{
            flex: 1,
            py: 1,
            borderRadius: "8px",
            color: "var(--text-secondary, #8A92A6)",
            border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              color: "var(--text-primary)",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          disabled={isDeleting}
          sx={{
            flex: 1,
            py: 1,
            borderRadius: "8px",
            backgroundColor: "#EF4444",
            color: "#FFF",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#DC2626",
            },
          }}
        >
          {isDeleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}