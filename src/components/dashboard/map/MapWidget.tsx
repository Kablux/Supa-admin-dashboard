import React, { useRef, useState } from "react";
import { Box, Skeleton, Typography, IconButton, Tooltip } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { MapContainer, TileLayer } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDriverLocations } from "../../../utils/useDriverLocations";
import HeatmapLayer from "./HeatmapLayer";
import MapController from "./MapController";
import MapSearchBar from "./MapSearchbar";

const DEFAULT_CENTER: [number, number] = [7.3775, 3.9059];
const DEFAULT_ZOOM = 11;

export default function MapWidget() {
  const { points, isLoading, error } = useDriverLocations();
  const [targetCenter, setTargetCenter] = useState<[number, number] | null>(
    null,
  );
  const mapRef = useRef<LeafletMap | null>(null);

  const handleReset = () => {
    mapRef.current?.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1 });
    setTargetCenter(null);
  };

  return (
    <Box
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        position: "relative",
        height: 479,
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "secondary.main",
      }}
    >
      {/* Top floating bar: live badge + driver count + search */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            pointerEvents: "auto", // Restores clicking for this specific element
            bgcolor: "rgba(15,15,15,0.75)",
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: error ? "#f44336" : "#4caf50",
              boxShadow: error ? "0 0 8px #f44336" : "0 0 8px #4caf50",
            }}
          />
          <Typography sx={{ fontWeight: 500, fontSize: "11px", color: "#fff" }}>
            Kablux Live Drivers
          </Typography>
          {!isLoading && !error && (
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "11px",
                color: "var(--accent-gold, #e0a96d)",
              }}
            >
              · {points.length}
            </Typography>
          )}
        </Box>

        <Box sx={{ pointerEvents: "auto" }}>
          <MapSearchBar onSelect={setTargetCenter} />
        </Box>
      </Box>

      {/* Error banner — non-blocking, sits below the top bar */}
      {error && !isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 56,
            left: 12,
            zIndex: 1000,
            bgcolor: "rgba(244,67,54,0.15)",
            border: "1px solid rgba(244,67,54,0.4)",
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
            pointerEvents: "auto",
          }}
        >
          <Typography sx={{ fontSize: "11px", color: "#320c08" }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Reset view control */}
      {!isLoading && (
        <Tooltip title="Reset view" placement="left">
          <IconButton
            onClick={handleReset}
            size="small"
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              zIndex: 1000,
              bgcolor: "rgba(15,15,15,0.75)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(6px)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(15,15,15,0.9)" },
            }}
          >
            <MyLocationIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      )}

      {isLoading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ bgcolor: "#1a1a1a" }}
        />
      ) : (
        <>
          <MapContainer
            ref={mapRef}
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
            scrollWheelZoom={false}
            zoomControl={false}
          >
            <MapController center={targetCenter} />
            <TileLayer
              attribution=' <a href="https://www.kabluxe.com" target="_blank" rel="noopener noreferrer">Kablux</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.length > 0 && (
              <HeatmapLayer points={points} radius={28} blur={22} />
            )}
          </MapContainer>

          {points.length === 0 && !error && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                pointerEvents: "none",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                  bgcolor: "rgba(0,0,0,0.5)",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                }}
              >
                No drivers online right now
              </Typography>
            </Box>
          )}

          {/* <MapLegend /> */}
        </>
      )}
    </Box>
  );
}
