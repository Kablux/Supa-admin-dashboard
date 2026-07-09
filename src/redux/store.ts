import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/Auth";
import dashboardReducer from "./slices/Dashboard";
import ridersReducer from "./slices/Riders";
import driversReducer from "./slices/Drivers";
import tripsReducer from "./slices/Trips";
import transactionReducer from "./slices/Transaction";
import notificationReducer from "./slices/Notification";
import adminRoleReducer from "./slices/AdminRole";
import corporateReducer from "./slices/corporate";
import premiumReducer from "./slices/Premium";

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
    corporate: corporateReducer,
    premium: premiumReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
