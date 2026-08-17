import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { loadLeafletHeat } from "../../../utils/loadLeafletHeat";

export interface HeatPoint {
  lat: number;
  lng: number;
  weight?: number;
}

interface HeatmapLayerProps {
  points: HeatPoint[];
  radius?: number;
  blur?: number;
  maxZoom?: number;
}

export default function HeatmapLayer({
  points,
  radius = 25,
  blur = 20,
  maxZoom = 17,
}: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    let heatLayer: L.Layer | null = null;
    let cancelled = false;

    const initializeHeatmap = async () => {
      if (!points.length) return;

      try {
        await loadLeafletHeat();

        if (cancelled) return;

        const heatData: [number, number, number][] = points
          .filter(
            (point) =>
              Number.isFinite(point.lat) &&
              Number.isFinite(point.lng)
          )
          .map((point) => [
            point.lat,
            point.lng,
            point.weight ?? 1,
          ]);

        if (!heatData.length) return;
        heatLayer = L.heatLayer(heatData, {
          radius,
          blur,
          maxZoom,
        });

        heatLayer.addTo(map);
      } catch (error) {
        console.error("Failed to load Leaflet heatmap:", error);
      }
    };

    initializeHeatmap();

    return () => {
      cancelled = true;

      if (heatLayer) {
        map.removeLayer(heatLayer);
        heatLayer = null;
      }
    };
  }, [map, points, radius, blur, maxZoom]);

  return null;
}