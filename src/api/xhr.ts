import api from "./axios";
import {
  LoginCredentials,
  LoginResponse,
  AdminUser,
  PaginatedUsers,
  PaginatedDrivers,
} from "../types/auth";

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

export async function fetchAdminProfile(
  id: string | number,
): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>(`/business-admin/users/${id}/`);
  return data;
}
