import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Banner } from "../../types/common.types";
import { getBannerImage, formatDate } from "../../utils/bannerHelpers";
import AppButton from "../common/AppButton";
import { AUDIENCE_META } from "./bannerMeta";
import BannerStatusChip from "./BannerStatusChip";


interface BannerPreviewDialogProps {
  banner: Banner | null;
  onClose: () => void;
  onEdit: (banner: Banner) => void;
}

export default function BannerPreviewDialog({
  banner,
  onClose,
  onEdit,
}: BannerPreviewDialogProps): React.ReactElement | null {
  if (!banner) return null;

  const image = getBannerImage(banner);
  const aud = AUDIENCE_META[banner.audience];

  return (
    <Dialog
      open={Boolean(banner)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            backgroundImage: "none",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: 200,
          backgroundColor: "#191e2d",
          overflow: "hidden",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={banner.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 1,
            }}
          >
            <ImageNotSupportedOutlinedIcon
              sx={{ fontSize: 44, color: "var(--text-muted)" }}
            />
            <Typography
              sx={{ fontSize: 12, color: "var(--text-muted)" }}
            >
              No image uploaded
            </Typography>
          </Box>
        )}

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(0,0,0,0.55)",
            color: "#fff",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.75)" },
          }}
        >
          ×
        </IconButton>

        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            gap: 0.75,
          }}
        >
          <BannerStatusChip banner={banner} />
          <Chip
            size="small"
            icon={
              <Box
                sx={{
                  color: "#fff !important",
                  display: "flex",
                  ml: "6px !important",
                }}
              >
                {aud.icon}
              </Box>
            }
            label={aud.label}
            sx={{
              height: 22,
              fontSize: 10,
              fontWeight: 600,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              backdropFilter: "blur(4px)",
              "& .MuiChip-label": { pl: 0.25, pr: 1 },
            }}
          />
        </Box>
      </Box>

      <DialogContent sx={{ pt: 2.5, pb: 2 }}>
        <Typography
          sx={{
             
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text-primary)",
            mb: 0.75,
          }}
        >
          {banner.title || "(No title)"}
        </Typography>

        {banner.body && (
          <Typography
            sx={{
              fontSize: 13.5,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              mb: 2,
            }}
          >
            {banner.body}
          </Typography>
        )}

        <Divider sx={{ borderColor: "var(--border)", mb: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          {[
            { label: "Banner ID", value: banner.id },
            { label: "Audience", value: aud.label },
            { label: "Sort Order", value: `#${banner.sort_order}` },
            { label: "CTA Type", value: banner.cta_type.replace("_", " ") },
            { label: "Starts At", value: formatDate(banner.starts_at) },
            { label: "Ends At", value: formatDate(banner.ends_at) },
            { label: "Created", value: formatDate(banner.created_at) },
            { label: "Last Updated", value: formatDate(banner.updated_at) },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Typography
                sx={{
                  fontSize: 10.5,
                  color: "var(--text-muted)",
                  mb: 0.2,
                }}
              >
                {label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 12.5,
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  wordBreak: "break-all",
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>

        {banner.is_clickable && banner.cta_value && (
          <Box
            sx={{
              mt: 2,
              p: 1.25,
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LinkOutlinedIcon
              sx={{ fontSize: 14, color: "var(--accent-gold)", flexShrink: 0 }}
            />
            <Typography
              sx={{
                fontSize: 12,
                color: "var(--accent-gold)",
                wordBreak: "break-all",
              }}
            >
              {banner.cta_value}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <Divider sx={{ borderColor: "var(--border)" }} />

      <DialogActions sx={{ px: 2.5, py: 2, gap: 1.5 }}>
        <AppButton  onClick={onClose}>
          Close
        </AppButton>

        <AppButton
          
          startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
            onClose();
            onEdit(banner);
          }}
        >
          Edit Banner
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
