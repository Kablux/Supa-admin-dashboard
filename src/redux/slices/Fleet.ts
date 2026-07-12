import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FleetState } from "../../types/common.types";

const initialState: FleetState = {
  stats: [],
  vehicles: [],
  gallery: [],
  reminders: [],
  pairings: [],
  owners: [],
  status: {
    active: 0,
    offline: 0,
    blocked: 0,
  },
  isLoading: false,
};

const fleetSlice = createSlice({
  name: "fleet",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setFleetData: (state, action) => {
      state.stats = action.payload.stats;
      state.vehicles = action.payload.vehicles;
      state.gallery = action.payload.gallery;
      state.reminders = action.payload.reminders;
      state.pairings = action.payload.pairings;
      state.owners = action.payload.owners;
      state.status = action.payload.status;
    },
  },
});

export const { setLoading, setFleetData } = fleetSlice.actions;

export default fleetSlice.reducer;
