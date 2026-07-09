import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CorporateState } from "../../types/common.types";

const initialState: CorporateState = {
  stats: [],
  owners: [],
  companyInfo: null,
  isLoading: false,
  error: null,
};

const corporateSlice = createSlice({
  name: "corporate",

  initialState,

  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setCorporateData: (state, action) => {
      state.stats = action.payload.stats;
      state.owners = action.payload.owners;
      state.companyInfo = action.payload.companyInfo;
    },
  },
});

export const { setLoading, setCorporateData } =
  corporateSlice.actions;

export default corporateSlice.reducer;