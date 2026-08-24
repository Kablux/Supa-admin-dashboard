import type { IconType } from "react-icons";
import * as Icons from "@mui/icons-material";

export interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

export interface NavSection {
  title: string | null;
  items: NavItem[];
}

export interface Stat {
  id: string;
  label: string;
  value: string | number;
  icon: keyof typeof Icons;
  color: string;
  bg: string;
  description?: string;
  trendUp?: boolean;
  details?: {
    label: string;
    value: string | number;
  }[];
}

export interface Message {
  id: number;
  name: string;
  plate: string;
  complaint: string;
  time: string;
  avatar: string;
  read: boolean;
}

export interface MessagesData {
  drivers: Message[];
  riders: Message[];
}

export interface RideSummaryData {
  total: number;
  active: number;
  pending_verification: number;
  suspended: number;
}

export interface DriverSummaryData {
  total: number;
  online: number;
  suspended: number;
  pending_kyc: number;
  not_started_kyc: number;
  approved_kyc: number;
}

export interface LiveTripsSummary {
  active: number;
  completed: number;
  cancelled: number;
}

export const TAB_MAPPING = {
  all: "",
  active: "active",
  pending: "pending_verification",
  suspended: "suspended",
  cancelled: "deleted",
} as const;

export const DRIVER_TAB_MAPPING = {
  all: "",
  approved: "APPROVED",
  pending: "PENDING",
  review: "IN_REVIEW",
  rejected: "REJECTED",
} as const;

export const TRIP_TAB_MAPPING = {
  all: "",
  active: "driver_on_way",
  completed: "completed",
  cancelled: "cancelled",
} as const;

export const RIDE_REQUEST_TAB = {
  all: "",
  pending: "pending",
  searching: "searching",
  matched: "matched",
  cancelled: "cancelled",
  expired: "expired",
} as const;


export interface AnalyticsPoint {
  x: string;
  y: number;
}

export interface AnalyticsMetric {
  name: string;
  label: string;
  data: AnalyticsPoint[];
}

export interface TransactionAnalytics {
  range: string;
  currency: string;
  metrics: AnalyticsMetric[];
  summary: {
    total_income: number;
    total_expense: number;
  };
}

// NOTIFICATION TYPES
export type NotifCategory = "corporate" | "standard" | "premium";

export interface Reminder {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  avatar: string | null;
}

export interface NotificationItem {
  id: string;
  userName: string;
  userAvatar: string | null;
  date: string;
  message: string;
  read: boolean;
  category: NotifCategory;
}

export type SosTab = "drivers" | "riders";

export interface SosMessage {
  id: number;
  name: string;
  plate: string; // driver plate or rider name
  complaint: string;
  time: string;
  avatar: string | null;
  read: boolean;
}

export interface NotificationsState {
  reminders: Reminder[];
  sosMessages: { drivers: SosMessage[]; riders: SosMessage[] };
  notifications: NotificationItem[];
  activeSosTab: SosTab;
  activeCategory: NotifCategory;
}

////ADMIN ROLE

export type AdminRoleType =
  | "Support Agent"
  | "Operations Officer"
  | "Finance Officer"
  | "Fleet Manager"
  | "Corporate Manager"
  | "Compliance Officer"
  | "Driver Officer"
  | "Rider Officer"
  | "Engineering Officer";

export interface AdminRole {
  id: string;
  full_name: string;
  email: string;
  avatar: string | null;
  role: AdminRoleType;
  permission: boolean;
  created_at: string;
}

export interface AdminRoleSummary {
  role: string;
  count: number;
}

export interface AdminRoleState {
  roles: AdminRole[];
  summary: AdminRoleSummary[];
  isLoading: boolean;
  error: string | null;
}

// ── Premium Stat cards ────────────────────────────────────────────────────────────────

