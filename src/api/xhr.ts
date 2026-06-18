import api from "./axios";
import {
  LoginCredentials,
  LoginResponse,
  AdminUser,
  PaginatedUsers,
  PaginatedDrivers,
  PaginatedRides,
} from "../types/auth";
import { RideSummaryData } from "../types/common.types";

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

export async function getUserList(): Promise<PaginatedUsers> {
  const { data } = await api.get<PaginatedUsers>(
    "/business-admin/users/?page=1",
  );
  return data;
}

export async function getDriverList(): Promise<PaginatedDrivers> {
  const { data } = await api.get<PaginatedDrivers>(
    "/business-admin/drivers/?page=1",
  );
  return data;
}
export async function getRides(page = 1): Promise<PaginatedRides> {
  const { data } = await api.get<PaginatedRides>(
    `/business-admin/rides/?page=${page}`,
  );

  return data;
}

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
export async function fetchAdminProfile(
  id: string | number,
): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>(`/business-admin/users/${id}/`);
  return data;
}
