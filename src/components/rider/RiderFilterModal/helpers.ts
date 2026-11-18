import { RiderFilterState } from "../../../types/auth";

function toIsoStartOfDay(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  if (dateStr.includes("T")) return dateStr;
  return `${dateStr}T00:00:00.000Z`;
}

function toIsoEndOfDay(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  if (dateStr.includes("T")) return dateStr;
  return `${dateStr}T23:59:59.999Z`;
}

export function buildRiderQueryParams(filters: RiderFilterState) {
  return {
    activity_segment: filters.activity_segment || undefined,
    has_fcm:
      filters.has_fcm === "true"
        ? true
        : filters.has_fcm === "false"
        ? false
        : undefined,
    status: filters.status?.trim() || undefined,
    tier: filters.tier?.trim() || undefined,
    ordering: filters.ordering || undefined,
    period: filters.period || undefined,
    created_at_after: toIsoStartOfDay(filters.created_at_after),
    created_at_before: toIsoEndOfDay(filters.created_at_before),
  };
}