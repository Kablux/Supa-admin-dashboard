import L from "leaflet";

let heatLoaded = false;
let heatLoading: Promise<void> | null = null;

export async function loadLeafletHeat(): Promise<void> {
  if (heatLoaded) return;

  if (heatLoading) {
    return heatLoading;
  }

  // leaflet.heat expects Leaflet to be available globally as `L`
  (window as typeof window & { L: typeof L }).L = L;

  heatLoading = import("leaflet.heat").then(() => {
    heatLoaded = true;
  });

  return heatLoading;
}