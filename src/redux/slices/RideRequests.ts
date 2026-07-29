import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchRideRequests, fetchRideRequestDetails } from "../../api/xhrHelper";
import { RideRequestDetail, RideRequestList } from "../../types/common.types";


interface RideRequestsState {
  items: RideRequestList[];
  totalCount: number;
  currentPage: number;
  isLoading: boolean;
  selectedRequest: RideRequestDetail | null;
  isDetailLoading: boolean;
  error: string | null;
}

const initialState: RideRequestsState = {
  items: [],
  totalCount: 0,
  currentPage: 1,
  isLoading: false,
  selectedRequest: null,
  isDetailLoading: false,
  error: null,
};

const rideRequestsSlice = createSlice({
  name: "rideRequests",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all Ride Requests
    builder
      .addCase(fetchRideRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRideRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchRideRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Ride Request Details
    builder
      .addCase(fetchRideRequestDetails.pending, (state) => {
        state.isDetailLoading = true;
        state.error = null;
      })
      .addCase(fetchRideRequestDetails.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selectedRequest = action.payload;
      })
      .addCase(fetchRideRequestDetails.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage, clearSelectedRequest } = rideRequestsSlice.actions;
export default rideRequestsSlice.reducer;