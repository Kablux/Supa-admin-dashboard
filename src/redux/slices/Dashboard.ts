import { createSlice } from "@reduxjs/toolkit";
import { getDashboardStats } from "../../api/xhrHelper";
import { DashboardState } from "../../types/auth";

const initialState: DashboardState = {
  totalDrivers: 0,
  totalUsers: 0,
  isLoading: false,
  error: null,
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
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === "string" ? action.payload : (action.payload as any)?.message || "An unexpected error occurred.";
      });
  },
});

export default dashboardSlice.reducer;
