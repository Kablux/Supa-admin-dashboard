import { useCallback, useEffect, useRef, useState } from "react";
import { HeatPoint } from "../components/dashboard/map/HeatmapLayer";
import { getDriverLocations } from "../api/xhr";

const POLL_INTERVAL_MS = 30_000;

interface UseDriverLocationsResult {
  points: HeatPoint[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Polls the backend for live driver coordinates.
 * Isolated from MapWidget so the map's rendering concerns stay separate
 * from data-fetching/error/retry concerns.
 */
export function useDriverLocations(
  pollIntervalMs: number = POLL_INTERVAL_MS,
): UseDriverLocationsResult {
  const [points, setPoints] = useState<HeatPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchLocations = useCallback(async () => {
    try {
      const data = await getDriverLocations();
      if (!isMountedRef.current) return;
      setPoints(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load driver locations:", err);
      if (isMountedRef.current) {
        setError("Couldn't load live driver data. Retrying shortly.");
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchLocations();

    const interval = setInterval(fetchLocations, pollIntervalMs);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchLocations, pollIntervalMs]);

  return { points, isLoading, error, refetch: fetchLocations };
}
