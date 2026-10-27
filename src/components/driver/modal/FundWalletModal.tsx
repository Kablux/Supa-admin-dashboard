import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import toast from "react-hot-toast";
import { fundDriverWallets } from "../../../api/xhr";

interface FundWalletModalProps {
  open: boolean;
  driverIds: string[];
  driverNames?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FundWalletModal({
  open,
  driverIds,
  driverNames,
  onClose,
  onSuccess,
}: FundWalletModalProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return;
    setAmount("");
    setNote("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid funding amount");
      return;
    }

    try {
      setLoading(true);
      const res = await fundDriverWallets({
        driver_ids: driverIds,
        amount: amount.trim(),
        note: note.trim(),
      });

      toast.success(
        res?.message || `Successfully funded ${driverIds.length} driver wallet(s)!`
      );
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to fund driver wallet(s)"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              backgroundColor: "rgba(254, 185, 20, 0.12)",
              color: "var(--accent-gold, #FEB914)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18 }}>
            Fund Driver Wallet
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: "var(--text-secondary)" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: "var(--text-secondary, #8A92A6)",
            fontSize: 13,
            mb: 2.5,
          }}
        >
          Crediting{" "}
          <Typography component="span" sx={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {driverIds.length > 1
              ? `${driverIds.length} selected drivers`
              : driverNames || "this driver"}
          </Typography>
          . Funds will be deposited instantly as an admin credit adjustment.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Amount *"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
            slotProps={{
              input: {
                sx: {
                  color: "var(--text-primary)",
                  fontSize: 13.5,
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                },
              },
              inputLabel: {
                sx: {
                  color: "var(--text-secondary)",
                  fontSize: 13,
                },
              },
              htmlInput: {
                min: 0.01,
                step: "any",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.24)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #FEB914)" },
              },
            }}
          />

          <TextField
            label="Note"
            multiline
            rows={2}
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Promotional bonus or offline cash settlement"
            slotProps={{
              input: {
                sx: {
                  color: "var(--text-primary)",
                  fontSize: 13.5,
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                },
              },
              inputLabel: {
                sx: {
                  color: "var(--text-secondary)",
                  fontSize: 13,
                },
              },
              htmlInput: {
                min: 0.01,
                step: "any",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.24)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #FEB914)" },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1,
            borderRadius: "8px",
            border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-primary)",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          Cancel
        </IconButton>
        <IconButton
          onClick={handleSubmit}
          disabled={loading || !amount}
          sx={{
            flex: 1,
            py: 1,
            borderRadius: "8px",
            backgroundColor: "var(--accent-gold, #FEB914)",
            color: "#17130A",
            fontSize: 14,
            fontWeight: 700,
            "&:hover": { backgroundColor: "#F4B400" },
            "&.Mui-disabled": { backgroundColor: "rgba(254, 185, 20, 0.3)", color: "rgba(23, 19, 10, 0.5)" },
          }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : "Fund Wallet"}
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}