import React from "react";
import { Box, Typography, ButtonBase } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { KycDocument, kindLabel } from "./kycDocuments";

interface KycDocumentThumbnailsProps {
  documents: KycDocument[];
  activeIndex: number;
  failed: Record<string, boolean>;
  onSelect: (index: number) => void;
  onThumbnailError: (key: string) => void;
}

export default function KycDocumentThumbnails({
  documents,
  activeIndex,
  failed,
  onSelect,
  onThumbnailError,
}: KycDocumentThumbnailsProps) {
  return (
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
            onClick={() => onSelect(index)}
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
                  onError={() => onThumbnailError(doc.key)}
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
  );
}
