import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/Auth";
import dashboardReducer from "./slices/Dashboard";
import ridersReducer from "./slices/Riders";
import driversReducer from "./slices/Drivers";
import tripsReducer from "./slices/Trips";
import transactionReducer from "./slices/Transaction";
import notificationReducer from "./slices/Notification";
import adminRoleReducer from "./slices/AdminRole";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    riders: ridersReducer,
    drivers: driversReducer,
    trips: tripsReducer,
    transaction: transactionReducer,
    notification: notificationReducer,
    adminRole: adminRoleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
