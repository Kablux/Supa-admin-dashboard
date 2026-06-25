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
import { TransactionAnalytics } from "../types/common.types";

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

///LIVE TRIPS
export async function getTrips(
  params: TripQueryParams,
): Promise<PaginatedTripsResponse> {
  const { data } = await api.get(
    "/business-admin/rides/live/",
    {
      params: cleanQueryParams(params),
    },
  );

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
