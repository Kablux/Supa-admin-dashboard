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

export interface RiderSummaryData {
  total: number;
  active: number;
  suspended: number;
  pending_verification: number;
  never_requested: number;
  expired_unmatched: number;
  cancelled_request: number;
  completed_one_ride: number;
}

export interface UserSummaryData {
  total: number;
  active: number;
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


/////fund driver wallet
export interface FundDriverWalletsPayload {
  driver_ids: string[];
  amount: string;
  note: string;
}

export interface FundDriverWalletsResponse {
  message: string;
  data: {
    amount: string;
    group_reference: string;
    funded_count: number;
    funded: {
      driver_id: string;
      wallet_id: string;
      transaction_id: string;
      reference: string;
      available_balance: string;
    }[];
  };
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

/////Transaction
export interface Transaction {
  id: string;
  reference: string;
  type: string;
  amount: string;
  direction: "credit" | "debit";
  status: string;
  channel: string;
  user_email: string;
  user_name: string;
  user_type: string;
  created_at: string;
}

export interface TransactionsResultContainer {
  count: number;
  next: string | null;
  previous: string | null;
  results: Transaction[];
  total_income?: string;
  total_expense?: string;
}

export interface TransactionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TransactionsResultContainer[];
  total_income?: string;
  total_expense?: string;
}


export interface TransactionAnalyticsResponse {
  range: string;
  currency: string;
  metrics: {
    name: string;
    label: string;
    data: { x: string; y: number }[];
  }[];
  summary: {
    total_income: number;
    total_expense: number;
  };
}

export interface FetchTransactionsParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  type?: string;
  direction?: string;
  channel?: string;
  user_role?: string;
  fund_source?: string;
  created_at_after?: string;
  created_at_before?: string;
  ordering?: string;
}

export interface AnalyticsPoint {
  x: string;
  y: number;
}

export interface AnalyticsMetric {
  name: string;
  label: string;
  data: AnalyticsPoint[];
}

export type AnalyticsRange = "week" | "month" | "year";

export interface TransactionAnalytics {
  range: string;
  currency: string;
  metrics: AnalyticsMetric[];
  summary: {
    total_income: number;
    total_expense: number;
  };
}

export interface TransactionFilterState {
  type?: string;
  direction?: string;
  status?: string;
  channel?: string;
  user_role?: string;
  fund_source?: string;
  created_at_after?: string;
  created_at_before?: string;
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

////Bannner
// ── Enum values from the API ──────────────────────────────────────────────────
export interface UploadFile {
  id: string;
  file: string;
  name: string;
  owner: string;
}

export interface UploadResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UploadFile[];
}

export type BannerAudience = 'all' | 'driver' | 'rider';

export type BannerCtaType =
  | 'NONE'
  | 'URL'
  | 'SCREEN'


export interface Banner {
  id: string;
  title: string;
  body: string;
  image_small: string;   
  image_large: string;   
  image_url: string;     
  audience: BannerAudience;
  is_active: boolean;
  sort_order: number;
  starts_at: string | null;   
  ends_at: string | null;    
  is_clickable: boolean;
  cta_type: BannerCtaType;
  cta_value: string;
  created_at: string;
  updated_at: string;
}


export interface BannerPayload {
  title: string;
  body: string;
  image_small: string;
  image_large: string;
  audience: BannerAudience;
  is_active: boolean;
  sort_order: number;
  starts_at: string;
  ends_at: string;
  is_clickable: boolean;
  cta_type: BannerCtaType;
  cta_value: string;
}

export interface BannerFormErrors {
  title?: string;
  body?: string;
  audience?: string;
  starts_at?: string;
  ends_at?: string;
  cta_value?: string;
}


export interface BannersQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  audience?: BannerAudience | '';
  is_active?: boolean | '';
  ordering?: string;
}


export type BannersRequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface BannersState {
  list: Banner[];
  count: number;
  currentPage: number;
  pageSize: number;
  search: string;
  audienceFilter: BannerAudience | '';
  activeFilter: boolean | '';
  listStatus: BannersRequestStatus;
  mutateStatus: BannersRequestStatus; 
  error: string | null;
  mutateError: string | null;
}


////courier types
export interface BaseApiCourierResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  errors?: Record<string, string[]>;
  error_code?: string;
}

export interface PaginatedCourierResponse<T> {
  count: number;
  page: number;
  page_size: number;
  results: T[];
}

export interface CourierUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  user_type: string;
  account_status: string;
  city: string | null;
  state: string | null;
  date_joined: string;
  referral_code: string;
}

export interface CourierGuarantor {
  slot: number;
  full_name: string;
  phone_number: string;
  status: string;
}

export interface CourierRider extends CourierUser {
  gender?: string | null;
  profile_photo?: string | null;
  date_of_birth?: string | null;
  
