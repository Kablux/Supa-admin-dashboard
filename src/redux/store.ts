// store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/Auth";
import dashboardReducer from "./slices/Dashboard";
import ridersReducer from "./slices/Riders";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    riders: ridersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
