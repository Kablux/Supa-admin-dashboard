import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Chip,
  Avatar,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FiUser } from "react-icons/fi";
import { Driver } from "../../types/auth";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDriver: Driver | null;
  onExecuteAction: (
    actionType: "approve" | "reject" | "suspend" | "delete",
  ) => void;
}

const getStatusTheme = (status?: string) => {
  switch (status) {
    case "active":
      return {
        bg: "rgba(46, 125, 50, 0.12)",
        color: "#81C784",
        border: "rgba(129, 199, 132, 0.25)",
      };
    case "pending_verification":
    case "pending":
      return {
        bg: "rgba(255, 171, 0, 0.12)",
        color: "#FFD700",
        border: "rgba(255, 215, 0, 0.25)",
      };
    case "suspended":
      return {
        bg: "rgba(211, 47, 47, 0.12)",
        color: "#E57373",
        border: "rgba(229, 115, 115, 0.25)",
      };
    default:
      return {
        bg: "rgba(255, 255, 255, 0.05)",
        color: "#BDBDBD",
        border: "rgba(255, 255, 255, 0.1)",
      };
  }
};

export default function ActionModal({
  isOpen,
  onClose,
  selectedDriver,
  onExecuteAction,
}: ActionModalProps) {
  if (!selectedDriver) return null;

  const formattedStatus =
    selectedDriver.status?.replace("_", " ").toUpperCase() || "UNKNOWN";
  const theme = getStatusTheme(selectedDriver.status);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      transitionDuration={300}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
          },
        },
      }}
      sx={{
        "& .MuiDialog-paper": {
          background: "#121212",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)",
          color: "#fff",
          borderRadius: "16px",
          maxWidth: 420,
          width: "100%",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
          m: 2,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 3,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#F3F4F6",
          }}
        >
          Manage Driver Account
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.4)",
            transition: "all 0.2s ease",
            "&:hover": {
              color: "#fff",
              background: "rgba(255,255,255,0.08)",
              transform: "rotate(90deg)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content Area */}
      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <FiUser size={28} />
          </Avatar>

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
          >
            {/* Name Block */}
            <Box>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  mb: 0.5,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                Driver Identity
              </Typography>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  lineHeight: 1.2,
                }}
              >
                {selectedDriver.full_name}
              </Typography>
            </Box>

            {/* Status Block */}
            <Box>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  mb: 0.75,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                Current Status
              </Typography>
              <Chip
                label={formattedStatus}
                size="small"
                sx={{
                  background: theme.bg,
                  color: theme.color,
                  border: `1px solid ${theme.border}`,
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  letterSpacing: "0.04em",
                  borderRadius: "6px",
                  height: "24px",
                  px: 0.5,
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          gap: 1.5,
          display: "flex",
          backgroundColor: "rgba(0,0,0,0.15)",
          borderTop: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        {/* Conditional Workflow 1: Status is ACTIVE or SUSPENDED */}
        {(selectedDriver.status === "active" ||
          selectedDriver.status === "suspended") && (
          <>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                py: 1.2,
                fontSize: 13,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                color: "#FFB74D",
                borderColor: "rgba(255, 183, 77, 0.3)",
                "&:hover": {
                  borderColor: "#FFB74D",
                  backgroundColor: "rgba(255, 183, 77, 0.08)",
                },
              }}
              onClick={() => onExecuteAction("suspend")}
            >
              Suspend Account
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 1.2,
                fontSize: 13,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                backgroundColor: "#D32F2F",
                color: "#fff",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#B71C1C",
                  boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
                },
              }}
              onClick={() => onExecuteAction("delete")}
            >
              Delete Account
            </Button>
          </>
        )}

        {/* Conditional Workflow 2: Status is PENDING_VERIFICATION */}
        {selectedDriver.status === "pending_verification" && (
          <>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                py: 1.2,
                fontSize: 13,
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
              onClick={() => onExecuteAction("reject")}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 1.2,
                fontSize: 13,
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
              onClick={() => onExecuteAction("approve")}
            >
              Approve
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
