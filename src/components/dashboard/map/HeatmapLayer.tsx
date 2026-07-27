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
export default function HeatmapLayer({
  points,
  radius = 25,
  blur = 20,
  maxZoom = 17,
}: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatData: [number, number, number][] = points.map((p) => [
      p.lat,
      p.lng,
      p.weight ?? 1,
    ]);

    // @ts-expect-error - leaflet.heat augments L with heatLayer at runtime
    const heatLayer = L.heatLayer(heatData, { radius, blur, maxZoom });
    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, maxZoom]);

  return null;
}