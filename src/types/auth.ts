// export interface LoginFormValues {
//   email: string;
//   password: string;
//   role: string;

import { LiveTripsSummary, RideSummaryData, TransactionAnalytics } from "./common.types";

// }

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
  liveTrips: number;
  liveTripsSummary: LiveTripsSummary;
  usersummary: RideSummaryData;
  driversummary: RideSummaryData;
  ridersummary: RideSummaryData;
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

export interface Driver {
  id: string;
  email: string;
  status: string;
  phone_number: string;
  address: string;
  rating: string;
  role: string;
  full_name: string;
  profile_picture: string;
  profile_picture_url: string;
  loyalty_points: string;
  mileage_points: string;
  mileage_point: string;
  total_rides: string;
  total_ride: string;
  completed_rides: string;
  cancelled_rides: string;
  vehicle_information: string;
  vehicle: string;
  transfer_recipient: string;
  total_amount: string;
}

// Matches GET /api/v1/business-admin/users/ paginated response
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

export interface PaginatedRides {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ride[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
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
}

export interface RiderQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: "active" | "pending_verification" | "suspended" | "deleted" | "";
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
