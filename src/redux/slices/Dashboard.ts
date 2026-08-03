import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTransactionAnalytics,
  getDashboardStats,
} from "../../api/xhrHelper";
import { DashboardState } from "../../types/auth";
import {
  DriverSummaryData,
  LiveTripsSummary,
  ReferralSummaryData,
  RideRequestSummaryData,
  RideSummaryData,
} from "../../types/common.types";

const emptySummary: RideSummaryData = {
  total: 0,
  active: 0,
  suspended: 0,
};

const emptyDriverSummary: DriverSummaryData = {
  total: 0,
  online: 0,
  suspended: 0,
  pending_kyc: 0,
  not_started_kyc: 0,
  approved_kyc: 0,
};

const emptyLiveTripsSummary: LiveTripsSummary = {
  active: 0,
  completed: 0,
  cancelled: 0,
};
const emptyRideRequestSummary: RideRequestSummaryData = {
  total: 0,
  pending: 0,
  searching: 0,
  matched: 0,
  cancelled: 0,
  expired: 0,
};
const emptyReferralsSummary: ReferralSummaryData = {
  total: 0,
  rider: 0,
  driver: 0,
};


const initialState: DashboardState = {
  totalDrivers: 0,
  totalUsers: 0,
  // liveTrips: 0,
  liveTripsSummary: emptyLiveTripsSummary,
  referralsSummary: emptyReferralsSummary,
  isLoading: false,
  error: null,
  usersummary: emptySummary,
  driversummary: emptyDriverSummary,
  ridersummary: emptySummary,
  requestsummary: emptyRideRequestSummary,
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
        state.liveTripsSummary = action.payload.liveTripsSummary;
        state.referralsSummary = action.payload.referralsSummary;
        state.usersummary = action.payload.userSummary;
        state.driversummary = action.payload.driverSummary;
        state.ridersummary = action.payload.riderSummary;
        state.requestsummary = action.payload.requestSummary;
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
