import { createSlice } from "@reduxjs/toolkit";
import { fetchPromotions, fetchPromotionSummary, createPromotion, updatePromotion, deletePromotion, fetchPromotionUsages } from "../../api/xhrHelper";
import { Promotion, PromotionSummary, PromotionUsage } from "../../types/common.types";


interface PromotionsState {
  list: {
    data: Promotion[];
    count: number;
    loading: boolean;
    error: string | null;
  };
  summary: {
    data: PromotionSummary | null;
    loading: boolean;
  };
  usages: {
    data: PromotionUsage[];
    count: number;
    loading: boolean;
  };
  saving: boolean;
  deletingId: string | null;
}

const initialState: PromotionsState = {
  list: {
    data: [],
    count: 0,
    loading: false,
    error: null,
  },
  summary: {
    data: null,
    loading: false,
  },
  usages: {
    data: [],
    count: 0,
    loading: false,
  },
  saving: false,
  deletingId: null,
};

const promotionsSlice = createSlice({
  name: "promotions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch List
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.results || [];
        state.list.count = action.payload.count || 0;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload as string;
      });

    // Fetch Summary
    builder
      .addCase(fetchPromotionSummary.pending, (state) => {
        state.summary.loading = true;
      })
      .addCase(fetchPromotionSummary.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.data = action.payload;
      })
      .addCase(fetchPromotionSummary.rejected, (state) => {
        state.summary.loading = false;
      });

    // Create
    builder
      .addCase(createPromotion.pending, (state) => {
        state.saving = true;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.saving = false;
        state.list.data.unshift(action.payload);
        state.list.count += 1;
      })
      .addCase(createPromotion.rejected, (state) => {
        state.saving = false;
      });

    // Update
    builder
      .addCase(updatePromotion.pending, (state) => {
        state.saving = true;
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.list.data.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list.data[index] = action.payload;
        }
      })
      .addCase(updatePromotion.rejected, (state) => {
        state.saving = false;
      });

    // Delete
    builder
      .addCase(deletePromotion.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deletePromotion.fulfilled, (state, action) => {
        state.deletingId = null;
        state.list.data = state.list.data.filter((p) => p.id !== action.payload);
        state.list.count -= 1;
      })
      .addCase(deletePromotion.rejected, (state) => {
        state.deletingId = null;
      });

    // Usages
    builder
      .addCase(fetchPromotionUsages.pending, (state) => {
        state.usages.loading = true;
      })
      .addCase(fetchPromotionUsages.fulfilled, (state, action) => {
        state.usages.loading = false;
        state.usages.data = action.payload.results || [];
        state.usages.count = action.payload.count || 0;
      })
      .addCase(fetchPromotionUsages.rejected, (state) => {
        state.usages.loading = false;
      });
  },
});

export default promotionsSlice.reducer;