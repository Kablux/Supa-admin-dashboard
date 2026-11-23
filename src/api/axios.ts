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
export const SESSION_EXPIRED_EVENT = "app:session-expired";

const DEFAULT_TIMEOUT_MINUTES = 60;

const configuredMinutes = Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES);
const sessionTimeoutMinutes =
  Number.isFinite(configuredMinutes) && configuredMinutes > 0
    ? configuredMinutes
    : DEFAULT_TIMEOUT_MINUTES;

export const SESSION_TIMEOUT_MS = sessionTimeoutMinutes * 60 * 1000;

// Cap warning at 60s for longer sessions
export const SESSION_WARNING_MS = Math.min(
  60 * 1000,
  Math.floor(SESSION_TIMEOUT_MS * 0.25)
);

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getStoredAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let the browser/XHR set the multipart boundary automatically for FormData
  if (config.data instanceof FormData) {
    config.headers?.delete("Content-Type");
  } else {
    config.headers?.set("Content-Type", "application/json");
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = String(error?.config?.url || "");
    const isAuthEndpoint =
      url.includes("/login") ||
      url.includes("/token") ||
      url.includes("/logout");

    if (status === 401 && !isAuthEndpoint) {
      clearStoredTokens();
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  }
);

export default api;

export function setStoredTokens(access?: string, refresh?: string): void {
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

export function getStoredAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearStoredTokens(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_START_KEY);
  sessionStorage.removeItem(LAST_ACTIVITY_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}