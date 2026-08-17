import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

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

let heatPluginPromise: Promise<unknown> | null = null;

function ensureHeatPlugin(): Promise<unknown> {
  if (typeof window !== "undefined") {
    (window as unknown as { L: typeof L }).L = L;
  }
  if (!heatPluginPromise) {
    heatPluginPromise = import("leaflet.heat");
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
    let heatLayer: any = null;

    ensureHeatPlugin().then(() => {
      if (cancelled) return;

      const heatData: [number, number, number][] = points.map((p) => [
        p.lat,
        p.lng,
        p.weight ?? 1,
      ]);

    
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      heatLayer = (L as any).heatLayer(heatData, { radius, blur, maxZoom });
      heatLayer.addTo(map);
    });

    return () => {
      cancelled = true;
      if (heatLayer) map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, maxZoom]);

  return null;
}