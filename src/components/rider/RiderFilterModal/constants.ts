import { RiderPeriod, RiderActivitySegment } from "../../../types/auth";


export const PERIOD_OPTIONS: { value: RiderPeriod | ""; label: string }[] = [
  { value: "", label: "All time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This week" },
  { value: "this_month", label: "This month" },
];

export const ACTIVITY_SEGMENT_OPTIONS: { value: RiderActivitySegment | ""; label: string }[] = [
  { value: "", label: "All segments" },
  { value: "never_requested", label: "Never requested" },
  { value: "completed_one_ride", label: "Completed one ride" },
  { value: "cancelled_request", label: "Cancelled request" },
  { value: "expired_unmatched", label: "Expired / Unmatched" },
];

export const FCM_OPTIONS: { value: "" | "true" | "false"; label: string }[] = [
  { value: "", label: "All" },
  { value: "true", label: "Active FCM (Yes)" },
  { value: "false", label: "No FCM (No)" },
];

export const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
  { value: "pending", label: "Pending" },
];

export const ORDERING_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Default order" },
  { value: "-created_at", label: "Newest first (-created_at)" },
  { value: "created_at", label: "Oldest first (created_at)" },
  { value: "-rating", label: "Highest rating (-rating)" },
  { value: "rating", label: "Lowest rating (rating)" },
  { value: "-completed_rides", label: "Most completed rides (-completed_rides)" },
  { value: "-loyalty_points", label: "Highest loyalty points (-loyalty_points)" },
];

export const periodLabel = (v?: string) =>
  PERIOD_OPTIONS.find((o) => o.value === v)?.label ?? v ?? "";

export const segmentLabel = (v?: string) =>
  ACTIVITY_SEGMENT_OPTIONS.find((o) => o.value === v)?.label ?? v ?? "";

export const fcmLabel = (v?: string) =>
  FCM_OPTIONS.find((o) => o.value === v)?.label ?? v ?? "";

export const statusLabel = (v?: string) =>
  STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v ?? "";

export const orderingLabel = (v?: string) =>
  ORDERING_OPTIONS.find((o) => o.value === v)?.label ?? v ?? "";