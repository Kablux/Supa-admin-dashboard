import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { InspectionState, InspectionFilter } from '../../types/common.types';
import { INSPECTION_CARS, CAR_TYPE_STATS, TOTAL_INSPECTED_VALUE } from '../../data/inspectionData';


const initialState: InspectionState = {
  cars:                INSPECTION_CARS,
  filter:              'all',
  search:              '',
  carTypeStats:        CAR_TYPE_STATS,
  totalInspectedValue: TOTAL_INSPECTED_VALUE,
};

const inspectionSlice = createSlice({
  name: 'inspection',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<InspectionFilter>) {
      state.filter = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },

    // Approve a pending car
    approveCar(state, action: PayloadAction<string>) {
      const car = state.cars.find(c => c.id === action.payload);
      if (car && car.status === 'pending') {
        car.status      = 'approved';
        car.inspectedAt = new Date().toISOString().split('T')[0];
      }
    },

    // Reject (fail) a pending car
    rejectCar(state, action: PayloadAction<{ id: string; notes: string }>) {
      const car = state.cars.find(c => c.id === action.payload.id);
      if (car && car.status === 'pending') {
        car.status      = 'failed';
        car.notes       = action.payload.notes;
        car.inspectedAt = new Date().toISOString().split('T')[0];
      }
    },

    // Suspend an approved car (takes it offline without deleting)
    suspendCar(state, action: PayloadAction<string>) {
      const car = state.cars.find(c => c.id === action.payload);
      if (car && car.status === 'approved') {
        car.status = 'failed'; // re-uses failed status as suspended
        car.notes  = 'Suspended by admin.';
      }
    },

    // Delete a car from the list
    deleteCar(state, action: PayloadAction<string>) {
      state.cars = state.cars.filter(c => c.id !== action.payload);
    },

    // Toggle favourite
    toggleFavourite(state, action: PayloadAction<string>) {
      const car = state.cars.find(c => c.id === action.payload);
      if (car) car.isFavourite = !car.isFavourite;
    },
  },
});

export const {
  setFilter,
  setSearch,
  approveCar,
  rejectCar,
  suspendCar,
  deleteCar,
  toggleFavourite,
} = inspectionSlice.actions;

export default inspectionSlice.reducer;
