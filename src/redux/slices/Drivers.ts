import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Driver } from "../../types/auth";
import { fetchDrivers, fetchRiders } from "../../api/xhrHelper";


interface DriversState {
  items: Driver[];
  totalCount: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: DriversState = {
  items: [],
  totalCount: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
};

const driversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage } = driversSlice.actions;
export default driversSlice.reducer;