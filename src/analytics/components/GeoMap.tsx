import { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { CircleMarker, MapContainer, Polygon, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePalette } from "../palette";

export interface GeoCell {
  id: string;
  label: string;
  center: number[] | null;
  boundary: number[][];
  flags?: string[];
  [metric: string]: unknown;
}

export interface LiveSupplyPoint {
  id: string;
  center: number[] | null;
  online: number;
  on_trip: number;
  available: number;
}

const DEFAULT_CENTER: LatLngTuple = [7.3775, 3.9059];

function FitBounds({ cells }: { cells: GeoCell[] }) {
  const map = useMap();
  useEffect(() => {
    const points = cells.flatMap((cell) => cell.boundary as LatLngTuple[]);
    if (points.length) {
      const lats = points.map((p) => p[0]);
      const lngs = points.map((p) => p[1]);
      const bounds: LatLngBoundsExpression = [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ];
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 13 });
    }
  }, [cells, map]);
  return null;
}

export default function GeoMap({ cells, metric, label, format, live = [], height = 460, onSelect }: { cells: GeoCell[]; metric: string; label: string; format: (value: number) => string; live?: LiveSupplyPoint[]; height?: number; onSelect?: (cell: GeoCell) => void }) {
  const palette = usePalette();
  const max = useMemo(() => Math.max(1, ...cells.map((cell) => Number(cell[metric] || 0))), [cells, metric]);
  return (
    <Box sx={{ height, borderRadius: 2, overflow: "hidden", border: "1px solid var(--border)", "@media print": { height: 380 } }}>
      <MapContainer center={DEFAULT_CENTER} zoom={11} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds cells={cells} />
        {cells.map((cell) => {
          const value = Number(cell[metric] || 0);
          const share = value / max;
          const flagged = (cell.flags || []).includes("insufficient_drivers") || (cell.flags || []).includes("underserved");
          return (
            <Polygon
              key={cell.id}
              positions={cell.boundary as LatLngTuple[]}
              pathOptions={{ color: flagged ? palette.negative : palette.series[0], weight: flagged ? 2 : 1, fillColor: palette.series[0], fillOpacity: 0.08 + share * 0.62 }}
              eventHandlers={onSelect ? { click: () => onSelect(cell) } : undefined}
            >
              <Tooltip sticky>
                <div style={{ fontSize: 12 }}>
                  <b>{cell.label || cell.id}</b>
                  <br />
                  {label}: {format(value)}
                  {cell.flags && cell.flags.length ? (
                    <>
                      <br />
                      {cell.flags.join(", ").replace(/_/g, " ")}
                    </>
                  ) : null}
                </div>
              </Tooltip>
            </Polygon>
          );
        })}
        {live
          .filter((point) => point.center)
          .map((point) => (
            <CircleMarker key={point.id} center={point.center as LatLngTuple} radius={5 + Math.min(point.online, 20)} pathOptions={{ color: palette.series[1], fillOpacity: 0.55 }}>
              <Tooltip>
                <div style={{ fontSize: 12 }}>
                  Online now: {point.online} · available {point.available} · on trip {point.on_trip}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
      </MapContainer>
    </Box>
  );
}
