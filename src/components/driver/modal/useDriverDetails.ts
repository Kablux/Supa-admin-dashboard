import { useEffect, useState } from "react";
import { fetchDriverDetails } from "../../../api/xhr";
import { Driver } from "../../../types/auth";

export function useDriverDetails(driverId: string | null, isOpen: boolean) {
  const [loading, setLoading] = useState(false);
  const [driverData, setDriverData] = useState<Driver | null>(null);

  useEffect(() => {
    if (isOpen && driverId) {
      setLoading(true);
      fetchDriverDetails(driverId)
        .then((data) => setDriverData(data))
        .catch((err) => console.error("Failed to fetch driver details", err))
        .finally(() => setLoading(false));
    } else {
      setDriverData(null);
    }
  }, [isOpen, driverId]);

  return { driverData, loading };
}