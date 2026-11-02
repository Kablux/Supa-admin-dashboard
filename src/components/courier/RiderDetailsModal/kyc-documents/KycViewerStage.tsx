import React from "react";
import { Box, Typography, IconButton, Button, CircularProgress } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { KycDocKind, KycDocument } from "./kycDocuments";

/* ── Prev / next arrow ── */

function NavArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <IconButton
      aria-label={side === "left" ? "Previous document" : "Next document"}
      onClick={onClick}
      size="small"
      sx={{
        position: "absolute",
        [side]: 8,
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
      {side === "left" ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
    </IconButton>
  );
}

/* ── Fallback for unpreviewable / failed files ── */

function FilePreviewFallback({ document, failed }: { document: KycDocument; failed: boolean }) {
  const Icon = failed ? BrokenImageIcon : InsertDriveFileIcon;

  return (
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
      <Icon sx={{ fontSize: 40, color: "var(--text-secondary, #8A92A6)" }} />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {failed ? "Preview unavailable" : "This file type can't be previewed"}
        </Typography>
        <Typography variant="caption" sx={{ color: "var(--text-secondary, #8A92A6)" }}>
          {failed
            ? "The file couldn't be loaded here. It may have moved or require access."
            : "Open the original file to review it."}
        </Typography>
      </Box>
      <Button
        variant="outlined"
        size="small"
        component="a"
        href={document.url}
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
  );
}

/* ── Stage ── */

interface KycViewerStageProps {
  document: KycDocument;
  kind: KycDocKind;
  failed: boolean;
  loaded: boolean;
  zoom: number;
  rotation: number;
  hasMultiple: boolean;
  onPrev: () => void;
  onNext: () => void;
  onLoad: () => void;
  onError: () => void;
}

export default function KycViewerStage({
  document,
  kind,
  failed,
  loaded,
  zoom,
  rotation,
  hasMultiple,
  onPrev,
  onNext,
  onLoad,
  onError,
}: KycViewerStageProps) {
  const isSideways = rotation % 180 !== 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultiple) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onPrev();
    }
  };

  return (
    <Box
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${document.label} preview`}
      sx={{
        position: "relative",
        height: { xs: 320, sm: 440 },
        outline: "none",
        "&:focus-visible": { boxShadow: "inset 0 0 0 2px rgba(254,185,20,0.4)" },
      }}
    >
      {/* Loading overlay (images & PDFs) */}
      {kind !== "other" && !loaded && (
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

      {kind === "image" && (
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
            key={document.key}
            component="img"
            src={document.url}
            alt={document.label}
            onLoad={onLoad}
            onError={onError}
            draggable={false}
            sx={{
              // margin:auto keeps the image centred while still allowing scroll when zoomed
              m: "auto",
              display: "block",
              borderRadius: "4px",
              userSelect: "none",
              opacity: loaded ? 1 : 0,
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

      {kind === "pdf" && (
        <Box
          key={document.key}
          component="iframe"
          src={`${document.url}#toolbar=1&view=FitH`}
          title={document.label}
          onLoad={onLoad}
          sx={{ width: "100%", height: "100%", border: 0, display: "block", backgroundColor: "#fff" }}
        />
      )}

      {kind === "other" && <FilePreviewFallback document={document} failed={failed} />}

      {hasMultiple && (
        <>
          <NavArrow side="left" onClick={onPrev} />
          <NavArrow side="right" onClick={onNext} />
        </>
      )}
    </Box>
  );
}