  // KYC & Verification
  kyc_status: string;
  kyc_submitted_at: string | null;
  kyc_rejection_reason?: string | null;
  is_approved: boolean;
  approval_date?: string | null;
  available_to_receive_order: boolean;

  // Media / Document URLs
  rider_permit_url?: string | null;
  government_id_front_url?: string | null;
  vehicle_picture_url?: string | null;

  // Vehicle Information
  vehicle_type: string;
  vehicle_brand?: string | null;
  vehicle_registration_number: string | null;
  rating?: number | null;

  // Next of Kin & Guarantors
  next_of_kin_full_name?: string | null;
  next_of_kin_phone_number?: string | null;
  guarantors?: CourierGuarantor[];

  // Work Experience
  previous_place_of_work?: string | null;
  years_worked?: string | null;
}

// Alias Rider to CourierRider to avoid duplicate interfaces across components
export type Rider = CourierRider;

export interface CourierReferral {
  id: string;
  created_at: string;
  referrer: CourierUser;
  referred: CourierUser;
}

export interface ApproveKycResponse {
  id: string;
  email: string;
  account_status: string;
  kyc_status: string;
  is_approved: boolean;
  approval_date: string;
}

////SOS
export type SosStatus = "OPEN" | "RESOLVED" | "IN_PROGRESS" | string;

export interface SosRideInfo {
  id: string;
  pickup_address: string;
  dropoff_address: string;
  status: string;
  rider: string;
  driver: string;
}

export interface SosUserInfo {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone_number: string;
}

export interface SosAudioInfo {
  id: string;
  audio_file: string;
  duration_seconds: number;
  created_at: string;
}

export interface SosIncident {
  id: string;
  status: SosStatus;
  reason?: string;
  created_at: string;
  updated_at: string;
  ride: SosRideInfo | null;
  triggered_by: SosUserInfo | null;
  audio: SosAudioInfo | null;
}

export interface PaginatedSosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SosIncident[];
}

export interface FetchSosParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  ride?: string;
  triggered_by?: string;
  created_at_after?: string;
  created_at_before?: string;
  ordering?: string;
}

export interface SosState {
  items: SosIncident[];
  count: number;
  currentPage: number;
  pageSize: number;
  search: string;
  statusFilter: string;
  rideFilter: string;
  triggeredByFilter: string;
  createdAtAfter: string;
  createdAtBefore: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}




// Query Parameters
export interface FetchRidersParams {
  page?: number;
  page_size?: number;
  search?: string;
  account_status?: string;
  kyc_status?: string;
  vehicle_type?: string;
  is_approved?: boolean;
  available_to_receive_order?: boolean;
}

export interface FetchUsersParams {
  page?: number;
  page_size?: number;
  search?: string;
  account_status?: string;
  user_type?: string;
}

export interface FetchReferralsParams {
  page?: number;
  page_size?: number;
  search?: string;
  referrer_id?: string;
  referrer_user_type?: string;
  referred_id?: string;
  referred_user_type?: string;
}

/////PROMOTIONS
export type DiscountType = "FIXED" | "PERCENTAGE";

export interface Promotion {
  id: string;
  name: string;
  code: string;
  description: string;
  applies_to: string;
  discount_type: DiscountType;
  discount_value: string | number;
  max_eligible_amount: string | number;
  priority: number;
  is_active: boolean;
  status: string;
  start_date: string;
  end_date: string;
  max_redemptions: number;
  is_clickable: boolean;
  cta_type: string;
  cta_value: string;
  redemption_count: number;
  unique_redeemer_count: number;
  total_discount_given: string;
  created_at: string;
  updated_at: string;
}

export interface PromotionSummaryPromo {
    id: string;
    name: string;
    code: string;
    is_active: boolean;
    status: string;
    redemption_count: number;
    unique_redeemer_count: number;
    total_discount_given: string;
    max_redemptions: number | null;
}

export interface PromotionSummary {
  total_promos: number;
  active: number;
  inactive: number;
  expired: number;
  scheduled: number;
  total_redemptions: number;
  unique_redeemers: number;
  total_discount_given: string;
  promos: PromotionSummaryPromo[];
}

export interface PromotionUsage {
  id: string;
  promotion: string;
  promotion_name: string;
  promotion_code: string;
  user: string;
  user_email: string;
  ride: string;
  original_amount: string;
  discount_amount: string;
  final_amount: string;
  applied_at: string;
  created_at: string;
}

export interface FetchPromotionsParams {
  page?: number;
  page_size?: number;
  search?: string;
  discount_type?: DiscountType | "";
  is_active?: boolean | string;
  ordering?: string;
}

export interface CreatePromotionPayload {
  name: string;
  code: string;
  description?: string;
  applies_to?: string;
  discount_type: DiscountType;
  discount_value: number | string;
  max_eligible_amount?: number | string;
  priority?: number;
  is_active?: boolean;
  start_date: string;
  end_date: string;
  max_redemptions?: number;
  is_clickable?: boolean;
  cta_type?: string;
  cta_value?: string;
}