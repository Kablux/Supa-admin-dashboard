// store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/Auth";
import dashboardReducer from "./slices/Dashboard";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
