import { useEffect } from "react";
import { useMap } from "react-leaflet";

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

let heatPluginPromise: Promise<void> | null = null;

function ensureHeatPlugin(): Promise<void> {
  if (!heatPluginPromise) {
    heatPluginPromise = import("leaflet").then((leaflet) => {
      window.L = leaflet.default || leaflet;

      // 3. ONLY AFTER L is globally available, load the heat plugin
      return import("leaflet.heat").then(() => {});
    });
  }
  return heatPluginPromise;
}

export default function HeatmapLayer({
  points,
  radius = 25,
  blur = 20,
  maxZoom = 20,
}: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let heatLayer: any = null;

    ensureHeatPlugin().then(() => {
      if (cancelled) return;

      const heatData: [number, number, number][] = points.map((p) => [
        p.lat,
        p.lng,
        p.weight ?? 1,
      ]);

      heatLayer = window.L.heatLayer(heatData, { radius, blur, maxZoom });
      heatLayer.addTo(map);
    });

    return () => {
      cancelled = true;
      if (heatLayer) map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, maxZoom]);

  return null;
}