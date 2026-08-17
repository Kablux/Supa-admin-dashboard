import L from "leaflet";
import "leaflet/dist/leaflet.css";

if (typeof window !== "undefined") {
  (window as unknown as { L: typeof L }).L = L;
}

export const heatReady: Promise<unknown> = import("leaflet.heat");

export default L;