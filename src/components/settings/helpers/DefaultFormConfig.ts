import { GlobalConfig } from "../../../types/common.types";
import { toForm } from "./FormMapper";

/* fallback if the GET fails.*/
export const DEFAULT_CONFIG: GlobalConfig = {
  base_fare: "400.00",
  commission_rate: "0.00",
  max_surge: "1.00",
  driver_earning_percent: "100.00",
  ride_request_ttl: 900,
  driver_offer_ttl: 600,
  ride_type_pricing: {
    luxury: {
      per_km: "800",
      base_fare: "2200",
      max_surge: "4.0",
      per_minute: "70",
    },
    premium: {
      per_km: "230",
      base_fare: "600",
      max_surge: "3.5",
      per_minute: "40",
    },
    standard: {
      per_km: "400",
      base_fare: "1800",
      max_surge: "3.0",
      per_minute: "30",
    },
  },
  extra: {
    admin_base_url: (import.meta.env.VITE_API_BASE_URL || "").replace(
      /\/api\/v1\/?$/,
      "",
    ),
    kyc_reviewer_email: "adeshina@kabluxe.com",
  },
};

export const DEFAULT_FORM = toForm(DEFAULT_CONFIG);
