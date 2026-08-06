import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Badge,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";


export interface DriverFilterState {
  type?: string;
  is_online?: string; 
  tier?: string;
  period?: "today" | "yesterday" | "this_week" | "this_month" | "";
  created_at_after?: string;
  created_at_before?: string;
  kyc_approval_date_after?: string;
  kyc_approval_date_before?: string;
}

const menuProps = {
  slotProps: {
    paper: {
    sx: {
      backgroundColor: "var(--bg-card, #1E1E1E)",
      backgroundImage: "none",
      border: "1px solid var(--border, rgba(255,255,255,0.1))",
    },
  },
}}

const dateFieldSx = {
  flex: 1,
  "& input::-webkit-calendar-picker-indicator": {
    filter: "invert(0.75)",
    cursor: "pointer",
  },
};

interface DriverFiltersProps {
  value: DriverFilterState;
  onChange: (next: DriverFilterState) => void;
}

export default function DriverFilters({ value, onChange }: DriverFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<DriverFilterState>(value);

  const handleOpen = () => {
    setTempFilters(value); // sync draft with committed state on open
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);

  const handleChange =
    (key: keyof DriverFilterState) =>
    (e: { target: { value: string } }) =>
      setTempFilters((prev) => ({ ...prev, [key]: e.target.value }));


   const handlePeriodChange = (e: { target: { value: string } }) =>
    setTempFilters((prev) => ({
      ...prev,
      period: e.target.value as DriverFilterState["period"],
      created_at_after: "",
      created_at_before: "",
    }));
 
  const handleCreatedChange =
    (key: "created_at_after" | "created_at_before") =>
    (e: { target: { value: string } }) =>
      setTempFilters((prev) => ({ ...prev, [key]: e.target.value, period: "" }));
 
  const handleApply = () => {
    onChange(tempFilters);
    handleClose();
  };
 
  const handleReset = () => {
    const cleared: DriverFilterState = {};
    setTempFilters(cleared);
    onChange(cleared);
    handleClose();
  };

  const activeCount = useMemo(
    () =>
      Object.values(value).filter((v) => v !== undefined && v !== "").length,
    [value],
  );

  return (
    <>
       <Button
        variant="outlined"
        color="inherit"
        startIcon={
          <Badge badgeContent={activeCount} color="error">
            <FilterListIcon />
          </Badge>
        }
        onClick={handleOpen}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          borderColor: "divider",
          color: "text.primary",
          "&:hover": { borderColor: "primary.main", color: "primary.main" },
        }}
      >
        Filters
      </Button>

      {/* Right Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--bg-card, #1E1E1E)",
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
              p: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Advanced Filters
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />

          {/* Drawer Body (Scrollable) */}
          <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
            <Stack spacing={3}>
            
             <FormControl fullWidth size="small">
                <InputLabel>Date</InputLabel>
                <Select
                  value={tempFilters.period ?? ""}
                  label="Period"
                  onChange={handlePeriodChange}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>All time</em>
                  </MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="this_week">This week</MenuItem>
                  <MenuItem value="this_month">This month</MenuItem>
                </Select>
              </FormControl>
              
              
              <FormControl fullWidth size="small">
                <InputLabel>Ride Type</InputLabel>
                <Select
                  value={tempFilters.type ?? ""}
                  label="Ride Type"
                  onChange={handleChange("type")}
                  MenuProps={menuProps}
                >
                  <MenuItem value="All">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Online Status</InputLabel>
                <Select
                  value={tempFilters.is_online ?? ""}
                  label="Online Status"
                  onChange={handleChange("is_online")}
                  MenuProps={menuProps}
                >
                  <MenuItem value="All">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="true">Online</MenuItem>
                  <MenuItem value="false">Offline</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Tier"
                value={tempFilters.tier ?? ""}
                onChange={handleChange("tier")}
                placeholder="Mileage tier"
                fullWidth
              />

              {/* Created date range */}
               <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", mb: 1, display: "block" }}
                >
                  Created date (overrides Period)
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    type="date"
                    size="small"
                    label="From"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={tempFilters.created_at_after ?? ""}
                    onChange={handleCreatedChange("created_at_after")}
                    sx={dateFieldSx}
                  />
                  <TextField
                    type="date"
                    size="small"
                    label="To"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={tempFilters.created_at_before ?? ""}
                    onChange={handleCreatedChange("created_at_before")}
                    sx={dateFieldSx}
                  />
                </Stack>
              </Box>

              {/* KYC approval date range */}
                <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", mb: 1, display: "block" }}
                >
                  KYC approval date
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    type="date"
                    size="small"
                    label="From"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={tempFilters.kyc_approval_date_after ?? ""}
                    onChange={handleChange("kyc_approval_date_after")}
                    sx={dateFieldSx}
                  />
                  <TextField
                    type="date"
                    size="small"
                    label="To"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={tempFilters.kyc_approval_date_before ?? ""}
                    onChange={handleChange("kyc_approval_date_before")}
                    sx={dateFieldSx}
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
              borderColor: "divider",
              display: "flex",
              gap: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}