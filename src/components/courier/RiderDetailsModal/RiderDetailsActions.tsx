import React from "react";
import { DialogActions, Box, CircularProgress, Tooltip } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import AppButton from "../../common/AppButton";
import { CourierRider } from "../../../types/common.types";

const dangerOutlinedSx = {
  color: "#EF4444",
  border: "2px solid rgba(239, 68, 68, 0.3)",
  backgroundColor: "transparent",
  textTransform: "none",
  "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
};

const successOutlinedSx = {
  color: "#34D399",
  border: "2px solid rgba(16, 185, 129, 0.3)",
  backgroundColor: "transparent",
  textTransform: "none",
  "&:hover": { backgroundColor: "rgba(16, 185, 129, 0.1)" },
};

const primarySx = {
  backgroundColor: "#FFBE18",
  color: "#17130A",
  border: "2px solid var(--border, rgba(255, 255, 255, 0.08))",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": { backgroundColor: "#F4B400" },
};

const spinner = <CircularProgress size={13} color="inherit" />;

export interface RiderDetailsActionsProps {
  rider: CourierRider;

  canApproveKyc: boolean;
  canRejectKyc: boolean;
  canSuspend: boolean;
  canUnsuspend: boolean;

  isApproving: boolean;
  isRejecting: boolean;
  isSuspending: boolean;
  isUnsuspending: boolean;

  onApproveKyc: (userId: string) => void;
  onRejectKyc: (rider: CourierRider) => void;
  onSuspend?: (rider: CourierRider) => void;
  onUnsuspend?: (rider: CourierRider) => void;
}

export default function RiderDetailsActions({
  rider,
  canApproveKyc,
  canRejectKyc,
  canSuspend,
  canUnsuspend,
  isApproving,
  isRejecting,
  isSuspending,
  isUnsuspending,
  onApproveKyc,
  onRejectKyc,
  onSuspend,
  onUnsuspend,
}: RiderDetailsActionsProps) {
  return (
    <DialogActions
      sx={{
        px: 3,
        py: 2,
        backgroundColor: "var(--bg-secondary, #141721)",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.5,
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {/* Suspend Account */}
        {canSuspend && (
          <Tooltip
            title={onSuspend ? "" : "Suspend is coming soon"}
            arrow
          >
            <span>
              <AppButton
                variant="outlined"
                size="small"
                disabled={!onSuspend || isSuspending}
                startIcon={isSuspending ? spinner : <BlockIcon />}
                onClick={() => onSuspend?.(rider)}
                sx={{
                  ...dangerOutlinedSx,
                  "&.Mui-disabled": {
                    color: "rgba(239, 68, 68, 0.4)",
                    borderColor: "rgba(239, 68, 68, 0.15)",
                  },
                }}
              >
                {isSuspending ? "Suspending..." : "Suspend Account"}
              </AppButton>
            </span>
          </Tooltip>
        )}

        {/* Unsuspend Account */}
        {canUnsuspend && onUnsuspend && (
          <AppButton
            variant="outlined"
            size="small"
            disabled={isUnsuspending}
            startIcon={isUnsuspending ? spinner : <LockOpenIcon />}
            onClick={() => onUnsuspend(rider)}
            sx={successOutlinedSx}
          >
            {isUnsuspending ? "Unsuspending..." : "Unsuspend Account"}
          </AppButton>
        )}

        {/* Reject KYC */}
        {canRejectKyc && (
          <AppButton
            variant="outlined"
            size="small"
            disabled={isRejecting}
            startIcon={isRejecting ? spinner : <CancelIcon />}
            onClick={() => onRejectKyc(rider)}
            sx={dangerOutlinedSx}
          >
            {isRejecting ? "Rejecting..." : "Reject KYC"}
          </AppButton>
        )}

        {/* Approve KYC */}
        {canApproveKyc && (
          <AppButton
            variant="contained"
            size="small"
            disabled={isApproving}
            startIcon={isApproving ? spinner : <VerifiedUserIcon />}
            onClick={() => onApproveKyc(rider.id)}
            sx={primarySx}
          >
            {isApproving ? "Approving..." : "Approve KYC"}
          </AppButton>
        )}
      </Box>
    </DialogActions>
  );
}