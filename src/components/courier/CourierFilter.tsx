import React from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

interface CourierFiltersProps {
  accountStatus: string;
  kycStatus: string;
  vehicleType: string;

  activeTab: "riders" | "users" | "referrals";

  onAccountStatusChange: (value: string) => void;
  onKycStatusChange: (value: string) => void;
  onVehicleTypeChange: (value: string) => void;
}

const selectSx = {
  fontSize: 14,
  borderRadius: "8px",
  backgroundColor: "var(--bg-secondary)",
  color: "var(--text-secondary)",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--border)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--accent-gold)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--accent-gold)",
    borderWidth: "1px",
  },
  "& .MuiSelect-icon": {
    color: "var(--text-muted)",
  },
} as const;

const CourierFilters: React.FC<CourierFiltersProps> = ({
  accountStatus,
  kycStatus,
  vehicleType,
  activeTab,
  onAccountStatusChange,
  onKycStatusChange,
  onVehicleTypeChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
        }}
      >
        {/* Account Status Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={accountStatus}
            displayEmpty
            onChange={(e) => onAccountStatusChange(e.target.value as string)}
            sx={selectSx}
          >
            <MenuItem value="" sx={{ fontSize: 14 }}>
              All Statuses
            </MenuItem>
            <MenuItem value="ACTIVE" sx={{ fontSize: 14 }}>
              Active
            </MenuItem>
            <MenuItem value="PENDING_APPROVAL" sx={{ fontSize: 14 }}>
              Pending Approval
            </MenuItem>
            <MenuItem value="SUSPENDED" sx={{ fontSize: 14 }}>
              Suspended
            </MenuItem>
          </Select>
        </FormControl>

        {activeTab === "riders" && (
          <>
            {/* KYC Status Filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={kycStatus}
                displayEmpty
                onChange={(e) => onKycStatusChange(e.target.value as string)}
                sx={selectSx}
              >
                <MenuItem value="" sx={{ fontSize: 14 }}>
                  All KYC
                </MenuItem>
                <MenuItem value="UNDER_REVIEW" sx={{ fontSize: 14 }}>
                  Under Review
                </MenuItem>
                <MenuItem value="NEEDS_RESUBMISSION" sx={{ fontSize: 14 }}>
                  Needs Resubmission
                </MenuItem>
                <MenuItem value="APPROVED" sx={{ fontSize: 14 }}>
                  Approved
                </MenuItem>
                <MenuItem value="REJECTED" sx={{ fontSize: 14 }}>
                  Rejected
                </MenuItem>
              </Select>
            </FormControl>

            {/* Vehicle Type Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={vehicleType}
                displayEmpty
                onChange={(e) => onVehicleTypeChange(e.target.value as string)}
                sx={selectSx}
              >
                <MenuItem value="" sx={{ fontSize: 14 }}>
                  All Vehicles
                </MenuItem>
                <MenuItem value="BICYCLE" sx={{ fontSize: 14 }}>
                  Bicycle
                </MenuItem>
                <MenuItem value="MOTORCYCLE" sx={{ fontSize: 14 }}>
                  Motorcycle
                </MenuItem>
                <MenuItem value="CAR" sx={{ fontSize: 14 }}>
                  Car
                </MenuItem>
                <MenuItem value="VAN" sx={{ fontSize: 14 }}>
                  Van
                </MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CourierFilters;