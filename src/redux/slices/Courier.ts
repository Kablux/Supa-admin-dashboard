import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCourierRiders,
  approveCourierRiderKyc,
  fetchCourierUsers,
  fetchCourierReferrals,
} from '../../api/xhrHelper';
import {
  CourierRider,
  CourierUser,
  CourierReferral,
} from '../../types/common.types';

interface CourierState {
  riders: {
    data: CourierRider[];
    count: number;
    page: number;
    pageSize: number;
    loading: boolean;
    error: string | null;
  };
  users: {
    data: CourierUser[];
    count: number;
    page: number;
    pageSize: number;
    loading: boolean;
    error: string | null;
  };
  referrals: {
    data: CourierReferral[];
    count: number;
    page: number;
    pageSize: number;
    loading: boolean;
    error: string | null;
  };
  kycApprovingId: string | null;
  kycApprovalError: string | null;
}

const initialState: CourierState = {
  riders: { data: [], count: 0, page: 1, pageSize: 10, loading: false, error: null },
  users: { data: [], count: 0, page: 1, pageSize: 10, loading: false, error: null },
  referrals: { data: [], count: 0, page: 1, pageSize: 10, loading: false, error: null },
  kycApprovingId: null,
  kycApprovalError: null,
};

const courierSlice = createSlice({
  name: 'courier',
  initialState,
  reducers: {
    clearKycStatus(state) {
      state.kycApprovalError = null;
      state.kycApprovingId = null;
    },
  },
  extraReducers: (builder) => {
    // Riders
    builder
      .addCase(fetchCourierRiders.pending, (state) => {
        state.riders.loading = true;
        state.riders.error = null;
      })
      .addCase(fetchCourierRiders.fulfilled, (state, action) => {
        state.riders.loading = false;
        state.riders.data = action.payload.results;
        state.riders.count = action.payload.count;
        state.riders.page = action.payload.page ?? 1;
        state.riders.pageSize = action.payload.page_size ?? 10;
      })
      .addCase(fetchCourierRiders.rejected, (state, action) => {
        state.riders.loading = false;
        state.riders.error = (action.payload as string) || action.error.message || 'Failed to fetch riders';
      });

    // KYC Approval
    builder
      .addCase(approveCourierRiderKyc.pending, (state, action) => {
        state.kycApprovingId = action.meta.arg;
        state.kycApprovalError = null;
      })
      .addCase(approveCourierRiderKyc.fulfilled, (state, action) => {
        state.kycApprovingId = null;
        // Update rider in list
        const index = state.riders.data.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.riders.data[index] = {
            ...state.riders.data[index],
            account_status: action.payload.account_status,
            kyc_status: action.payload.kyc_status as any,
            is_approved: action.payload.is_approved,
          };
        }
      })
      .addCase(approveCourierRiderKyc.rejected, (state, action) => {
        state.kycApprovingId = null;
        state.kycApprovalError = (action.payload as string) || action.error.message || 'Failed to approve KYC';
      });

    // Users
    builder
      .addCase(fetchCourierUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchCourierUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data = action.payload.results;
        state.users.count = action.payload.count;
        state.users.page = action.payload.page ?? 1;
        state.users.pageSize = action.payload.page_size ?? 10;
      })
      .addCase(fetchCourierUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = (action.payload as string) || action.error.message || 'Failed to fetch users';
      });

    // Referrals
    builder
      .addCase(fetchCourierReferrals.pending, (state) => {
        state.referrals.loading = true;
        state.referrals.error = null;
      })
      .addCase(fetchCourierReferrals.fulfilled, (state, action) => {
        state.referrals.loading = false;
        state.referrals.data = action.payload.results;
        state.referrals.count = action.payload.count;
        state.referrals.page = action.payload.page ?? 1;
        state.referrals.pageSize = action.payload.page_size ?? 10;
      })
      .addCase(fetchCourierReferrals.rejected, (state, action) => {
        state.referrals.loading = false;
        state.referrals.error = (action.payload as string) || action.error.message || 'Failed to fetch referrals';
      });
  },
});

export const { clearKycStatus } = courierSlice.actions;
export default courierSlice.reducer;