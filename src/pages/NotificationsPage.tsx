import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setSosTab,
  setCategory,
  markAllRead,
} from "../redux/slices/Notification";
import RemindersPanel from "../components/notification/ReminderCard";
import SosPanel from "../components/notification/SosCard";
import NotificationsTablePanel from "../components/notification/NotificationTable";

export default function NotificationsPage(): React.ReactElement {
  const dispatch = useAppDispatch();

  const {
    reminders,
    sosMessages,
    notifications,
    activeSosTab,
    activeCategory,
  } = useAppSelector((state) => state.notification);

  const filteredNotifs = notifications.filter(
    (n) => n.category === activeCategory,
  );
  const unreadCount = filteredNotifs.filter((n) => !n.read).length;

  return (
    <Box
      className="fade-in"
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2.5,
        }}
      >
        {/* ── Messages / Reminder Card ── */}
        <RemindersPanel reminders={reminders} />

        {/* ── SOS / Complains Card ── */}
        <SosPanel
          sosMessages={sosMessages}
          activeTab={activeSosTab}
          onTabChange={(tab) => dispatch(setSosTab(tab))}
        />
      </Box>

      {/* ── Notifications table card ── */}
      <NotificationsTablePanel
        activeCategory={activeCategory}
        notifications={notifications}
        filteredNotifs={filteredNotifs}
        unreadCount={unreadCount}
        onCategoryChange={(cat) => dispatch(setCategory(cat))}
        onMarkAllRead={() => dispatch(markAllRead())}
      />
    </Box>
  );
}
