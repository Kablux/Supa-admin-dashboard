export type Availability = "available" | "captured_from_go_live" | "sampled_from_go_live" | "not_supported";
export type Unit = "count" | "percent" | "ngn" | "seconds" | "minutes" | "hours" | "days" | "km" | "ratio" | "rating" | string;

export interface Metric {
  key: string;
  label: string;
  value: number | null;
  previous: number | null;
  change_pct: number | null;
  unit: Unit;
  availability: Availability;
  note: string | null;
}

export interface PeriodInfo {
  key: string;
  label: string;
  start: string;
  end: string;
  days: number;
}

export interface FilterInfo {
  applied: Record<string, string>;
  not_applicable: string[];
}

export interface Freshness {
  last_refreshed_at: string | null;
  last_refresh_kind: string | null;
  history_starts: string | null;
  has_data: boolean;
}

export interface Envelope {
  period: PeriodInfo;
  comparison: PeriodInfo | null;
  filters: FilterInfo;
  freshness: Freshness;
}

export type SeriesRow = { bucket: string } & Record<string, number | string>;

export interface Insight {
  key: string;
  section: string;
  tone: "positive" | "negative" | "neutral";
  headline: string;
  explanation: string;
  note?: string | null;
  evidence: { label: string; value: number | null; previous: number | null; change_pct: number | null; unit: Unit }[];
  area?: string;
}

export interface AlertItem {
  id: string;
  rule_key: string;
  category: string;
  severity: "info" | "warning" | "critical";
  status: "open" | "acknowledged" | "resolved";
  title: string;
  description: string;
  metric: string;
  investigation: string;
  observed_value: number | null;
  baseline_value: number | null;
  change_pct: number | null;
  window_start: string;
  window_end: string;
  detected_at: string;
  note: string;
}

export interface LiveSnapshot {
  as_of: string;
  registered_riders: number;
  registered_drivers: number;
  drivers: Record<string, number>;
  trips: Record<string, number>;
}

export interface AnalyticsMe {
  enabled: boolean;
  capture_enabled: boolean;
  role: string | null;
  role_label: string | null;
  permissions: string[];
  sections: string[];
  periods: { key: string; label: string }[];
  timezone: string;
}

export interface KpiDefinition {
  key: string;
  label: string;
  section: string;
  definition: string;
  formula: string;
  source: string;
  date_field: string;
  included: string;
  excluded: string;
  missing_data: string;
  unit: Unit;
  availability: Availability;
}

export interface Person {
  name: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface Paged<T> {
  count: number;
  page: number;
  page_size: number;
  results: T[];
}
