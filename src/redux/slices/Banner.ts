import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loadBanners, addBanner, editBanner, removeBanner, toggleBannerActive } from '../../api/xhrHelper';
import { BannersState, BannerAudience } from '../../types/common.types';

// ── Initial state ─────────────────────────────────────────────────────────────

const initialState: BannersState = {
  list:           [],
  count:          0,
  currentPage:    1,
  pageSize:       10,
  search:         '',
  audienceFilter: '',
  activeFilter:   '',
  listStatus:     'idle',
  mutateStatus:   'idle',
  error:          null,
  mutateError:    null,
};



// ── Slice ─────────────────────────────────────────────────────────────────────

const bannersSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search      = action.payload;
      state.currentPage = 1;
    },
    setAudienceFilter(state, action: PayloadAction<BannerAudience | ''>) {
      state.audienceFilter = action.payload;
      state.currentPage    = 1;
    },
    setActiveFilter(state, action: PayloadAction<boolean | ''>) {
      state.activeFilter = action.payload;
      state.currentPage  = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when changing size
    },
    clearMutateError(state) {
      state.mutateError  = null;
      state.mutateStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Load list ──
      .addCase(loadBanners.pending, (state) => {
        state.listStatus = 'loading';
        state.error      = null;
      })
      .addCase(loadBanners.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.list       = action.payload.list;
        state.count      = action.payload.count;
      })
      .addCase(loadBanners.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.error      = action.payload ?? 'Failed to load banners.';
      })

      // ── Create ──
      .addCase(addBanner.pending, (state) => {
        state.mutateStatus = 'loading';
        state.mutateError  = null;
      })
      .addCase(addBanner.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        state.list.unshift(action.payload); // prepend new banner
        state.count += 1;
      })
      .addCase(addBanner.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.mutateError  = action.payload ?? 'Failed to create banner.';
      })

      // ── Edit ──
      .addCase(editBanner.pending, (state) => {
        state.mutateStatus = 'loading';
        state.mutateError  = null;
      })
      .addCase(editBanner.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        const idx = state.list.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(editBanner.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.mutateError  = action.payload ?? 'Failed to update banner.';
      })

      // ── Delete ──
      .addCase(removeBanner.pending, (state) => {
        state.mutateStatus = 'loading';
        state.mutateError  = null;
      })
      .addCase(removeBanner.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        state.list  = state.list.filter(b => b.id !== action.payload);
        state.count = Math.max(0, state.count - 1);
      })
      .addCase(removeBanner.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.mutateError  = action.payload ?? 'Failed to delete banner.';
      })

      // ── Toggle active (optimistic update in list) ──
      .addCase(toggleBannerActive.fulfilled, (state, action) => {
        const idx = state.list.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export const {
  setSearch, setAudienceFilter, setActiveFilter, setPage,setPageSize, clearMutateError,
} = bannersSlice.actions;

export default bannersSlice.reducer;
