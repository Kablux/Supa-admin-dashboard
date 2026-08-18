import React, { useRef, useState } from "react";
import { Box, Skeleton, Typography, IconButton, Tooltip } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDriverLocations } from "../../../utils/useDriverLocations";
import HeatmapLayer from "./HeatmapLayer";
import MapController from "./MapController";
import MapSearchBar from "./MapSearchbar";
import { driverMarkerIcon } from "./driverIcon";
const DEFAULT_CENTER: [number, number] = [7.3775, 3.9059];
const DEFAULT_ZOOM = 11;

export default function MapWidget() {
  const { drivers, isLoading, error } = useDriverLocations();
  const [targetCenter, setTargetCenter] = useState<[number, number] | null>(
    null,
  );
  const mapRef = useRef<LeafletMap | null>(null);

  const handleReset = () => {
    mapRef.current?.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1 });
    setTargetCenter(null);
  };

  // Convert DriverLocation array to HeatPoint format
  const heatPoints = drivers.map((driver) => ({
    lat: driver.lat,
    lng: driver.lng,
    weight: 1,
  }));

  return (
    <Box
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        position: "relative",
        height: 479,
        border: "1px solid var(--border)",
        bgcolor: "var(--bg-card)",
      }}
    >
      {/* Top floating bar */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            pointerEvents: "auto",
            bgcolor: "var(--bg-secondary)",
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            backdropFilter: "blur(6px)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: error ? "var(--danger)" : "var(--success)",
              boxShadow: error
                ? "0 0 8px var(--danger)"
                : "0 0 8px var(--success)",
            }}
          />
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "11px",
              color: "var(--text-primary)",
            }}
          >
            Kablux Live Drivers
          </Typography>
          {!isLoading && !error && (
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "11px",
                color: "var(--accent-primary)",
              }}
            >
              · {drivers.length}
            </Typography>
          )}
        </Box>

        <Box sx={{ pointerEvents: "auto" }}>
          <MapSearchBar onSelect={setTargetCenter} />
        </Box>
      </Box>

      {/* Error banner */}
      {error && !isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 56,
            left: 12,
            zIndex: 1000,
            bgcolor: "rgba(239,83,80,0.15)",
            border: "1px solid var(--danger)",
            borderRadius: 1,
            px: 1.5,
            py: 0.5,
            pointerEvents: "auto",
          }}
        >
          <Typography sx={{ fontSize: "11px", color: "var(--text-primary)" }}>
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
              bgcolor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(6px)",
              color: "var(--text-primary)",
              "&:hover": { bgcolor: "var(--bg-card-hover)" },
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
          sx={{ bgcolor: "var(--bg-card)" }}
        />
      ) : (
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
            attribution='&copy; <a href="https://www.kablux.com" target="_blank" rel="noopener noreferrer">Kablux</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Heatmap Density */}
          {heatPoints.length > 0 && (
            <HeatmapLayer points={heatPoints} radius={28} blur={22} />
          )}

          {/* Render Individual Driver Pin Markers with Info Popup */}
          {drivers.map((driver) => (
            <Marker
              key={driver.driver_id}
              position={[driver.lat, driver.lng]}
              icon={driverMarkerIcon}
            >
              <Popup
                closeButton
                className="kablux-driver-popup"
                minWidth={250}
                maxWidth={280}
              >
                <Box
                  sx={{
                    minWidth: 250,
                    p: 0,
                  }}
                >
                  {/* Driver Header */}
                  <Box
                    sx={{
                      px: 0.25,
                      pt: 1.5,
                      pb: 1.25,
                      borderBottom: "1px solid #E8EDF0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      {/* Avatar */}
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#E7F7F0",
                          color: "#087443",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        {driver.name
                          ?.split(" ")
                          .slice(0, 2)
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()}
                      </Box>

                      <Box>
                        <Typography
                        component={"span"}
                          sx={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#031A24",
                          }}
                        >
                          {driver.name}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.6,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: "#16A36A",
                            }}
                          />

                          <Typography
                           component={"span"}
                            sx={{
                              fontSize: "10px",
                              fontWeight: 600,
                              color: "#087443",
                            }}
                          >
                            Online
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Driver Details */}
                  <Box
                    sx={{
                      px: 1.5,
                      py: 1.25,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.1,
                    }}
                  >
                    {/* Phone */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1,
                            bgcolor: "#F3F6F7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <PhoneIcon
                            sx={{
                              fontSize: 14,
                              color: "#53656D",
                            }}
                          />
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#8A969C",
                              lineHeight: 1.2,
                            }}
                          >
                            Phone number
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "11px",
                              color: "#26383F",
                              fontWeight: 600,
                            }}
                          >
                            {driver.phone_number || "Not available"}
                          </Typography>
                        </Box>
                      </Box>

                      {driver.phone_number && (
                        <IconButton
                          component="a"
                          href={`tel:${driver.phone_number}`}
                          size="small"
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: "#EAF8F2",
                            color: "#087443",
                            "&:hover": {
                              bgcolor: "#D9F2E7",
                            },
                          }}
                        >
                          <PhoneIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
                    </Box>

                    {/* Location */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1,
                          bgcolor: "#F3F6F7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MyLocationIcon
                          sx={{
                            fontSize: 14,
                            color: "#53656D",
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#8A969C",
                            lineHeight: 1.2,
                          }}
                        >
                          Current location
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "10px",
                            color: "#26383F",
                            fontWeight: 500,
                          }}
                        >
                          {driver.lat.toFixed(5)}, {driver.lng.toFixed(5)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Footer */}
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.9,
                      bgcolor: "#F8FAFB",
                      borderTop: "1px solid #E8EDF0",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "9px",
                        color: "#8A969C",
                        textAlign: "center",
                      }}
                    >
                      Live driver location
                    </Typography>
                  </Box>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </Box>
  );
}
