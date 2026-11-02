import type { Unit } from "./types";

const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
const nairaPrecise = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 });
const integer = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 });

export function formatMoney(value: number | null | undefined, precise = false): string {
  if (value === null || value === undefined) return "—";
  return (precise ? nairaPrecise : naira).format(value);
}

export function formatCompactMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `₦${compact.format(value)}`;
}

export function formatNumber(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined) return "—";
  return digits ? decimal.format(value) : integer.format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${decimal.format(value)}%`;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${decimal.format(Math.round(minutes * 10) / 10)} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${Math.round(minutes % 60)}m`;
}

export function formatValue(value: number | null | undefined, unit: Unit): string {
  switch (unit) {
    case "ngn":
      return formatMoney(value);
    case "percent":
      return formatPercent(value);
    case "seconds":
      return formatDuration(value);
    case "minutes":
      return value === null || value === undefined ? "—" : `${decimal.format(value)} min`;
    case "hours":
      return value === null || value === undefined ? "—" : `${decimal.format(value)} h`;
    case "days":
      return value === null || value === undefined ? "—" : `${decimal.format(value)} days`;
    case "km":
      return value === null || value === undefined ? "—" : `${decimal.format(value)} km`;
    case "ratio":
      return value === null || value === undefined ? "—" : `${decimal.format(value)} : 1`;
    case "rating":
      return value === null || value === undefined ? "—" : `${decimal.format(value)} ★`;
    default:
      return formatNumber(value, Number.isInteger(value ?? 0) ? 0 : 2);
  }
}

export function formatAxis(value: number, unit: Unit): string {
  if (unit === "ngn") return formatCompactMoney(value);
  if (unit === "percent") return `${value}%`;
  return compact.format(value);
}

export function formatDateLabel(bucket: string): string {
  const date = new Date(`${bucket}T00:00:00`);
  if (Number.isNaN(date.getTime())) return bucket;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleString("en-GB", { timeZone: "Africa/Lagos", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// KPIs where an increase is bad news; used to colour comparison chips.
const LOWER_IS_BETTER = new Set([
  "cancelled_trips", "request_cancellations", "cancellation_rate", "failed_bookings", "failed_booking_rate", "no_driver_available",
  "time_to_match", "pickup_wait", "promo_cost", "driver_cancellation_rate", "rider_churn", "passenger_complaints", "unanswered",
  "payment_failure_rate", "failed_payouts", "inactive_drivers", "dormant_drivers", "inactive_riders", "rider_cancellation_rate",
]);

// Neither direction is good or bad on its own; shown in grey.
const NEUTRAL = new Set(["trip_duration", "trip_distance", "cash_due", "fare_quotes", "rider_driver_ratio", "bonuses", "admin_adjustments", "trip_hours", "weekend"]);

export function isGoodChange(key: string, change: number): boolean | null {
  if (NEUTRAL.has(key)) return null;
  return LOWER_IS_BETTER.has(key) ? change < 0 : change > 0;
}

export const AVAILABILITY_LABEL: Record<string, string> = {
  captured_from_go_live: "Tracked from go-live",
  sampled_from_go_live: "Sampled from go-live",
  not_supported: "Not supported",
};

export const FILTER_LABEL: Record<string, string> = {
  area: "Location",
  ride_type: "Service category",
  payment_method: "Payment method",
  vehicle_type: "Vehicle type",
  driver_id: "Driver",
  rider_id: "Rider",
  status: "Trip status",
};
