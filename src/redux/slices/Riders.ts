// store/ridersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Rider } from "../../types/auth";
import { fetchRiders } from "../../api/xhrHelper";


interface RidersState {
  items: Rider[];
  totalCount: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: RidersState = {
  items: [],
  totalCount: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
};

const ridersSlice = createSlice({
  name: "riders",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRiders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchRiders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage } = ridersSlice.actions;
export default ridersSlice.reducer;