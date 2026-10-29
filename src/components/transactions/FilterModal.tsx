import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { TransactionFilterState } from "../../types/common.types";

interface TransactionsFilterModalProps {
  open: boolean;
  filters: TransactionFilterState;
  onClose: () => void;
  onApplyFilters: (newFilters: TransactionFilterState) => void;
  onResetFilters: () => void;
}

const selectSx = {
  color: "var(--text-primary)",
  backgroundColor: "var(--bg-card)",
  fontSize: 14,
  borderRadius: "8px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--accent-gold-dim)" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--accent-gold, #FEB914)" },
  "& .MuiSvgIcon-root": { color: "var(--text-secondary)" },
};

const labelSx = {
  color: "var(--text-secondary)",
  fontSize: 14,
  "&.Mui-focused": { color: "var(--accent-gold, #FEB914)" },
};

const dateFieldSx = {
  "& .MuiInputBase-root": {
    color: "var(--text-primary)",
    fontSize: 14,
    backgroundColor: "var(--bg-card)",
    borderRadius: "8px",
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--accent-gold-dim)" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--accent-gold, #FEB914)" },
};

export default function TransactionsFilterModal({
  open,
  filters,
  onClose,
  onApplyFilters,
  onResetFilters,
}: TransactionsFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<TransactionFilterState>(filters);

  const handleChange = (field: keyof TransactionFilterState, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onResetFilters();
    onClose();
  };

  return (
        <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "var(--bg-card, #11141D)",
                color: "var(--text-primary)",
                backgroundImage: "none",
              },
            },
          }}
        >
      <Box
        sx={{
          width: 360,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Advanced Filters
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "var(--text-secondary)" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />

        {/* Drawer Body (Scrollable) */}
        <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
          <Stack spacing={3}>
            {/* Status Filter */}
            <FormControl fullWidth size="small">
              <InputLabel sx={labelSx}>Status</InputLabel>
              <Select
                value={localFilters.status || ""}
                label="Status"
                onChange={(e) => handleChange("status", e.target.value)}
                sx={selectSx}
              >
                <MenuItem value=""><em>All Statuses</em></MenuItem>
                <MenuItem value="success">Successful</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>

            {/* Direction Filter */}
            <FormControl fullWidth size="small">
              <InputLabel sx={labelSx}>Direction</InputLabel>
              <Select
                value={localFilters.direction || ""}
                label="Direction"
                onChange={(e) => handleChange("direction", e.target.value)}
                sx={selectSx}
              >
                <MenuItem value=""><em>All Directions</em></MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
                <MenuItem value="debit">Debit</MenuItem>
              </Select>
            </FormControl>

            {/* Type Filter */}
            <FormControl fullWidth size="small">
              <InputLabel sx={labelSx}>Type</InputLabel>
              <Select
                value={localFilters.type || ""}
                label="Type"
                onChange={(e) => handleChange("type", e.target.value)}
                sx={selectSx}
              >
                <MenuItem value=""><em>All Types</em></MenuItem>
                <MenuItem value="topup">Top Up</MenuItem>
                <MenuItem value="withdrawal_fee">Withdrawal Fee</MenuItem>
                <MenuItem value="platform_fee">Platform Fee</MenuItem>
                <MenuItem value="admin_adjustment">Admin Adjustment</MenuItem>
                <MenuItem value="refund">Refund</MenuItem>
                <MenuItem value="payout">Payout</MenuItem>
                <MenuItem value="bonus">Bonus</MenuItem>
                <MenuItem value="ride_payment">Ride Payment</MenuItem>
              </Select>
            </FormControl>

            {/* Fund Source Filter */}
            {/* <FormControl fullWidth size="small">
              <InputLabel sx={labelSx}>Fund Source</InputLabel>
              <Select
                value={localFilters.fund_source || ""}
                label="Fund Source"
                onChange={(e) => handleChange("fund_source", e.target.value)}
                sx={selectSx}
              >
                <MenuItem value=""><em>All Sources</em></MenuItem>
                <MenuItem value="real">Real</MenuItem>
                <MenuItem value="dummy">Dummy</MenuItem>
              </Select>
            </FormControl> */}

            {/* User Role Filter */}
            <FormControl fullWidth size="small">
              <InputLabel sx={labelSx}>User Role</InputLabel>
              <Select
                value={localFilters.user_role || ""}
                label="User Role"
                onChange={(e) => handleChange("user_role", e.target.value)}
                sx={selectSx}
              >
                <MenuItem value=""><em>All Roles</em></MenuItem>
                <MenuItem value="rider">Rider</MenuItem>
                <MenuItem value="driver">Driver</MenuItem>
              </Select>
            </FormControl>

            {/* Channel Filter */}
                <FormControl fullWidth size="small">
                  <InputLabel sx={labelSx}>Channel</InputLabel>
                  <Select
                    value={localFilters.channel || ""}
                    label="Channel"
                    onChange={(e) => handleChange("channel", e.target.value)}
                    sx={selectSx}
                  >
                    <MenuItem value="">
                      <em>All Channels</em>
                    </MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="wallet">Wallet</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>

            {/* Created date range */}
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)", mb: 2, display: "block" }}>
                Created Date Range
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  type="date"
                  size="small"
                  label="From"
                  slotProps={{
                    inputLabel: { shrink: true, sx: labelSx },
                  }}
                  value={localFilters.created_at_after || ""}
                  onChange={(e) => handleChange("created_at_after", e.target.value)}
                  sx={dateFieldSx}
                  fullWidth
                />
                <TextField
                  type="date"
                  size="small"
                  label="To"
                  slotProps={{
                    inputLabel: { shrink: true, sx: labelSx },
                  }}
                  value={localFilters.created_at_before || ""}
                  onChange={(e) => handleChange("created_at_before", e.target.value)}
                  sx={dateFieldSx}
                  fullWidth
                />
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Drawer Footer (Sticky Actions) */}
        <Box
          sx={{
            p: 2.5,
            borderTop: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.08)",
            display: "flex",
            gap: 2,
            backgroundColor: "var(--bg-card, #11141D)",
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            sx={{
              py: 1,
              borderRadius: "10px",
              borderColor: "rgba(255, 255, 255, 0.12)",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              fontSize: 13.5,
              fontWeight: 500,
              color: "var(--text-primary)",
              textTransform: "none",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.25)" },
            }}
          >
            Reset
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApply}
            sx={{
              py: 1,
              borderRadius: "10px",
              backgroundColor: "var(--accent-gold, #FEB914)",
              color: "#17130A",
              fontSize: 13.5,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#F4B400", boxShadow: "none" },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}