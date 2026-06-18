import { createSlice } from "@reduxjs/toolkit";
import { getDashboardStats } from "../../api/xhrHelper";
import { DashboardState } from "../../types/auth";
import { RideSummaryData } from "../../types/common.types";

const emptySummary: RideSummaryData = {
  total: 0,
  active: 0,
  suspended: 0,
};

const initialState: DashboardState = {
  totalDrivers: 0,
  totalUsers: 0,
  liveTrips: 0,
  isLoading: false,
  error: null,
  usersummary: emptySummary,
  driversummary: emptySummary,
  ridersummary: emptySummary,
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
        state.liveTrips = action.payload.liveTrips;
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
      });
  },
});

export default dashboardSlice.reducer;
