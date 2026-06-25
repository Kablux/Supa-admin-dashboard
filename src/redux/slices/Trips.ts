import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTrips } from "../../api/xhrHelper";
import { Trip } from "../../types/auth";


interface TripsState {
  items: Trip[];
  totalCount: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TripsState = {
  items: [],
  totalCount: 0,
  currentPage: 1,
  isLoading: false,
   error: null
};

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
     setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default tripsSlice.reducer;