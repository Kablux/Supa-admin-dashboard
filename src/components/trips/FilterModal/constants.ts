export type TripStatus =
  | "driver_on_way"
  | "arrived"
  | "started"
  | "completed"
  | "cancelled";

export type TripPeriod = "today" | "yesterday" | "this_week" | "this_month" | "";

export interface TripFilterState {
  status?: TripStatus;
  payment_method?: string;
  driver?: string;
  rider?: string;
  period?: TripPeriod;
  created_at_after?: string;
  created_at_before?: string;
  start_time_after?: string;
  start_time_before?: string;
}

export type FilterOption = { value: string; label: string };

export interface FilterChipItem {
  key: keyof TripFilterState;
  label: string;
}

export const TRIP_STATUS_OPTIONS: FilterOption[] = [
  { value: "driver_on_way", label: "Driver On Way" },
  { value: "arrived", label: "Arrived" },
  { value: "started", label: "Started" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const PAYMENT_METHOD_OPTIONS: FilterOption[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "wallet", label: "Wallet" },
];

export const PERIOD_OPTIONS: FilterOption[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
];

export const labelFor = (options: FilterOption[], value?: string) =>
  options.find((o) => o.value === value)?.label ?? value ?? "";

export const countActiveFilters = (f: TripFilterState) =>
  Object.values(f).filter((v) => v !== undefined && v !== "").length;

export const buildTripFilterChips = (f: TripFilterState): FilterChipItem[] => {
  const list: FilterChipItem[] = [];
  if (f.status)
    list.push({
      key: "status",
      label: `Status: ${labelFor(TRIP_STATUS_OPTIONS, f.status)}`,
    });
  if (f.payment_method)
    list.push({
      key: "payment_method",
      label: `Payment: ${labelFor(PAYMENT_METHOD_OPTIONS, f.payment_method)}`,
    });
  if (f.rider) list.push({ key: "rider", label: `Rider: ${f.rider}` });
  if (f.driver) list.push({ key: "driver", label: `Driver: ${f.driver}` });
  if (f.period)
    list.push({
      key: "period",
      label: `Period: ${labelFor(PERIOD_OPTIONS, f.period)}`,
    });
  if (f.created_at_after)
    list.push({
      key: "created_at_after",
      label: `Created >= ${f.created_at_after}`,
    });
  if (f.created_at_before)
    list.push({
      key: "created_at_before",
      label: `Created <= ${f.created_at_before}`,
    });
  if (f.start_time_after)
    list.push({
      key: "start_time_after",
      label: `Started >= ${f.start_time_after}`,
    });
  if (f.start_time_before)
    list.push({
      key: "start_time_before",
      label: `Started <= ${f.start_time_before}`,
    });
  return list;
};