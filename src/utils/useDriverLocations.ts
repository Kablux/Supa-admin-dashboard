import { useCallback, useEffect, useRef, useState } from "react";
import { getDriverLocations } from "../api/xhr";
import { DriverLocation } from "../types/common.types";

const POLL_INTERVAL_MS = 30_000;

interface UseDriverLocationsResult {
  drivers: DriverLocation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDriverLocations(
  pollIntervalMs: number = POLL_INTERVAL_MS
): UseDriverLocationsResult {
  const [drivers, setDrivers] = useState<DriverLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchLocations = useCallback(async () => {
    try {
      const data = await getDriverLocations();
      if (!isMountedRef.current) return;
      setDrivers(data);
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

  return { drivers, isLoading, error, refetch: fetchLocations };
}