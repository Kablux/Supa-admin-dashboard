import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchReferrals, fetchReferralDetails } from "../../api/xhrHelper";
import { ReferralState } from "../../types/common.types";

const initialState: ReferralState = {
  referrals: [],
  selectedReferral: null,
  totalCount: 0,
  loading: false,
  error: null,
};

const referralSlice = createSlice({
  name: "referrals",
  initialState,
  reducers: {
    clearSelectedReferral: (state) => {
      state.selectedReferral = null;
    },
    clearReferralErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- FETCH REFERRALS LIST ---
    builder
      .addCase(fetchReferrals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- FETCH REFERRAL DETAILS ---
    builder
      .addCase(fetchReferralDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferralDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReferral = action.payload;
      })
      .addCase(fetchReferralDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedReferral, clearReferralErrors } = referralSlice.actions;
export default referralSlice.reducer;