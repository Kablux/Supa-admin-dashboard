import {
  DriverSummaryData,
  LiveTripsSummary,
  ReferralSummaryData,
  RideRequestSummaryData,
  RideSummaryData,
  TransactionAnalytics,
} from "./common.types";

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}
export interface LoginFormErrors {
  email?: string;
  password?: string;
  role?: string;
}

export type AuthStatus = "idle" | "submitting" | "error" | "success";

export interface DashboardState {
  totalDrivers: number;
  totalUsers: number;
  // liveTrips: number;
  liveTripsSummary: LiveTripsSummary;
  referralsSummary: ReferralSummaryData;
  usersummary: RideSummaryData;
  driversummary: DriverSummaryData;
  ridersummary: RideSummaryData;
  requestsummary: RideRequestSummaryData;
  isLoading: boolean;
  error: string | null;
  analytics: TransactionAnalytics | null;
  analyticsLoading: boolean;
}

export type UserStatus =
  | "pending_verification"
  | "active"
  | "suspended"
  | "deactivated";

export type UserRole = "business_admin" | "driver" | "rider";

export interface AdminUser {
  id: string;
  email: string;
  status: UserStatus;
  phone_number: string;
  rating: string;
  role: UserRole;
}

export interface LoginResponse {
  message: string;
  data: {
    user: AdminUser;
    access: string;
    refresh: string;
  };
}

export interface Ride {
  id: string;
  driver: string;
  rider: string;
  dropoff_address: string;
  pickup_address: string;
  agreed_fare: string;
  fare: string;
  status: string;
  start_time: string;
  end_time: string;
  arrived_at: string;
  cancellation_reason: string;
  cancelled_by: string;
}

export interface Rider {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  address: string;
  rating: string;
  profile_image: string;
  profile_image_url: string;
  loyalty_points: string;
  total_rides: string;
  total_of_rides: string;
  completed_rides: string;
  number_of_completed_rides: string;
  cancelled_rides: string;
  number_of_cancelled_rides: string;
  status: string;
}

export interface VehicleImage {
  image_type: "interior" | "left" | "back" | "front" | string;
  image_url: string;
  status: string;
}

export interface VehicleCondition {
  is_car_in_good_condition: boolean;
  is_ac_working: boolean;
  is_interior_neat: boolean;
  car_body_condition: string;
}

export interface DriverVehicle {
  id: string;
  model: string;
  year: string;
  plate_number: string;
  color: string;
  vehicle_info: VehicleCondition;
  status: string;
  images: VehicleImage[];
}

export interface TransferRecipient {
  recipient_code: string;
  bank_code: string;
  account_number: string;
  account_name: string;
}

export interface DriverDocument {
  id: string;
  doc_type: string;
  status: string;
  file_url: string;
  rejection_reason: string;
  expiry_date: string | null;
  reviewed_at: string | null;
}

export interface Driver {
  id: string;
  email: string;
  status: string;
  kyc_status: string;
  phone_number: string;
  address: string;
  rating: string;
  role: string;
  full_name: string;
  profile_picture: string;
  profile_picture_url: string;
  loyalty_points: number;
  mileage_points: number;
  mileage_point: number;
  total_rides: number;
  total_ride: number;
  completed_rides: number;
  cancelled_rides: number;
  vehicle: DriverVehicle | null;
  vehicles: DriverVehicle[];
  transfer_recipient: TransferRecipient | null;
  total_amount: number;
  is_online: boolean;
  ready_for_dispatch: boolean;
  documents: DriverDocument[];
  current_location?: {
    lat: number;
    lng: number;
    last_updated?: string;
  };
}

export interface PaginatedRides {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ride[];
}

export interface PaginatedUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUser[];
}

export interface PaginatedDrivers {
  count: number;
  next: string | null;
  previous: string | null;
  results: Driver[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface RiderQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: "active" | "pending_verification" | "suspended" | "deleted" | "";
    tier?: string; 
  period?: "today" | "yesterday" | "this_week" | "this_month" | "";
  created_at_after?: string;
  created_at_before?: string;
}

export interface DriverQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: "active" | "pending_verification" | "suspended" | "deleted" | "";
   period?: "today" | "yesterday" | "this_week" | "this_month" | "";
  kyc_status?: "APPROVED" | "PENDING" | "IN_REVIEW" | "REJECTED" | "";
   type?: string; // standard / premium
  is_online?: boolean | string;
  tier?: string; // mileage tier
  created_at_after?: string;
  created_at_before?: string;
  kyc_approval_date_after?: string;
  kyc_approval_date_before?: string;
}
// ─────────────────────────────────────────────
// Redux slice state
// ─────────────────────────────────────────────
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: RequestStatus;
  error: string | null;
  isAuthenticated: boolean;
}

///TRIPS
export interface Trip {
  id: string;
  driver: string;
  rider: string;
  pickup_address: string;
  dropoff_address: string;
  agreed_fare: string;
  fare: string;
  status: "driver_on_way" | "arrived" | "started" | "completed" | "cancelled";
  start_time: string;
  end_time: string;
  arrived_at: string;
  cancellation_reason: string;
  cancelled_by: string;
}

export type TripFiltersState = Omit<
  TripQueryParams,
  "page" | "page_size" | "search" | "status"
>;

export interface TripQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  payment_method?: string;
  driver?: string;
  rider?: string;
  created_at_after?: string;
  created_at_before?: string;
  start_time_after?: string;
  start_time_before?: string;
}

export interface PaginatedTripsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Trip[];
}
