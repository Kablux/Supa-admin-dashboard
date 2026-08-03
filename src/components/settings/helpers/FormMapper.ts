import { GlobalConfig, RideTypePricing } from "../../../types/common.types";
export interface RideTypeRow extends RideTypePricing {
  name: string;
}
/** Local form shape for the settings page (all inputs as strings). */
export interface FormState {
  base_fare: string;
  commission_rate: string;
  max_surge: string;
  driver_earning_percent: string;
  ride_request_ttl: string;
  driver_offer_ttl: string;
  rideTypes: RideTypeRow[];
  extra: Record<string, string>;
}

/** API config -> editable form. Ride-type map becomes an array for editing. */
export const toForm = (c: GlobalConfig): FormState => ({
  base_fare: c.base_fare ?? "",
  commission_rate: c.commission_rate ?? "",
  max_surge: c.max_surge ?? "",
  driver_earning_percent: c.driver_earning_percent ?? "",
  ride_request_ttl:
    c.ride_request_ttl != null ? String(c.ride_request_ttl) : "",
  driver_offer_ttl:
    c.driver_offer_ttl != null ? String(c.driver_offer_ttl) : "",
  rideTypes: Object.entries(c.ride_type_pricing ?? {}).map(([name, p]) => ({
    name,
    per_km: p.per_km ?? "",
    base_fare: p.base_fare ?? "",
    per_minute: p.per_minute ?? "",
    max_surge: p.max_surge ?? "",
  })),
  extra: { ...(c.extra ?? {}) },
});

/** Editable form -> API config. Ride-type array becomes a keyed map. */
export const toConfig = (f: FormState): GlobalConfig => ({
  base_fare: f.base_fare,
  commission_rate: f.commission_rate,
  max_surge: f.max_surge,
  driver_earning_percent: f.driver_earning_percent,
  ride_request_ttl: parseInt(f.ride_request_ttl || "0", 10),
  driver_offer_ttl: parseInt(f.driver_offer_ttl || "0", 10),
  ride_type_pricing: f.rideTypes.reduce(
    (acc, r) => {
      const key = r.name.trim();
      if (key)
        acc[key] = {
          per_km: r.per_km,
          base_fare: r.base_fare,
          per_minute: r.per_minute,
          max_surge: r.max_surge,
        };
      return acc;
    },
    {} as Record<string, RideTypePricing>,
  ),
  extra: f.extra,
});
