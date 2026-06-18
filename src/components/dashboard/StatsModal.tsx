import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface StatSummaryModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  value: string | number;
  description: string;
  details?: {
    label: string;
    value: string | number;
  }[];
}

export default function StatSummaryModal({
  open,
  onClose,
  title,
  value,
  description,
  details = [],
}: StatSummaryModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
          },
        },
        paper: {
          sx: {
            background:
              "linear-gradient(180deg, rgba(25,25,25,0.98) 0%, rgba(16,16,16,0.98) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
            color: "var(--text-primary)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "var(--text-muted)",
              mt: 0.5,
            }}
          >
            Statistics Overview
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: "var(--text-muted)",
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.08)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Main Value */}
        <Box sx={{ mb: 3 }}>

          <Typography
            sx={{
              color: "var(--text-muted)",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        </Box>

        {details.length > 0 && (
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            {details.map((item, index) => (
              <Box key={item.label}>
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "var(--text-primary)",
                    }}
                  >
                    {item.label}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>

                {index !== details.length - 1 && (
                  <Divider
                    sx={{
                      borderColor: "rgba(255,255,255,0.05)",
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
