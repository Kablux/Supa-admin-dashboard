import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

interface UnsuspendRiderModalProps {
  open: boolean;
  riderName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function UnsuspendRiderModal({
  open,
  riderName,
  loading = false,
  onClose,
  onConfirm,
}: UnsuspendRiderModalProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontSize: 18, fontWeight: 600 }}>
        Unsuspend rider
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ fontSize: 14, color: "secondary.main" }}>
          {riderName ? <strong>{riderName}</strong> : "This rider"}'s account
          will be restored to active and they'll be able to use the rider app
          again.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
        >
          {loading ? "Unsuspending..." : "Unsuspend"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}