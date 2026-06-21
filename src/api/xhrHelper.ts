import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  LoginResponse,
  LoginCredentials,
  AuthState,
  RiderQueryParams,
} from "../types/auth";
import {
  setStoredTokens,
  clearStoredTokens,
  getStoredRefreshToken,
} from "./axios";
import {
  getDriverList,
  getDriverSummary,
  getRiders,
  getRiderSummary,
  getRides,
  getUserList,
  getUserSummary,
  loginRequest,
  logoutRequest,
} from "./xhr";

export const loginAdmin = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginAdmin", async (credentials, { rejectWithValue }) => {
  try {
    const responsePayload = await loginRequest(credentials);

    const accessToken = responsePayload.data.access;
    const refreshToken = responsePayload.data.refresh;

    setStoredTokens(accessToken, refreshToken);
    return responsePayload;
  } catch (error: any) {
    const message = error.response?.data?.message || "Login failed";
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const logoutAdmin = createAsyncThunk<
  void,
  void,
  { state: { auth: AuthState } }
>("auth/logoutAdmin", async (_, { getState, rejectWithValue }) => {
  // FIX: Read from Redux state. If it's missing or null, pull directly from localStorage
  const refreshToken = getState().auth.refreshToken || getStoredRefreshToken();

  try {
    if (refreshToken) {
      await logoutRequest(refreshToken);
    } else {
      console.warn("Logout initiated, but no refresh token was found locally.");
    }
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Session clearance encountered an issue.";
    console.error("Server logout error:", message);
  } finally {
    clearStoredTokens();
  }
});

export const getDashboardStats = createAsyncThunk(
  "dashboard/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const [users, drivers, rides, userSummary, driverSummary, riderSummary] =
        await Promise.all([
          getUserList(),
          getDriverList(),
          getRides(),
          getUserSummary(),
          getDriverSummary(),
          getRiderSummary(),
        ]);

      const liveTrips = rides.results.filter(
        (ride: any) => ride.status === "driver_on_way",
      ).length;
      return {
        totalUsers: users.count,
        totalDrivers: drivers.count,
        userSummary,
        driverSummary,
        riderSummary,
        liveTrips,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to load dashboard stats";
      return rejectWithValue(message);
    }
  },
);

export const fetchRiders = createAsyncThunk(
  "riders/fetchRiders",
  async (params: RiderQueryParams, { rejectWithValue }) => {
    try {
      return await getRiders(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load riders list",
      );
    }
  },
);
