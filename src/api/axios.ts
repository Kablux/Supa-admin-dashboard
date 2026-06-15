import axios, { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "https://api.kabluxe.com/api/v1";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export function setStoredTokens(
  access: string,
  refresh?: string
): void {
  sessionStorage.setItem(
    ACCESS_TOKEN_KEY,
    access
  );

  if (refresh) {
    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      refresh
    );
  }
}

export function getStoredAccessToken() {
  return sessionStorage.getItem(
    ACCESS_TOKEN_KEY
  );
}

export function getStoredRefreshToken() {
  return localStorage.getItem(
    REFRESH_TOKEN_KEY
  );
}

export function clearStoredTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}