import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Collapse,
  ButtonBase,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KycStatusChip from "./KycStatusChip";
import { CourierRider } from "../../types/common.types";
import AppButton from "../common/AppButton";
import { useAppSelector } from "../../redux/hooks";

/*                               KYC Documents                                */

type KycDocKind = "image" | "pdf" | "other";

interface KycDocument {
  key: string;
  label: string;
  url: string;
  kind: KycDocKind;
}

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "avif", "svg", "heic"];
const OTHER_EXTENSIONS = ["doc", "docx", "xls", "xlsx", "csv", "txt", "zip"];

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.5;

/**
 * Work out how to render a file from its URL. URLs without a recognisable
 * extension (common with CDN/storage links) are treated as images first;
 * if the image fails to load the viewer falls back to an "open original" state.
 */
function getDocKind(url: string): KycDocKind {
  let path = url;
  try {
    path = new URL(url, window.location.origin).pathname;
  } catch {
    /* keep raw url */
  }
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (OTHER_EXTENSIONS.includes(ext)) return "other";
  return "image";
}

function buildKycDocuments(rider: CourierRider): KycDocument[] {
  const candidates: Array<{ key: string; label: string; url?: string | null }> = [
    { key: "rider_permit", label: "Rider Permit", url: rider.rider_permit_url },
    { key: "government_id_front", label: "Government ID", url: rider.government_id_front_url },
    { key: "vehicle_picture", label: "Vehicle Picture", url: rider.vehicle_picture_url },
  ];

  return candidates
    .filter((c): c is { key: string; label: string; url: string } => Boolean(c.url))
    .map((c) => ({ ...c, kind: getDocKind(c.url) }));
}

const kindLabel: Record<KycDocKind, string> = {
  image: "Image",
  pdf: "PDF",
  other: "File",
};

interface KycDocumentsSectionProps {
  documents: KycDocument[];
}

