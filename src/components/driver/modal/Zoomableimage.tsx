import React, { useState } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface ZoomableImageProps {
  src: string | null;
  alt?: string;
  onError?: () => void;
  maxHeight?: number;
  zoomScale?: number;
  emptyState?: React.ReactNode;
  containerSx?: SxProps<Theme>;
}

export default function ZoomableImage({
  src,
  alt = "Preview",
  onError,
  maxHeight = 300,
  zoomScale = 2,
  emptyState,
  containerSx,
}: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: `${((e.clientX - left) / width) * 100}%`,
      y: `${((e.clientY - top) / height) * 100}%`,
    });
  };

  if (!src) return <>{emptyState ?? null}</>;

  return (
    <Box
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
      sx={{
        width: "100%",
        maxHeight,
        height: "100%",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#121212",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        cursor: "zoom-in",
        ...containerSx,
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        onError={onError}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: isZoomed ? `scale(${zoomScale})` : "scale(1)",
          transformOrigin: `${origin.x} ${origin.y}`,
          transition: isZoomed ? "none" : "transform 0.3s ease-out",
          willChange: "transform",
        }}
      />
    </Box>
  );
}