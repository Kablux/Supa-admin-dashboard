import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  LoginResponse,
  LoginCredentials,
  AuthState,
  RiderQueryParams,
  DriverQueryParams,
  TripQueryParams,
} from "../types/auth";
import {
  setStoredTokens,
  clearStoredTokens,
  getStoredRefreshToken,
} from "./axios";
import {
  createAdminRole,
  deleteAdminRole,
  getAdminRoles,
  getCorporateData,
  getDriverList,
  getDriverSummary,
  getLiveTripsSummary,
  getRiders,
  getRiderSummary,
  getTransactionAnalytics,
  getTrips,
  getUserList,
  getUserSummary,
  loginRequest,
  logoutRequest,
  updateAdminRole,
} from "./xhr";
import { AdminRole } from "../types/common.types";
import { setCorporateData, setLoading } from "../redux/slices/corporate";
import { AppDispatch } from "../redux/store";

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
  // Read from Redux state. If it's missing or null, pull directly from localStorage
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
      const [
        users,
        drivers,
        liveTripsSummary,
        userSummary,
        driverSummary,
        riderSummary,
      ] = await Promise.all([
        getUserList(),
        getDriverList(),
        getLiveTripsSummary(),
        getUserSummary(),
        getDriverSummary(),
        getRiderSummary(),
      ]);

      return {
        totalUsers: users.count,
        totalDrivers: drivers.count,
        userSummary,
        driverSummary,
        riderSummary,
        // liveTrips: liveTripsSummary.total,
        liveTripsSummary,
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
        error.response?.data?.message || "Failed to load riders",
      );
    }
  },
);

export const fetchDrivers = createAsyncThunk(
  "riders/fetchDrivers",
  async (params: DriverQueryParams, { rejectWithValue }) => {
    try {
      return await getDriverList(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load drivers",
      );
    }
  },
);

export const fetchTrips = createAsyncThunk(
  "trips/fetchTrips",
  async (params: TripQueryParams, { rejectWithValue }) => {
    try {
      return await getTrips(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load trips",
      );
    }
  },
);

export const fetchTransactionAnalytics = createAsyncThunk(
  "dashboard/fetchTransactionAnalytics",
  async (range: "week" | "month" | "year" = "month", { rejectWithValue }) => {
    try {
      return await getTransactionAnalytics(range);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load analytics",
      );
    }
  },
);

/////Admin Roles Thunks
export const fetchAdminRoles = createAsyncThunk(
  "adminRole/fetchAdminRoles",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminRoles();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch admin roles");
    }
  },
);

export const createAdminRoleThunk = createAsyncThunk(
  "adminRole/create",
  async (payload: AdminRole, { rejectWithValue }) => {
    try {
      return await createAdminRole(payload);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create admin role");
    }
  },
);

export const updateAdminRoleThunk = createAsyncThunk(
  "adminRole/updateAdminRole",
  async (payload: AdminRole, { rejectWithValue }) => {
    try {
      const response = await updateAdminRole(payload);

      toast.success("Admin role updated successfully");

      return response;
    } catch (error: any) {
      toast.error("Unable to update admin role");

      return rejectWithValue(error.message || "Failed to update admin role");
    }
  },
);

export const deleteAdminRoleThunk = createAsyncThunk(
  "adminRole/deleteAdminRole",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAdminRole(id);

      toast.success("Admin role deleted successfully");

      return id;
    } catch (error: any) {
      toast.error("Unable to delete admin role");

      return rejectWithValue(error.message || "Failed to delete admin role");
    }
  },
);

////CORPORATE THUNKS

export const fetchCorporateData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    const response = await getCorporateData();

    dispatch(setCorporateData(response));
  } catch (error) {
    console.error("Failed to fetch corporate data", error);
  } finally {
    dispatch(setLoading(false));
  }
};
