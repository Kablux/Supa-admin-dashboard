import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Chip, Collapse, ButtonBase } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { KycDocKind, KycDocument } from "./kycDocuments";
import KycDocumentThumbnails from "./KycDocumentThumbnails";
import KycViewerToolbar from "./KycViewerToolbar";
import KycViewerStage from "./KycViewerStage";

interface KycDocumentsSectionProps {
  documents: KycDocument[];
}

/**
 * Collapsible KYC document viewer. Owns all viewer state (selection, zoom,
 * rotation, load/fail status); children are presentational.
 */
export default function KycDocumentsSection({ documents }: KycDocumentsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const hasDocuments = documents.length > 0;
  const active = documents[activeIndex];
  const activeFailed = active ? Boolean(failed[active.key]) : false;
  const effectiveKind: KycDocKind | null = active ? (activeFailed ? "other" : active.kind) : null;

  // Reset view transforms whenever the reviewer switches document
  useEffect(() => {
    setZoom(1);
    setRotation(0);
  }, [activeIndex]);

  const goTo = useCallback(
    (index: number) => {
      if (!documents.length) return;
      setActiveIndex((index + documents.length) % documents.length);
    },
    [documents.length]
  );

  const markLoaded = (key: string) => setLoaded((prev) => ({ ...prev, [key]: true }));
  const markFailed = (key: string) => {
    setFailed((prev) => ({ ...prev, [key]: true }));
    setLoaded((prev) => ({ ...prev, [key]: true }));
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
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
            <KycDocumentThumbnails
              documents={documents}
              activeIndex={activeIndex}
              failed={failed}
              onSelect={setActiveIndex}
              onThumbnailError={markFailed}
            />

            {active && effectiveKind && (
              <Box
                sx={{
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  overflow: "hidden",
                  backgroundColor: "rgba(0,0,0,0.35)",
                }}
              >
                <KycViewerToolbar
                  document={active}
                  position={activeIndex + 1}
                  total={documents.length}
                  showImageControls={effectiveKind === "image"}
                  zoom={zoom}
                  rotation={rotation}
                  onZoomChange={setZoom}
                  onRotate={() => setRotation((r) => (r + 90) % 360)}
                  onReset={resetView}
                />

                <KycViewerStage
                  document={active}
                  kind={effectiveKind}
                  failed={activeFailed}
                  loaded={Boolean(loaded[active.key])}
                  zoom={zoom}
                  rotation={rotation}
                  hasMultiple={documents.length > 1}
                  onPrev={() => goTo(activeIndex - 1)}
                  onNext={() => goTo(activeIndex + 1)}
                  onLoad={() => markLoaded(active.key)}
                  onError={() => markFailed(active.key)}
                />
              </Box>
            )}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
