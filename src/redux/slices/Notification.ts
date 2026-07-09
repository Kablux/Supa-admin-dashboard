import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  NotificationsState,
  SosTab,
  NotifCategory,
} from "../../types/common.types";
import {
  REMINDERS,
  SOS_DRIVERS,
  SOS_RIDERS,
  NOTIFICATIONS,
} from "../../data/notificationMockData";

const initialState: NotificationsState = {
  reminders: REMINDERS,
  sosMessages: { drivers: SOS_DRIVERS, riders: SOS_RIDERS },
  notifications: NOTIFICATIONS,
  activeSosTab: "drivers",
  activeCategory: "corporate",
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setSosTab(state, action: PayloadAction<SosTab>) {
      state.activeSosTab = action.payload;
    },
    setCategory(state, action: PayloadAction<NotifCategory>) {
      state.activeCategory = action.payload;
    },
    markRead(state, action: PayloadAction<string>) {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllRead(state) {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    deleteNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
    },
  },
});

export const {
  setSosTab,
  setCategory,
  markRead,
  markAllRead,
  deleteNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
