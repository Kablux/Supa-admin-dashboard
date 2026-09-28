import React, { useEffect, useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { fetchUploadById } from "../../api/xhr";
import { Banner } from "../../types/common.types";
import { formatDate } from "../../utils/bannerHelpers";
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
  const [activeTab, setActiveTab] = useState<"small" | "large">("small");
  const [smallUrl, setSmallUrl] = useState<string>("");
  const [largeUrl, setLargeUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!banner) return;

    let isMounted = true;
    setLoading(true);

    const loadImages = async () => {
      try {
        const [smallRes, largeRes] = await Promise.all([
          banner.image_small
            ? banner.image_small.startsWith("http") || banner.image_small.startsWith("data:")
              ? Promise.resolve({ file: banner.image_small })
              : fetchUploadById(banner.image_small)
            : Promise.resolve(null),
          banner.image_large
            ? banner.image_large.startsWith("http") || banner.image_large.startsWith("data:")
              ? Promise.resolve({ file: banner.image_large })
              : fetchUploadById(banner.image_large)
            : Promise.resolve(null),
        ]);

        if (isMounted) {
          const resolvedSmall = smallRes?.file || "";
          const resolvedLarge = largeRes?.file || "";
          setSmallUrl(resolvedSmall);
          setLargeUrl(resolvedLarge);

          // Default tab selection to whichever image is available
          if (!resolvedSmall && resolvedLarge) {
            setActiveTab("large");
          } else {
            setActiveTab("small");
          }
        }
      } catch (err) {
        console.error("Failed to fetch preview images:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [banner]);

  if (!banner) return null;

  const aud = AUDIENCE_META[banner.audience] || {
    label: banner.audience,
    icon: null,
  };

  const currentImageUrl = activeTab === "small" ? smallUrl : largeUrl;

  const handleCopyUrl = () => {
    if (!currentImageUrl) return;
    navigator.clipboard.writeText(currentImageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          },
        },
      }}
    >
      {/* Top Header Bar */}
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
          <BannerStatusChip banner={banner} />
          <Chip
            size="small"
        
            label={aud.label}
            sx={{
              padding: "0 6px",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              // "& .MuiChip-label": { pl: 0.5, pr: 1 },
            }}
          />
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "var(--text-muted)",
            "&:hover": { color: "var(--text-primary)", backgroundColor: "rgba(255,255,255,0.05)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Image Preview Tabs */}
      <Box sx={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            minHeight: 42,
            px: 2,
            "& .MuiTab-root": {
              minHeight: 42,
              fontSize: 12.5,
              fontWeight: 600,
              textTransform: "none",
              color: "var(--text-muted)",
              "&.Mui-selected": {
                color: "var(--accent-gold)",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--accent-gold)",
              height: 2.5,
              borderRadius: "2px 2px 0 0",
            },
          }}
        >
          <Tab
            value="small"
            icon={<SmartphoneOutlinedIcon sx={{ fontSize: 16 }} />}
            iconPosition="start"
            label="Small Image"
          />
          <Tab
            value="large"
            icon={<DesktopWindowsOutlinedIcon sx={{ fontSize: 16 }} />}
            iconPosition="start"
            label="Large Image"
          />
        </Tabs>
      </Box>

      {/* Image Preview Area */}
      <Box
        sx={{
          position: "relative",
          minHeight: 220,
          maxHeight: 320,
          backgroundColor: "#11141d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          p: 2,
        }}
      >
        {loading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.05)" }}
          />
        ) : currentImageUrl ? (
          <Box
            component="img"
            src={currentImageUrl}
            alt={`${banner.title} (${activeTab})`}
            sx={{
              maxWidth: "100%",
              maxHeight: 280,
              objectFit: "contain",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 5,
              gap: 1,
            }}
          >
            <ImageNotSupportedOutlinedIcon sx={{ fontSize: 48, color: "var(--text-muted)" }} />
            <Typography sx={{ fontSize: 13, color: "var(--text-muted)" }}>
              No {activeTab} image uploaded for this banner
            </Typography>
          </Box>
        )}
      </Box>

      {/* Image URL Bar (Clickable / Copyable) */}
      {currentImageUrl && (
        <Box
          sx={{
            px: 3,
            py: 1.25,
            backgroundColor: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
            <LinkOutlinedIcon sx={{ fontSize: 16, color: "var(--accent-gold)", flexShrink: 0 }} />
            <Typography
              noWrap
              sx={{
                fontSize: 12,
                fontFamily: "monospace",
                color: "var(--text-secondary)",
                maxWidth: "380px",
              }}
            >
              {currentImageUrl}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
            <Tooltip title={copied ? "Copied!" : "Copy Image URL"}>
              <IconButton
                size="small"
                onClick={handleCopyUrl}
                sx={{ color: "var(--text-muted)", "&:hover": { color: "var(--accent-gold)" } }}
              >
                {copied ? (
                  <CheckOutlinedIcon sx={{ fontSize: 16, color: "#4CAF50" }} />
                ) : (
                  <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Open Image in New Tab">
              <IconButton
                size="small"
                component="a"
                href={currentImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "var(--text-muted)", "&:hover": { color: "var(--accent-gold)" } }}
              >
                <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* Banner Details Body */}
      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 19,
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
              lineHeight: 1.6,
              mb: 2,
              whiteSpace: "pre-wrap",
            }}
          >
            {banner.body}
          </Typography>
        )}

        <Divider sx={{ borderColor: "var(--border)", my: 2 }} />

        {/* Metadata Grid */}
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
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "var(--text-muted)",
                  mb: 0.25,
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
                {value || "—"}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Call To Action Box */}
        {banner.is_clickable && banner.cta_value && (
          <Box
            sx={{
              mt: 2.5,
              p: 1.5,
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
              <LinkOutlinedIcon sx={{ fontSize: 16, color: "var(--accent-gold)", flexShrink: 0 }} />
              <Box sx={{ overflow: "hidden" }}>
                <Typography sx={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                  CTA Target ({banner.cta_type})
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    fontSize: 12.5,
                    color: "var(--accent-gold)",
                    fontWeight: 500,
                  }}
                >
                  {banner.cta_value}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <Divider sx={{ borderColor: "var(--border)" }} />

      {/* Footer Actions */}
      <DialogActions sx={{ px: 3, py: 2, gap: 1.5 }}>
        <AppButton onClick={onClose}>
          Close
        </AppButton>

        <AppButton
          startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
            onClose();
            onEdit(banner);
          }}
          sx={{
            backgroundColor: "var(--accent-gold, #FFD700)",
            color: "#000",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "var(--accent-gold, #FFD700)",
              boxShadow: "0 4px 12px rgba(255,215,0,0.25)",
            },
          }}
        >
          Edit Banner
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}