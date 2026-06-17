import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { LoginResponse, LoginCredentials, AuthState } from "../types/auth";
import {
  setStoredTokens,
  clearStoredTokens,
  getStoredRefreshToken,
} from "./axios";
import { getDriverList, getUserList, loginRequest, logoutRequest } from "./xhr";

export const loginAdmin = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginAdmin", async (credentials, { rejectWithValue }) => {
  try {
    const responsePayload = await loginRequest(credentials);

    const accessToken = responsePayload.data.access;
    const refreshToken = responsePayload.data.refresh;

    // save them to storage
    setStoredTokens(accessToken, refreshToken);

    //Return the full payload to authSlice
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
      const [users, drivers] = await Promise.all([
        getUserList(),
        getDriverList(),
      ]);

      return {
        totalUsers: users.count,
        totalDrivers: drivers.count,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to load dashboard stats";
      return rejectWithValue(message);
    }
  },
);
