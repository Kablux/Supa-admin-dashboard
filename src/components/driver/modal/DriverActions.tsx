import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  DialogActions,
} from "@mui/material";
import { Driver } from "../../../types/auth";
import { DriverActionType, getDriverFlags } from "./helpers";

interface Props {
  driver: Driver;
  onDriverAction?: (
    driverId: string,
    actionType: DriverActionType,
    reason?: string,
  ) => void | Promise<void>;
}

export default function DriverActions({ driver, onDriverAction }: Props) {
  const [actionLoading, setActionLoading] = useState<DriverActionType | null>(
    null,
  );
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { isActive, isSuspended, isInReview, isRejected } =
    getDriverFlags(driver);

  const executeAction = async (
    actionType: DriverActionType,
    reason?: string,
  ) => {
    if (!driver?.id || !onDriverAction) return;
    try {
      setActionLoading(actionType);
      await onDriverAction(driver.id, actionType, reason);
    } catch (error) {
      console.error(`Action ${actionType} failed`, error);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isInReview && !isActive && !isRejected) return null;

  return (
    <DialogActions
      sx={{
        p: {sm:3},
        gap: 2,
        backgroundColor: "",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
      }}
    >
      {/* IN_REVIEW: reject flow / approve */}
      {isInReview &&
        (rejectMode ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <TextField
              label="Rejection reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Vehicle documents are blurry or expired"
              multiline
              minRows={2}
              maxRows={5}
              fullWidth
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: 14,
                  color: "var(--text-primary)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                  "&.Mui-focused fieldset": { borderColor: "#E57373" },
                },
                "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#E57373" },
              }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                disabled={!!actionLoading}
                onClick={() => {
                  setRejectMode(false);
                  setRejectReason("");
                }}
                sx={{
                  py: 1.2,
                  fontSize: 14,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  borderColor: "rgba(255,255,255,0.15)",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                disabled={!rejectReason.trim() || !!actionLoading}
                onClick={() => executeAction("reject", rejectReason.trim())}
                sx={{
                  py: 1.2,
                  fontSize: 14,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  backgroundColor: "#E53935",
                  color: "#fff",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#C62828",
                    boxShadow: "0 4px 12px rgba(229,57,53,0.3)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.4)",
                  },
                }}
              >
                {actionLoading === "reject" ? (
                  <CircularProgress size={18} sx={{ color: "#fff" }} />
                ) : (
                  "Confirm Rejection"
                )}
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Button
              variant="outlined"
              fullWidth
              disabled={!!actionLoading}
              sx={{
                py: 1.2,
                fontSize: 14,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                color: "#E57373",
                borderColor: "rgba(229, 115, 115, 0.3)",
                "&:hover": {
                  borderColor: "#E57373",
                  backgroundColor: "rgba(229, 115, 115, 0.08)",
                },
              }}
              onClick={() => setRejectMode(true)}
            >
              Reject Request
            </Button>
            <Button
              variant="contained"
              fullWidth
              disabled={!!actionLoading}
              sx={{
                py: 1.2,
                fontSize: 14,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                backgroundColor: "#2E7D32",
                color: "#fff",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#1B5E20",
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                },
              }}
              onClick={() => executeAction("approve")}
            >
              {actionLoading === "approve" ? (
                <CircularProgress size={18} sx={{ color: "#fff" }} />
              ) : (
                "Accept Request"
              )}
            </Button>
          </>
        ))}

      {/* ACTIVE: earnings + suspend */}
      {isActive && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexWrap:"wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              sx={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.4)",
                textTransform: "uppercase",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              Total Earnings
            </Typography>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1,
              }}
            >
              {driver.total_amount}
            </Typography>
          </Box>

          <Button
            variant="contained"
            disabled={!!actionLoading || isSuspended}
            sx={{
              py: 1.2,
              px: 4,
              fontSize: 14,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              minWidth: 180,
              boxShadow: "none",
              backgroundColor: isSuspended
                ? "rgba(255,255,255,0.12)"
                : "var(--accent-gold, #FFD700)",
              color: isSuspended ? "rgba(255,255,255,0.6)" : "#000",
              "&:hover": {
                backgroundColor: isSuspended
                  ? "rgba(255,255,255,0.12)"
                  : "var(--accent-gold, #FFD700)",
                boxShadow: isSuspended
                  ? "none"
                  : "0 4px 12px rgba(237,108,2,0.2)",
              },
            }}
            onClick={() => {
              if (!isSuspended) executeAction("suspend");
            }}
          >
            {actionLoading === "suspend" ? (
              <CircularProgress size={18} sx={{ color: "#000" }} />
            ) : isSuspended ? (
              "Driver Suspended"
            ) : (
              "Suspend Account"
            )}
          </Button>
        </Box>
      )}

      {/* REJECTED */}
      {isRejected && (
        <Button
          variant="contained"
          fullWidth
          disabled
          sx={{
            py: 1.2,
            fontSize: 14,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            color: "#fff",
            boxShadow: "none",
          }}
          onClick={() => onDriverAction?.(driver.id, "activate")}
        >
          Driver Rejected
        </Button>
      )}
    </DialogActions>
  );
}