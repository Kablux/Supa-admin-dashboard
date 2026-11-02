import React from "react";
import { Box, Typography, IconButton, Divider, Tooltip } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { KycDocument, ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from "./kycDocuments";

const toolbarIconSx = {
  color: "var(--text-secondary, #8A92A6)",
  "&:hover": { color: "var(--text-primary, #FFFFFF)", backgroundColor: "rgba(255,255,255,0.06)" },
  "&.Mui-disabled": { color: "rgba(255,255,255,0.2)" },
};

interface ToolbarButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

/** Icon button with tooltip; the span keeps the tooltip working when disabled. */
function ToolbarButton({ title, onClick, disabled, children }: ToolbarButtonProps) {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton size="small" aria-label={title} disabled={disabled} onClick={onClick} sx={toolbarIconSx}>
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}

interface KycViewerToolbarProps {
  document: KycDocument;
  position: number;
  total: number;
  showImageControls: boolean;
  zoom: number;
  rotation: number;
  onZoomChange: React.Dispatch<React.SetStateAction<number>>;
  onRotate: () => void;
  onReset: () => void;
}

export default function KycViewerToolbar({
  document,
  position,
  total,
  showImageControls,
  zoom,
  rotation,
  onZoomChange,
  onRotate,
  onReset,
}: KycViewerToolbarProps) {
  return (
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
          {document.label}
        </Typography>
        {total > 1 && (
          <Typography variant="caption" sx={{ color: "var(--text-secondary, #8A92A6)" }}>
            {position} / {total}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
        {showImageControls && (
          <>
            <ToolbarButton
              title="Zoom out"
              disabled={zoom <= ZOOM_MIN}
              onClick={() => onZoomChange((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
            >
              <ZoomOutIcon fontSize="small" />
            </ToolbarButton>
            <Typography
              variant="caption"
              sx={{ minWidth: 38, textAlign: "center", color: "var(--text-secondary, #8A92A6)", fontVariantNumeric: "tabular-nums" }}
            >
              {Math.round(zoom * 100)}%
            </Typography>
            <ToolbarButton
              title="Zoom in"
              disabled={zoom >= ZOOM_MAX}
              onClick={() => onZoomChange((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
            >
              <ZoomInIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Rotate" onClick={onRotate}>
              <RotateRightIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Reset view" disabled={zoom === 1 && rotation === 0} onClick={onReset}>
              <RestartAltIcon fontSize="small" />
            </ToolbarButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: "rgba(255,255,255,0.08)" }} />
          </>
        )}

        <Tooltip title="Open original in new tab">
          <IconButton
            size="small"
            aria-label="Open original in new tab"
            component="a"
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={toolbarIconSx}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
