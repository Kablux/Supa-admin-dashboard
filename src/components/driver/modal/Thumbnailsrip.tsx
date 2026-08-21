import React from "react";
import { Box, Typography } from "@mui/material";

interface ThumbItem {
  id?: string | number;
  image_url: string;
  image_type?: string;
}

interface ThumbnailStripProps {
  images?: ThumbItem[];
  activeUrl: string | null;
  onSelect: (url: string) => void;
  width?: number;
  height?: number;
  /** Show the uppercase image_type label overlay (review panel style). */
  showType?: boolean;
  justify?: string;
  keyPrefix?: string;
}

export default function ThumbnailStrip({
  images,
  activeUrl,
  onSelect,
  width = 60,
  height = 60,
  showType = false,
  justify = "flex-start",
  keyPrefix = "thumb",
}: ThumbnailStripProps) {
  if (!images?.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        gap: showType ? 1 : 1.5,
        justifyContent: justify,
        flexWrap: "wrap",
      }}
    >
      {images.map((img, idx) => {
        const isSelected = activeUrl === img.image_url;
        return (
          <Box
            key={img.id || `${keyPrefix}-${idx}`}
            onClick={() => onSelect(img.image_url)}
            sx={{
              width,
              height,
              borderRadius: showType ? "6px" : 1,
              overflow: "hidden",
              cursor: "pointer",
              position: "relative",
              border: isSelected
                ? "2px solid var(--accent-gold, #FFD700)"
                : "1px solid rgba(255,255,255,0.08)",
              opacity: showType ? (isSelected ? 1 : 0.6) : 1,
              transition: "all 0.15s ease",
              "&:hover": { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={img.image_url}
              alt="thumbnail"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {showType && img.image_type && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  py: 0.1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 8,
                    textTransform: "uppercase",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#FFF",
                  }}
                >
                  {img.image_type}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}