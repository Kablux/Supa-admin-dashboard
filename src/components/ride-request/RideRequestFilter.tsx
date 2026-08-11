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
  SelectChangeEvent,
  MenuItem,
  TextField,
  Stack,
  Divider,
  Badge,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";


export interface RideRequestFilterState {
  type: string;
  payment_method: string;
  period?: "today" | "yesterday" | "this_week" | "this_month" | "";
   created_at_after?: string;
  created_at_before?: string;
  is_scheduled: string;
  is_expired: string;
  dispatch_status: string;
  rider: string;
  driver: string;
}

export const initialFilterState: RideRequestFilterState = {
  type: "",
  payment_method: "",
  period: "",
  created_at_after:"",
  created_at_before:"",
  is_scheduled: "",
  is_expired: "",
  dispatch_status: "",
  rider: "",
  driver: "",
};

interface RideRequestFiltersProps {
  filters: RideRequestFilterState;
  onChange: (filters: RideRequestFilterState) => void;
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

export default function RideRequestFilters({
  filters,
  onChange,
}: RideRequestFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<RideRequestFilterState>(filters);

  const activeCount = Object.values(filters).filter((val) => val !== "").length;

  const handleOpen = () => {
    setTempFilters(filters); 
    setIsOpen(true);
  };
git 
  const handleClose = () => setIsOpen(false);

  const handleChange =
    (field: keyof RideRequestFilterState) =>
    (
      e: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setTempFilters((prev) => ({ ...prev, [field]: e.target.value as string }));
    };

 const handlePeriodChange = (e: { target: { value: string } }) =>
    setTempFilters((prev) => ({
      ...prev,
      period: e.target.value as RideRequestFilterState["period"],
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
    setTempFilters(initialFilterState);
    onChange(initialFilterState);
    handleClose();
  };

  return (
    <>
      {/* Trigger Button */}
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
      <Drawer anchor="right" open={isOpen} onClose={handleClose}>
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
            <Typography variant="h6" sx={{fontWeight:600}}>
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
                <InputLabel>Dispatch Status</InputLabel>
                <Select
                  value={tempFilters.dispatch_status}
                  label="Dispatch Status"
                  onChange={handleChange("dispatch_status")}
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="sent">Sent</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="timeout">Timeout</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Ride Type</InputLabel>
                <Select
                  value={tempFilters.type}
                  label="Ride Type"
                  onChange={handleChange("type")}
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={tempFilters.payment_method}
                  label="Payment Method"
                  onChange={handleChange("payment_method")}
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="wallet">Wallet</MenuItem>
                </Select>
              </FormControl>

              <Stack direction="row" spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Scheduled</InputLabel>
                  <Select
                    value={tempFilters.is_scheduled}
                    label="Scheduled"
                    onChange={handleChange("is_scheduled")}
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Expired</InputLabel>
                  <Select
                    value={tempFilters.is_expired}
                    label="Expired"
                    onChange={handleChange("is_expired")}
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
                
              </Stack>

              <TextField
                size="small"
                label="Rider ID"
                value={tempFilters.rider}
                onChange={handleChange("rider")}
                placeholder="Search by Rider ID"
                fullWidth
              />

              <TextField
                size="small"
                label="Driver ID"
                value={tempFilters.driver}
                onChange={handleChange("driver")}
                placeholder="Search by Driver ID"
                fullWidth
              />
              
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
                            
                             {/* Created date range */}
                                           <Box>
                                            <Typography
                                              variant="caption"
                                              sx={{ color: "text.secondary", mb: 1, display: "block" }}
                                            >
                                              Created date
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
            <Button fullWidth variant="contained" color="primary" onClick={handleApply}>
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}