// export interface PremiumStat {
//   id: string;
//   label: string;
//   value: number;
//   icon: keyof typeof Icons;
//   color: string;
//   bg: string;
//   trend?: number;
// }
export interface PremiumStat {
  id: string;
  label: string;
  value: string | number;
  icon: keyof typeof Icons;
  color: string;
  bg: string;
  description?: string;
  details?: string[];
}

export interface PremiumTransaction {
  id: string;
  rider: string;
  avatar?: string;
  date: string;
  pickup: string;
  destination: string;
  status: string;
}

export interface PremiumState {
  stats: PremiumStat[];
  transactions: PremiumTransaction[];
  isLoading: boolean;
  error: string | null;
}

////CORPORATE TYPES
export interface CorporateStat {
  id: string;
  label: string;
  value: number;
  icon: keyof typeof Icons;
  color: string;
  bg: string;
}

export interface CorporateOwner {
  id: string;
  name: string;
  avatar: string | null;
  date: string;
  carName: string;
  carQty: number;
  amount: number;
}

export interface CorporateInfo {
  companyName: string;
  contactPerson: string;
  staff: number;
  accountBalance: number;
  uniqueCode: string;
  year: number;
}

export interface CorporateState {
  stats: CorporateStat[];
  owners: CorporateOwner[];
  companyInfo: CorporateInfo | null;
  isLoading: boolean;
  error: string | null;
}

////FLEET TYPES
export interface FleetStat {
  id: string;
  label: string;
  value: number;
  icon: keyof typeof Icons;
  color: string;
  bg: string;
}

export interface FleetVehicle {
  id: string;
  name: string;
  model: string;
  amount: number;
  year: number;
  insuranceYear: number;
  plateNumber: string;
  image: string;
  inspectionReminder?: string;
}

export interface FleetReminder {
  id: string;
  avatar: string | null;
  title: string;
  subtitle: string;
  time: string;
}

export interface VehiclePairing {
  id: string;
  avatar: string | null;
  title: string;
  subtitle: string;
  time?: string;
}

export interface FleetOwner {
  id: string;
  name: string;
  avatar?: string;
  date: string;
  car: string;
  quantity: number;
  earning: number;
}

export interface FleetStatus {
  active: number;
  offline: number;
  blocked: number;
}

export interface FleetState {
  stats: FleetStat[];
  vehicles: FleetVehicle[];
  gallery: string[];
  reminders: FleetReminder[];
  pairings: VehiclePairing[];
  owners: FleetOwner[];
  status: FleetStatus;
  isLoading: boolean;
}

/////Inspection
export type InspectionStatus = "approved" | "pending" | "failed";
export type CarCategory = "Premium" | "Business" | "Standard" | "Economy";
export interface InspectedCar {
  id: string;
  make: string;
  model: string;
  category: CarCategory;
  imageUrl: string | null;
  engineSize: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  originalPricePerDay?: number;
  status: InspectionStatus;
  isFavourite: boolean;
  submittedAt: string;
  inspectedAt?: string;
  ownerName: string;
  ownerAvatar: string | null;
  notes?: string;
}

// ── Top-5 chart data ──────────────────────────────────────────────────────────

export interface CarTypeStats {
  label: string;
  count: number;
  color: string;
  percentage: number;
}

export type InspectionFilter = "all" | InspectionStatus;

export interface InspectionState {
  cars: InspectedCar[];
  filter: InspectionFilter;
  search: string;
  carTypeStats: CarTypeStats[];
  totalInspectedValue: number;
}

///Driver ActionPAYLOAD
export interface ActionDriverPayload {
  rating: string;
  kyc_status: string;
  is_online: boolean;
  ready_for_dispatch: boolean;
}

/////RideRequest
export interface RideDispatch {
  id: string;
  driver_id: string;
  driver: string;
  status: "sent" | "accepted" | "rejected" | "expired" | "timeout" | string;
  dispatched_at: string;
  responded_at: string | null;
  price_updated: boolean;
  distance_to_pickup: string;
}

