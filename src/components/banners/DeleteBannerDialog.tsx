import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Banner } from "../../types/common.types";
import AppButton from "../common/AppButton";


interface DeleteBannerDialogProps {
  banner: Banner | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeleteBannerDialog({
  banner,
  onClose,
  onConfirm,
  loading,
}: DeleteBannerDialogProps): React.ReactElement {
  return (
    <Dialog
      open={Boolean(banner)}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
           
          fontWeight: 700,
          fontSize: 16,
          color: "var(--text-primary)",
          pb: 1,
        }}
      >
        Delete Banner
      </DialogTitle>

      <Divider sx={{ borderColor: "var(--border)" }} />

      <DialogContent sx={{ pt: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            p: 1.5,
            borderRadius: "10px",
            backgroundColor: "rgba(239,83,80,0.06)",
            border: "1px solid rgba(239,83,80,0.2)",
          }}
        >
          <WarningAmberIcon
            sx={{ fontSize: 18, color: "#EF5350", flexShrink: 0, mt: "1px" }}
          />

          <Typography
            sx={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.55,
            }}
          >
            Permanently delete{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              "{banner?.title}"
            </strong>
            ? This cannot be undone.
          </Typography>
        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: "var(--border)" }} />

      <DialogActions sx={{ px: 2.5, py: 2, gap: 1.5 }}>
        <AppButton
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </AppButton>

        <AppButton
          
          loading={loading}
          startIcon={
            !loading ? <DeleteOutlinedIcon sx={{ fontSize: 16 }} /> : undefined
          }
          onClick={onConfirm}
        >
          Delete Banner
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
