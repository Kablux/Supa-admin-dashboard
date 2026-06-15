// ─────────────────────────────────────────────
// Login form (UI layer)
// ─────────────────────────────────────────────
export interface LoginFormValues {
  email: string;
  password: string;
  role: string;
  // remember: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  role?: string;
}

export type AuthStatus = "idle" | "submitting" | "error" | "success";

// ─────────────────────────────────────────────
// API payloads — shaped exactly to the API docs
// ─────────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

// Status values returned by the API for a user record
export type UserStatus =
  | "pending_verification"
  | "active"
  | "suspended"
  | "deactivated";

// Role values returned by the API
export type UserRole = "business_admin" | "driver" | "rider";

// Matches GET /api/v1/business-admin/users/{id}/ response exactly
export interface AdminUser {
  id: string;
  email: string;
  status: UserStatus;
  phone_number: string;
  rating: string;
  role: UserRole;
}

// Matches GET /api/v1/business-admin/users/ paginated response
export interface PaginatedUsers {
  count: number;
  next: string | null; // URL string or null when on last page
  previous: string | null; // URL string or null when on first page
  results: AdminUser[];
}

// Shape of the login API response — access + refresh tokens,
// plus optionally the logged-in user's own record
export interface LoginResponse {
  access: string;
  refresh?: string;
  user?: AdminUser;
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

// export interface AuthState {
//   user: any;
//   token: string | null;
//   loading: boolean;
// }

// export interface LoginPayload {
//   email: string;
//   password: string;
// }

// export interface AdminUser {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
// }

// export interface LoginResponse {
//   access: string;
//   refresh?: string;
//   user: AdminUser;
// }