export interface RideRequestList {
  id: string;
  rider: string;
  status: string;
  type: string;
  pickup_address: string;
  dropoff_address: string;
  estimated_fare: string;
  rider_offer: string;
  payment_method: string;
  is_scheduled: boolean;
  is_expired: boolean;
  created_at: string;
  expires_at: string;
  dispatches: RideDispatch[];
}

export interface RideRequestDetail extends RideRequestList {
  rider_id: string;
  pickup_lat: string;
  pickup_lng: string;
  dropoff_lat: string;
  dropoff_lng: string;
  calculated_base_fare: string;
  estimated_distance: string;
  estimated_duration: number;
  schedule_date: string | null;
  schedule_time: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  is_eligible_for_promotion: boolean;
  promotional_discount_amount: string;
  has_stops: boolean;
  stops: string;
  ride_id: string | null;
  updated_at: string;
}

export interface RideRequestQueryParams {
  dispatch_status?: string;
  driver?: string;
  period?: "today" | "yesterday" | "this_week" | "this_month" | "";
  created_at_after?: string;
  created_at_before?: string;
  is_expired?: boolean | string;
  is_scheduled?: boolean | string;
  ordering?: string;
  page?: number;
  page_size?: number;
  payment_method?: string;
  rider?: string;
  search?: string;
  status?: string;
  type?: string;
}

export interface PaginatedRideRequests {
  count: number;
  next: string | null;
  previous: string | null;
  results: RideRequestList[];
}

export interface RideRequestSummaryData {
  total: number;
  pending: number;
  searching: number;
  matched: number;
  cancelled: number;
  expired: number;
}

export interface RideRequestSummaryResponse {
  data: RideRequestSummaryData;
}

///settings
export interface RideTypePricing {
  per_km: string;
  base_fare: string;
  per_minute: string;
  max_surge: string;
}
 
export interface GlobalConfig {
  base_fare: string;
  commission_rate: string;
  max_surge: string;
  driver_earning_percent: string;
  ride_request_ttl: number;
  driver_offer_ttl: number;
  // keyed by ride-type name, e.g. "standard" | "premium" | "luxury"
  ride_type_pricing: Record<string, RideTypePricing>;
  // free-form key/value settings, e.g. admin_base_url, kyc_reviewer_email
  extra: Record<string, string>;
}

/////Referrals
export interface ReferralSummaryData {
  total: number;
  rider: number;
  driver: number;
}

export interface ReferralSummaryResponse {
  data: ReferralSummaryData;
}

export const REFERRALS_TAB = {
  all: "",
  rider: "rider",
  driver: "driver",
} as const;

export interface ReferralUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  referral_code: string;
  status: string;
}

// Update your main Referral interface
export interface Referral {
  id: string;
  user: ReferralUser;          
  referred_user: ReferralUser; 
  role: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedReferralResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Referral[];
}

export interface ReferralQueryParams {
  created_at_after?: string;
  created_at_before?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  period?: "today" | "yesterday" | "this_week" | "this_month";
  referred_user?: string;
  role?: string;
  search?: string;
  user?: string;
}

export interface ReferralState {
  referrals: Referral[];
  selectedReferral: Referral | null;
  totalCount: number;
  loading: boolean;
  error: string | null;
}

export interface DriverLocation {
  driver_id: string;
  name: string;
  phone_number: string;
  lat: number;
  lng: number;
}

export interface DriverLocationsResponse {
  data: DriverLocation[];
}

///Retention Response
export interface BroadcastRetentionResponse {
  notified: number;
  queued: boolean;
  unknown_ids: string[];
}

////courier
export interface FinancePoint {
  month: string;
  income: number;
  expenses: number;
}

export interface Shipment {
  id: string;
  name: string;
  avatar?: string;
  date: string;
  pickup: string;
  destination: string;
  status: "Completed" | "In Transit" | "Pending" | "Cancelled";
}