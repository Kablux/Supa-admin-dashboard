import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loadSosIncidents } from "../../api/xhrHelper";
import { SosState } from "../../types/common.types";

const initialState: SosState = {
  items: [],
  count: 0,
  currentPage: 1,
  pageSize: 10,
  search: "",
  statusFilter: "",
  rideFilter: "",
  triggeredByFilter: "",
  createdAtAfter: "",
  createdAtBefore: "",
  status: "idle",
  error: null,
};

const sosSlice = createSlice({
  name: "sos",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setRideFilter: (state, action: PayloadAction<string>) => {
      state.rideFilter = action.payload;
      state.currentPage = 1;
    },
    setTriggeredByFilter: (state, action: PayloadAction<string>) => {
      state.triggeredByFilter = action.payload;
      state.currentPage = 1;
    },
    setDateRange: (
      state,
      action: PayloadAction<{ after: string; before: string }>
    ) => {
      state.createdAtAfter = action.payload.after;
      state.createdAtBefore = action.payload.before;
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.search = "";
      state.statusFilter = "";
      state.rideFilter = "";
      state.triggeredByFilter = "";
      state.createdAtAfter = "";
      state.createdAtBefore = "";
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSosIncidents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadSosIncidents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(loadSosIncidents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentPage,
  setPageSize,
  setSearch,
  setStatusFilter,
  setRideFilter,
  setTriggeredByFilter,
  setDateRange,
  clearFilters,
} = sosSlice.actions;

export default sosSlice.reducer;