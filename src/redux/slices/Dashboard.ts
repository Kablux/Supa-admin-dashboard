import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTransactionAnalytics,
  getDashboardStats,
} from "../../api/xhrHelper";
import { DashboardState } from "../../types/auth";
import { LiveTripsSummary, RideSummaryData } from "../../types/common.types";

const emptySummary: RideSummaryData = {
  total: 0,
  active: 0,
  suspended: 0,
};

const emptyLiveTripsSummary: LiveTripsSummary = {
  total: 0,
  driver_on_way: 0,
  arrived: 0,
  started: 0,
};

const initialState: DashboardState = {
  totalDrivers: 0,
  totalUsers: 0,
  // liveTrips: 0,
  liveTripsSummary: emptyLiveTripsSummary,
  isLoading: false,
  error: null,
  usersummary: emptySummary,
  driversummary: emptySummary,
  ridersummary: emptySummary,
  analytics: null,
  analyticsLoading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalDrivers = action.payload.totalDrivers;
        state.totalUsers = action.payload.totalUsers;
        // state.liveTrips = action.payload.liveTrips;
        state.liveTripsSummary = action.payload.liveTripsSummary;
        state.usersummary = action.payload.userSummary;
        state.driversummary = action.payload.driverSummary;
        state.ridersummary = action.payload.riderSummary;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : (action.payload as any)?.message ||
              "An unexpected error occurred.";
      })
      .addCase(fetchTransactionAnalytics.pending, (state) => {
        state.analyticsLoading = true;
      })

      .addCase(fetchTransactionAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })

      .addCase(fetchTransactionAnalytics.rejected, (state) => {
        state.analyticsLoading = false;
      });
  },
});

export default dashboardSlice.reducer;
