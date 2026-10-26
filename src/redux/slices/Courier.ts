import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCourierRiders,
  approveCourierRiderKyc,
  rejectCourierRiderKyc,
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
  selectedRider: CourierRider | null;
  kycApprovingId: string | null;
  kycApprovalError: string | null;
  kycRejectingId: string | null;
  kycRejectionError: string | null;
}

const initialState: CourierState = {
  riders: { data: [], count: 0, page: 1, pageSize: 10, loading: false, error: null },
  users: { data: [], count: 0, page: 1, pageSize: 10, loading: false, error: null },
  referrals: { data: [], count: 0, page: 1, pageSize: 10, loading: false, error: null },
  selectedRider: null,
  kycApprovingId: null,
  kycApprovalError: null,
  kycRejectingId: null,
  kycRejectionError: null,
};

const courierSlice = createSlice({
  name: 'courier',
  initialState,
  reducers: {
    setSelectedRider(state, action: PayloadAction<CourierRider | null>) {
      state.selectedRider = action.payload;
    },
    clearKycStatus(state) {
      state.kycApprovalError = null;
      state.kycApprovingId = null;
      state.kycRejectionError = null;
      state.kycRejectingId = null;
    },
    updateRiderInList(state, action: PayloadAction<Partial<CourierRider> & { id: string }>) {
      const index = state.riders.data.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        Object.assign(state.riders.data[index], action.payload);
      }
      const selected = state.selectedRider;
      if (selected && selected.id === action.payload.id) {
        Object.assign(selected, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // ── Riders List ──
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
        state.riders.error =
          (action.payload as string) || action.error.message || 'Failed to fetch riders';
      });

    // ── KYC Approval ──
    builder
      .addCase(approveCourierRiderKyc.pending, (state, action) => {
        state.kycApprovingId = action.meta.arg;
        state.kycApprovalError = null;
      })
      .addCase(approveCourierRiderKyc.fulfilled, (state, action) => {
        state.kycApprovingId = null;

        const { account_status, kyc_status, is_approved, approval_date } = action.payload;

        const index = state.riders.data.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.riders.data[index].account_status = account_status;
          state.riders.data[index].kyc_status = kyc_status;
          state.riders.data[index].is_approved = is_approved;
          state.riders.data[index].approval_date = approval_date;
        }

        const selected = state.selectedRider;
        if (selected && selected.id === action.payload.id) {
          selected.account_status = account_status;
          selected.kyc_status = kyc_status;
          selected.is_approved = is_approved;
          selected.approval_date = approval_date;
        }
      })
      .addCase(approveCourierRiderKyc.rejected, (state, action) => {
        state.kycApprovingId = null;
        state.kycApprovalError =
          (action.payload as string) || action.error.message || 'Failed to approve KYC';
      });

    // ── KYC Rejection ──
    builder
      .addCase(rejectCourierRiderKyc.pending, (state, action) => {
        state.kycRejectingId = action.meta.arg.userId;
        state.kycRejectionError = null;
      })
      .addCase(rejectCourierRiderKyc.fulfilled, (state, action) => {
        state.kycRejectingId = null;

        const { account_status, kyc_status, kyc_rejection_reason } = action.payload;

        const index = state.riders.data.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.riders.data[index].account_status = account_status;
          state.riders.data[index].kyc_status = kyc_status;
          state.riders.data[index].kyc_rejection_reason = kyc_rejection_reason;
        }

        const selected = state.selectedRider;
        if (selected && selected.id === action.payload.id) {
          selected.account_status = account_status;
          selected.kyc_status = kyc_status;
          selected.kyc_rejection_reason = kyc_rejection_reason;
        }
      })
      .addCase(rejectCourierRiderKyc.rejected, (state, action) => {
        state.kycRejectingId = null;
        state.kycRejectionError =
          (action.payload as string) || action.error.message || 'Failed to reject KYC';
      });

    // ── Users List ──
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
        state.users.error =
          (action.payload as string) || action.error.message || 'Failed to fetch users';
      });

    // ── Referrals List ──
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
        state.referrals.error =
          (action.payload as string) || action.error.message || 'Failed to fetch referrals';
      });
  },
});

export const { setSelectedRider, clearKycStatus, updateRiderInList } = courierSlice.actions;
export default courierSlice.reducer;