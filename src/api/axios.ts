import axios, { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is required. Point test builds at the test API and production builds at the production API."
  );
}

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const SESSION_START_KEY = "session_start_time";
export const LAST_ACTIVITY_KEY = "last_activity_time";

export const SESSION_TIMEOUT_MS = 60 * 60 * 1000; 
export const SESSION_WARNING_MS = 60 * 1000;
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Handle FormData differently from normal JSON requests
  if (config.data instanceof FormData) {
    config.headers?.delete("Content-Type");
  } else {
    config.headers?.set("Content-Type", "application/json");
  }

  return config;
});

export default api;

export function setStoredTokens(
  access?: string,
  refresh?: string
): void {
  if (access) {
    const now = Date.now();

    sessionStorage.setItem(ACCESS_TOKEN_KEY, access);
    sessionStorage.setItem(SESSION_START_KEY, String(now));
    sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now));
  } else {
    console.error("Critical: Tried to save an undefined access token!");
  }

  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

export function getStoredAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearStoredTokens(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_START_KEY);
  sessionStorage.removeItem(LAST_ACTIVITY_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}