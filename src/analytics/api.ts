import { useCallback, useEffect, useRef, useState } from "react";
import api, { getStoredAccessToken } from "../api/axios";
import type { AnalyticsMe, KpiDefinition } from "./types";

const BASE = "/business-admin/analytics";
const CACHE_MS = 60 * 1000;

type Params = Record<string, string | number | undefined | null>;
const responseCache = new Map<string, { at: number; data: unknown }>();

function clean(params: Params = {}): Record<string, string> {
  const result: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") result[key] = String(value);
  });
  return result;
}

function cacheKey(path: string, params: Params) {
  return `${path}?${new URLSearchParams(clean(params)).toString()}`;
}

export function errorMessage(error: unknown): string {
  const anyError = error as { response?: { status?: number; data?: { detail?: string; message?: string } }; message?: string };
  const status = anyError?.response?.status;
  const detail = anyError?.response?.data?.detail || anyError?.response?.data?.message;
  if (status === 403) return detail || "Your analytics role does not include this section.";
  if (status === 404) return detail || "Analytics is not enabled on this environment.";
  return detail || anyError?.message || "Something went wrong loading analytics.";
}

export async function getAnalytics<T>(path: string, params: Params = {}, { fresh = false } = {}): Promise<T> {
  const key = cacheKey(path, params);
  const hit = responseCache.get(key);
  if (!fresh && hit && Date.now() - hit.at < CACHE_MS) return hit.data as T;
  const response = await api.get<T>(`${BASE}/${path}`, { params: clean(params) });
  responseCache.set(key, { at: Date.now(), data: response.data });
  return response.data;
}

export async function sendAnalytics<T>(method: "post" | "put" | "patch", path: string, body: unknown): Promise<T> {
  const response = await api.request<T>({ method, url: `${BASE}/${path}`, data: body });
  responseCache.clear();
  return response.data;
}

export async function downloadAnalytics(path: string, params: Params, format: "csv" | "xlsx"): Promise<void> {
  const response = await api.get(`${BASE}/${path}`, { params: { ...clean(params), export: format }, responseType: "blob" });
  const disposition: string = response.headers["content-disposition"] || "";
  const match = /filename="?([^";]+)"?/.exec(disposition);
  const filename = match?.[1] || `analytics.${format}`;
  const url = URL.createObjectURL(response.data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export interface Loadable<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useAnalytics<T>(path: string | null, params: Params = {}): Loadable<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(path));
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const key = path ? cacheKey(path, params) : "";
  const latest = useRef(key);

  useEffect(() => {
    if (!path) return;
    latest.current = key;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAnalytics<T>(path, params, { fresh: tick > 0 })
      .then((result) => {
        if (!cancelled && latest.current === key) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick]);

  const reload = useCallback(() => setTick((value) => value + 1), []);
  return { data, loading, error, reload };
}

let mePromise: Promise<AnalyticsMe | null> | null = null;
let meToken: string | null = null;

export function loadMe(): Promise<AnalyticsMe | null> {
  const token = getStoredAccessToken();
  if (token !== meToken) {
    meToken = token;
    mePromise = null;
    responseCache.clear();
  }
  if (!token) return Promise.resolve(null);
  if (!mePromise) {
    mePromise = api
      .get<AnalyticsMe>(`${BASE}/me/`)
      .then((response) => response.data)
      .catch(() => {
        mePromise = null;
        return null;
      });
  }
  return mePromise;
}

export function resetMe() {
  mePromise = null;
}

export function useAnalyticsMe() {
  const [me, setMe] = useState<AnalyticsMe | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    loadMe().then((value) => {
      if (active) {
        setMe(value);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  const can = useCallback((permission: string) => Boolean(me?.permissions.includes(permission)), [me]);
  return { me, loading, can };
}

let kpiPromise: Promise<Record<string, KpiDefinition>> | null = null;

export function loadKpis(): Promise<Record<string, KpiDefinition>> {
  if (!kpiPromise) {
    kpiPromise = api
      .get<{ kpis: KpiDefinition[] }>(`${BASE}/kpis/`)
      .then((response) => Object.fromEntries(response.data.kpis.map((kpi) => [kpi.key, kpi])))
      .catch(() => {
        kpiPromise = null;
        return {};
      });
  }
  return kpiPromise;
}

export function useKpiDefinitions() {
  const [kpis, setKpis] = useState<Record<string, KpiDefinition>>({});
  useEffect(() => {
    let active = true;
    loadKpis().then((value) => active && setKpis(value));
    return () => {
      active = false;
    };
  }, []);
  return kpis;
}