function KycDocumentsSection({ documents }: KycDocumentsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const hasDocuments = documents.length > 0;
  const active = documents[activeIndex];
  const activeFailed = active ? failed[active.key] : false;
  const effectiveKind: KycDocKind | null = active ? (activeFailed ? "other" : active.kind) : null;
  const isImage = effectiveKind === "image";
  const isSideways = rotation % 180 !== 0;

  // Reset view transforms whenever the reviewer switches document
  useEffect(() => {
    setZoom(1);
    setRotation(0);
  }, [activeIndex]);

  const goTo = useCallback(
    (index: number) => {
      if (!documents.length) return;
      const next = (index + documents.length) % documents.length;
      setActiveIndex(next);
    },
    [documents.length]
  );

  const markLoaded = (key: string) => setLoaded((prev) => ({ ...prev, [key]: true }));
  const markFailed = (key: string) => {
    setFailed((prev) => ({ ...prev, [key]: true }));
    setLoaded((prev) => ({ ...prev, [key]: true }));
  };

  const handleStageKeyDown = (e: React.KeyboardEvent) => {
    if (documents.length < 2) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(activeIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  const toolbarIconSx = {
    color: "var(--text-secondary, #8A92A6)",
    "&:hover": { color: "var(--text-primary, #FFFFFF)", backgroundColor: "rgba(255,255,255,0.06)" },
    "&.Mui-disabled": { color: "rgba(255,255,255,0.2)" },
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-secondary, #141721)",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        overflow: "hidden",
      }}
    >
      {/* Accordion header */}
      <ButtonBase
        onClick={() => hasDocuments && setExpanded((v) => !v)}
        disabled={!hasDocuments}
        aria-expanded={expanded}
        aria-controls="kyc-documents-panel"
        sx={{
          width: "100%",
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          textAlign: "left",
          transition: "background-color 150ms ease",
          "&:hover": { backgroundColor: hasDocuments ? "rgba(255,255,255,0.02)" : "transparent" },
          "&.Mui-focusVisible": { outline: "2px solid rgba(254,185,20,0.5)", outlineOffset: -2 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--text-primary, #FFFFFF)" }}>
            {hasDocuments ? (expanded ? "Hide documents" : "View submitted documents") : "No documents submitted"}
          </Typography>
          {hasDocuments && (
            <Chip
              label={`${documents.length} ${documents.length === 1 ? "file" : "files"}`}
              size="small"
              sx={{
                height: 20,
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: "rgba(254, 185, 20, 0.12)",
                color: "var(--accent-gold, #FEB914)",
              }}
            />
          )}
        </Box>
        {hasDocuments && (
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              color: "var(--text-secondary, #8A92A6)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
            }}
          />
        )}
      </ButtonBase>

      {hasDocuments && (
        <Collapse in={expanded} timeout={220} unmountOnExit>
          <Box
            id="kyc-documents-panel"
            sx={{
              px: 2,
              pb: 2,
              pt: 0.5,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {/* Thumbnails */}
            <Box
              role="tablist"
              aria-label="KYC documents"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: `repeat(${Math.min(documents.length, 4)}, 1fr)` },
                gap: 1,
                pt: 1.5,
              }}
            >
              {documents.map((doc, index) => {
                const selected = index === activeIndex;
                const docKind = failed[doc.key] ? "other" : doc.kind;
                return (
                  <ButtonBase
                    key={doc.key}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveIndex(index)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: selected
                        ? "1.5px solid var(--accent-gold, #FEB914)"
                        : "1.5px solid rgba(255,255,255,0.06)",
                      backgroundColor: selected ? "rgba(254,185,20,0.06)" : "rgba(255,255,255,0.02)",
                      transition: "border-color 150ms ease, background-color 150ms ease",
                      "&:hover": { borderColor: selected ? "var(--accent-gold, #FEB914)" : "rgba(255,255,255,0.16)" },
                      "&.Mui-focusVisible": { outline: "2px solid rgba(254,185,20,0.5)", outlineOffset: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        height: 72,
                        backgroundColor: "rgba(0,0,0,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {docKind === "image" ? (
                        <Box
                          component="img"
                          src={doc.url}
                          alt=""
                          loading="lazy"
                          onError={() => markFailed(doc.key)}
                          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : docKind === "pdf" ? (
                        <PictureAsPdfIcon sx={{ color: "#F87171", fontSize: 30 }} />
                      ) : (
                        <InsertDriveFileIcon sx={{ color: "var(--text-secondary, #8A92A6)", fontSize: 28 }} />
                      )}
                    </Box>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.75,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ fontWeight: 600, color: selected ? "var(--text-primary, #FFFFFF)" : "var(--text-secondary, #8A92A6)" }}
                      >
                        {doc.label}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: 10, color: "var(--text-secondary, #8A92A6)", flexShrink: 0 }}>
                        {kindLabel[doc.kind]}
                      </Typography>
                    </Box>
                  </ButtonBase>
                );
              })}
            </Box>

            {/* Viewer */}
            {active && (
              <Box
                sx={{
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  overflow: "hidden",
                  backgroundColor: "rgba(0,0,0,0.35)",
                }}
              >
                {/* Toolbar */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    backgroundColor: "var(--bg-card, #1A1D26)",
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                      {active.label}
                    </Typography>
                    {documents.length > 1 && (
                      <Typography variant="caption" sx={{ color: "var(--text-secondary, #8A92A6)" }}>
                        {activeIndex + 1} / {documents.length}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                    {isImage && (
                      <>
                        <Tooltip title="Zoom out">
                          <span>
                            <IconButton
                              size="small"
                              aria-label="Zoom out"
                              disabled={zoom <= ZOOM_MIN}
                              onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
                              sx={toolbarIconSx}
                            >
                              <ZoomOutIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Typography
                          variant="caption"
                          sx={{ minWidth: 38, textAlign: "center", color: "var(--text-secondary, #8A92A6)", fontVariantNumeric: "tabular-nums" }}
                        >
                          {Math.round(zoom * 100)}%
                        </Typography>
                        <Tooltip title="Zoom in">
                          <span>
                            <IconButton
                              size="small"
                              aria-label="Zoom in"
                              disabled={zoom >= ZOOM_MAX}
                              onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
                              sx={toolbarIconSx}
                            >
                              <ZoomInIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Rotate">
                          <IconButton
                            size="small"
                            aria-label="Rotate 90 degrees"
                            onClick={() => setRotation((r) => (r + 90) % 360)}
                            sx={toolbarIconSx}
                          >
                            <RotateRightIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset view">
                          <span>
                            <IconButton
                              size="small"
                              aria-label="Reset view"
                              disabled={zoom === 1 && rotation === 0}
                              onClick={() => {
                                setZoom(1);
                                setRotation(0);
                              }}
                              sx={toolbarIconSx}
                            >
                              <RestartAltIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: "rgba(255,255,255,0.08)" }} />
                      </>
                    )}
                    <Tooltip title="Open original in new tab">
                      <IconButton
                        size="small"
                        aria-label="Open original in new tab"
                        component="a"
                        href={active.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={toolbarIconSx}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Stage */}
                <Box
                  tabIndex={0}
                  onKeyDown={handleStageKeyDown}
                  aria-label={`${active.label} preview`}
                  sx={{
                    position: "relative",
                    height: { xs: 320, sm: 440 },
                    outline: "none",
                    "&:focus-visible": { boxShadow: "inset 0 0 0 2px rgba(254,185,20,0.4)" },
                  }}
                >
                  {/* Loading overlay (images & PDFs) */}
                  {effectiveKind !== "other" && !loaded[active.key] && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                        pointerEvents: "none",
                      }}
                    >
                      <CircularProgress size={26} sx={{ color: "var(--accent-gold, #FEB914)" }} />
                    </Box>
                  )}

                  {effectiveKind === "image" && (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        overflow: "auto",
                        display: "flex",
                        p: 2,
                        boxSizing: "border-box",
                        cursor: zoom > 1 ? "grab" : "default",
                      }}
                    >
                      <Box
                        key={active.key}
                        component="img"
                        src={active.url}
                        alt={active.label}
                        onLoad={() => markLoaded(active.key)}
                        onError={() => markFailed(active.key)}
                        draggable={false}
                        sx={{
                          // margin:auto keeps the image centred while still allowing scroll when zoomed
                          m: "auto",
                          display: "block",
                          borderRadius: "4px",
                          userSelect: "none",
                          opacity: loaded[active.key] ? 1 : 0,
                          transition: "opacity 200ms ease, transform 200ms ease",
                          transform: `rotate(${rotation}deg)`,
                          ...(zoom === 1
                            ? isSideways
                              ? { maxWidth: { xs: 288, sm: 408 }, maxHeight: { xs: 288, sm: 408 } }
                              : { maxWidth: "100%", maxHeight: "100%" }
                            : { height: `${zoom * 100}%`, width: "auto", maxWidth: "none", maxHeight: "none" }),
                        }}
                      />
                    </Box>
                  )}

                  {effectiveKind === "pdf" && (
                    <Box
                      key={active.key}
                      component="iframe"
                      src={`${active.url}#toolbar=1&view=FitH`}
                      title={active.label}
                      onLoad={() => markLoaded(active.key)}
                      sx={{ width: "100%", height: "100%", border: 0, display: "block", backgroundColor: "#fff" }}
                    />
                  )}

                  {effectiveKind === "other" && (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.5,
                        px: 3,
                        textAlign: "center",
                      }}
                    >
                      {activeFailed ? (
                        <BrokenImageIcon sx={{ fontSize: 40, color: "var(--text-secondary, #8A92A6)" }} />
                      ) : (
                        <InsertDriveFileIcon sx={{ fontSize: 40, color: "var(--text-secondary, #8A92A6)" }} />
                      )}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {activeFailed ? "Preview unavailable" : "This file type can't be previewed"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "var(--text-secondary, #8A92A6)" }}>
                          {activeFailed
                            ? "The file couldn't be loaded here. It may have moved or require access."
                            : "Open the original file to review it."}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        component="a"
                        href={active.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                        sx={{
                          textTransform: "none",
                          color: "var(--text-primary)",
                          borderColor: "var(--border, rgba(255,255,255,0.09))",
                        }}
                      >
                        Open original
                      </Button>
                    </Box>
                  )}

                  {/* Prev / next */}
                  {documents.length > 1 && (
                    <>
                      <IconButton
                        aria-label="Previous document"
                        onClick={() => goTo(activeIndex - 1)}
                        size="small"
                        sx={{
                          position: "absolute",
                          left: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 2,
                          backgroundColor: "rgba(20,23,33,0.8)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "var(--text-primary, #FFFFFF)",
                          backdropFilter: "blur(4px)",
                          "&:hover": { backgroundColor: "rgba(20,23,33,0.95)" },
                        }}
                      >
                        <ChevronLeftIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="Next document"
                        onClick={() => goTo(activeIndex + 1)}
                        size="small"
                        sx={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 2,
                          backgroundColor: "rgba(20,23,33,0.8)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "var(--text-primary, #FFFFFF)",
                          backdropFilter: "blur(4px)",
                          "&:hover": { backgroundColor: "rgba(20,23,33,0.95)" },
                        }}
                      >
                        <ChevronRightIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Rider Details Modal                            */
/* -------------------------------------------------------------------------- */

interface RiderDetailsModalProps {
  open: boolean;
  rider: CourierRider | null;
  kycApprovingId?: string | null;
  kycRejectingId?: string | null;
  onClose: () => void;
  onApproveKyc: (userId: string) => void;
  onRejectKyc: (rider: CourierRider) => void;
}

export default function RiderDetailsModal({
  open,
  rider,
  kycApprovingId,
  kycRejectingId,
  onClose,
  onApproveKyc,
  onRejectKyc,
}: RiderDetailsModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  if (!rider) return null;

  const isVerified = rider.kyc_status === "VERIFIED";

  const isEligibleForApproval = ["UNDER_REVIEW", "NEEDS_RESUBMISSION"].includes(rider.kyc_status);

  const isEligibleForRejection =
    rider.account_status === "PENDING_APPROVAL" &&
    ["UNDER_REVIEW", "NEEDS_RESUBMISSION"].includes(rider.kyc_status);

  const isApproving = kycApprovingId === rider.id;
  const isRejecting = kycRejectingId === rider.id;

  const adminEmail = user?.email || "Admin";

  const kycDocuments = buildKycDocuments(rider);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "var(--bg-card, #1A1D26)",
          backgroundImage: "none",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
          borderRadius: "16px",
          color: "var(--text-primary, #FFFFFF)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2.5,
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          backgroundColor: "var(--bg-secondary, #141721)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              backgroundColor: "rgba(254, 185, 20, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon sx={{ color: "var(--accent-gold, #FEB914)", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {rider.first_name} {rider.last_name}
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--text-secondary, #8A92A6)" }}>
              ID: {rider.id}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "var(--text-secondary)" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {/* Status Badges Row */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 0.5 }}>
          <KycStatusChip status={rider.kyc_status} />
          <Chip
            label={`Account: ${rider.account_status}`}
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "var(--text-secondary)",
              fontSize: 11,
              fontWeight: 500,
            }}
          />
          <Chip
            label={rider.available_to_receive_order ? "🟢 Online / Available" : "⚪ Offline"}
            size="small"
            sx={{
              backgroundColor: rider.available_to_receive_order
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(255, 255, 255, 0.04)",
              color: rider.available_to_receive_order ? "#34D399" : "var(--text-secondary)",
              fontSize: 11,
              fontWeight: 500,
            }}
          />
        </Box>

        {/* Contact & Personal Information */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500 }}>
            Contact &amp; General Information
          </Typography>
          <Box
            sx={{
              backgroundColor: "var(--bg-secondary, #141721)",
              borderRadius: "10px",
              p: 2,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Email Address</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: "break-all" }}>{rider.email || "N/A"}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Phone Number</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{rider.phone_number || "N/A"}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Gender &amp; DOB</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.gender || "N/A"} {rider.date_of_birth ? `(${rider.date_of_birth})` : ""}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>City / State</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {[rider.city, rider.state].filter(Boolean).join(", ") || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Referral Code</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: "monospace" }}>{rider.referral_code || "N/A"}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Date Joined</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.date_joined ? new Date(rider.date_joined).toLocaleDateString() : "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Work Experience</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.previous_place_of_work ? `${rider.previous_place_of_work} (${rider.years_worked || "Duration N/A"})` : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Vehicle Information */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}>
            <LocalShippingIcon fontSize="small" /> Vehicle Information
          </Typography>
          <Box
            sx={{
              backgroundColor: "var(--bg-secondary, #141721)",
              borderRadius: "10px",
              p: 2,
              display: "grid",
              gridTemplateColumns: { sm: "repeat(3, 1fr)" },
              gap: 2,
              border: "1px solid var(--border, rgba(255,255,255,0.09))",
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Vehicle Type</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, textTransform: "capitalize" }}>
                {rider.vehicle_type || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Brand / Make</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.vehicle_brand || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Registration Number</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: "monospace" }}>
                {rider.vehicle_registration_number || "No plate number"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* KYC Documents & Media — inline, collapsible viewer */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}>
            <DescriptionIcon fontSize="small" /> KYC Documents &amp; Media
          </Typography>
          {/* key resets viewer state (selection, zoom, load status) when switching riders */}
          <KycDocumentsSection key={rider.id} documents={kycDocuments} />
        </Box>

        {/* Guarantors & Next of Kin */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon fontSize="small" /> Guarantors &amp; Next of Kin
          </Typography>
          <Box
            sx={{
              backgroundColor: "var(--bg-secondary, #141721)",
              borderRadius: "10px",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Next of Kin</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {rider.next_of_kin_full_name || "N/A"} ({rider.next_of_kin_phone_number || "No Phone"})
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "var(--border)" }} />

            <Box>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block", mb: 1 }}>
                Registered Guarantors ({rider.guarantors?.length || 0})
              </Typography>
              {rider.guarantors && rider.guarantors.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {rider.guarantors.map((g) => (
                    <Box key={g.slot} sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", backgroundColor: "rgba(255,255,255,0.02)", p: 1, borderRadius: "6px" }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Slot {g.slot}: {g.full_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                          {g.phone_number}
                        </Typography>
                      </Box>
                      <Chip label={g.status} size="small" sx={{ fontSize: 10, height: 20 }} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>No guarantors listed.</Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Compliance Notes */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "var(--accent-gold, #FEB914)", mb: 1.5, fontWeight: 500 }}>
            Compliance Notes
          </Typography>
          <Box
            sx={{
              backgroundColor: "var(--bg-secondary, #141721)",
              borderRadius: "10px",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "space-between" }}>
              <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Submitted At:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {rider.kyc_submitted_at ? new Date(rider.kyc_submitted_at).toLocaleString() : "Not submitted"}
              </Typography>
            </Box>
            {rider.approval_date && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Approval Date:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {new Date(rider.approval_date).toLocaleString()}
                </Typography>
              </Box>
            )}
            {isVerified && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>Approved By:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {adminEmail}
                </Typography>
              </Box>
            )}
            {rider.kyc_rejection_reason && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" sx={{ color: "#EF4444" }}>Rejection Reason</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#EF4444" }}>
                  {rider.kyc_rejection_reason}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      {/* Modal Footer Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: "var(--bg-secondary, #141721)",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, width: "100%" }}>
          <Box>
            {isEligibleForRejection && (
              <AppButton
                variant="outlined"
                size="small"
                disabled={isRejecting}
                startIcon={isRejecting ? <CircularProgress size={13} color="inherit" /> : <CancelIcon />}
                onClick={() => onRejectKyc(rider)}
                sx={{
                  color: "#EF4444",
                  border: "2px solid rgba(239, 68, 68, 0.3)",
                  backgroundColor: "transparent",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                }}
              >
                {isRejecting ? "Rejecting..." : "Reject KYC"}
              </AppButton>
            )}
          </Box>

          {isEligibleForApproval && (
            <AppButton
              variant="contained"
              size="small"
              disabled={isApproving}
              startIcon={isApproving ? <CircularProgress size={13} color="inherit" /> : <VerifiedUserIcon />}
              onClick={() => onApproveKyc(rider.id)}
              sx={{
                backgroundColor: "#FFBE18",
                color: "#17130A",
                border: "2px solid var(--border, rgba(255, 255, 255, 0.08))",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#F4B400",
                },
              }}
            >
              {isApproving ? "Approving..." : "Approve KYC"}
            </AppButton>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}