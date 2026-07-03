import api from "./axios";
import {
  LoginCredentials,
  LoginResponse,
  AdminUser,
  PaginatedUsers,
  PaginatedDrivers,
  PaginatedRides,
  RiderQueryParams,
  PaginatedResponse,
  Rider,
  DriverQueryParams,
  Driver,
  TripQueryParams,
  PaginatedTripsResponse,
} from "../types/auth";
import { cleanQueryParams } from "../utils/hook";
import { AdminRole, TransactionAnalytics } from "../types/common.types";

export interface SummaryResponse {
  data: {
    total: number;
    active: number;
    suspended: number;
  };
}

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/business-admin/auth/login/",
    credentials,
  );
  return data;
}

export async function logoutRequest(refresh: string): Promise<void> {
  await api.post("/auth/logout/", { refresh });
}
export async function getTransactionAnalytics(
  range: "week" | "month" | "year" = "month",
): Promise<TransactionAnalytics> {
  const { data } = await api.get("/business-admin/transactions/analytics/", {
    params: { range },
  });

  return data;
}

export async function getUserList(): Promise<PaginatedUsers> {
  const { data } = await api.get<PaginatedUsers>(
    "/business-admin/users/?page=1",
  );
  return data;
}

export async function getDriverList(
  params?: DriverQueryParams,
): Promise<PaginatedResponse<Driver>> {
  const { data } = await api.get<PaginatedResponse<Driver>>(
    "/business-admin/drivers/",
    {
      params: cleanQueryParams(params ?? {}),
    },
  );

  return data;
}

export async function getRiders(
  params: RiderQueryParams,
): Promise<PaginatedResponse<Rider>> {
  const { data } = await api.get<PaginatedResponse<Rider>>(
    "/business-admin/riders/",
    {
      params: cleanQueryParams(params),
    },
  );
  return data;
}
// getDriverList();

export async function getUserSummary() {
  const { data } = await api.get<SummaryResponse>(
    "/business-admin/users/summary/",
  );
  return data.data;
}

export async function getDriverSummary() {
  const { data } = await api.get<SummaryResponse>(
    "/business-admin/drivers/summary/",
  );
  return data.data;
}

export async function getRiderSummary() {
  const { data } = await api.get<SummaryResponse>(
    "/business-admin/riders/summary/",
  );
  return data.data;
}

///LIVE TRIPS
export async function getRides(page = 1): Promise<PaginatedRides> {
  const { data } = await api.get<PaginatedRides>(
    `/business-admin/rides/?page=${page}`,
  );

  return data;
}

export async function getTrips(
  params: TripQueryParams,
): Promise<PaginatedTripsResponse> {
  const { data } = await api.get("/business-admin/rides", {
    params: cleanQueryParams(params),
  });

  return data;
}

export async function getLiveTripsSummary() {
  const { data } = await api.get("/business-admin/rides/live/");

  return data.data;
}

export const fetchRiderDetails = async (id: string): Promise<Rider> => {
  const { data } = await api.get<Rider>(`/business-admin/riders/${id}/`);
  return data;
};

export const fetchDriverDetails = async (id: string): Promise<Driver> => {
  const { data } = await api.get<Driver>(`/business-admin/drivers/${id}/`);
  return data;
};

export async function fetchAdminProfile(
  id: string | number,
): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>(`/business-admin/users/${id}/`);
  return data;
}

////ADMIN ROLES

const ADMIN_ROLE_STORAGE_KEY = "admin_roles";

/////default roles to initialize local storage if not present
const defaultRoles: AdminRole[] = [
  {
    id: "1",
    full_name: "David Demo",
    email: "david@test.com",
    role: "Corporate Manager",
    created_at: "2026-05-04",
  },
  {
    id: "2",
    full_name: "John Smith",
    email: "john@test.com",
    role: "Fleet Manager",
    created_at: "2026-05-04",
  },
  {
    id: "3",
    full_name: "Sarah Johnson",
    email: "sarah@test.com",
    role: "Super Admin",
    created_at: "2026-05-04",
  },
  {
    id: "4",
    full_name: "Sarah Johnson",
    email: "sarah@test.com",
    role: "Manager",
    created_at: "2026-05-04",
  },
  {
    id: "5",
    full_name: "Sarah Johnson",
    email: "sarah@test.com",
    role: "Developer",
    created_at: "2026-05-04",
  },
  {
    id: "6",
    full_name: "Sarah Johnson",
    email: "sarah@test.com",
    role: "Developer",
    created_at: "2026-05-04",
  },
  {
    id: "7",
    full_name: "Sarah Johnson",
    email: "sarah@test.com",
    role: "Engineer",
    created_at: "2026-05-04",
  },
  {
    id: "8",
    full_name: "Sarah Johnson",
    email: "sarah@test.com",
    role: "Support",
    created_at: "2026-05-04",
  },
  {
    id: "9",
    full_name: "Sarah Johnson",
    email: "sarah@test.com",
    role: "Rider Support",
    created_at: "2026-05-04",
  },
  {
    id: "10",
    full_name: "Sarah Johnson",
    email: "sarah@test.com",
    role: "Driver",
    created_at: "2026-05-04",
  },
];

const initializeRoles = () => {
  const existing = localStorage.getItem(ADMIN_ROLE_STORAGE_KEY);

  if (!existing) {
    localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, JSON.stringify(defaultRoles));
  }
};

const getStoredRoles = (): AdminRole[] => {
  initializeRoles();

  return JSON.parse(localStorage.getItem(ADMIN_ROLE_STORAGE_KEY) || "[]");
};

const saveRoles = (roles: AdminRole[]) => {
  localStorage.setItem(ADMIN_ROLE_STORAGE_KEY, JSON.stringify(roles));
};

///// fetch, create, update, and delete admin roles
export async function getAdminRoles(): Promise<AdminRole[]> {
  return getStoredRoles();
}

export async function createAdminRole(payload: AdminRole): Promise<AdminRole> {
  const roles = getStoredRoles();

  roles.unshift(payload);

  saveRoles(roles);

  return payload;
}

////UPDATE AND DELETE
export async function updateAdminRole(payload: AdminRole): Promise<AdminRole> {
  const roles = getStoredRoles();

  const updated = roles.map((role) =>
    role.id === payload.id ? payload : role,
  );

  saveRoles(updated);

  return payload;
}

export async function deleteAdminRole(id: string): Promise<string> {
  const roles = getStoredRoles();

  const updated = roles.filter((role) => role.id !== id);

  saveRoles(updated);

  return id;
}
