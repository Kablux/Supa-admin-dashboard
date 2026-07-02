import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  useTheme,
} from "@mui/material";
import { NotifRow } from "../components/notification/NotificationRow";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setSosTab,
  setCategory,
  markAllRead,
} from "../redux/slices/Notification";
import { SosTab } from "../types/common.types";
import { SosCardRow } from "../components/notification/SosCardRow";
import { ReminderCardRow } from "../components/notification/ReminderCardRow";
import { NOTIFICATION_CATEGORY_TABS } from "../data/mockData";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Link } from "react-router-dom";

export default function NotificationsPage(): React.ReactElement {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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
      {/* ── Top row: Messages panel + SOS panel ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2.5,
        }}
      >
        {/* ── Messages / Reminder panel ── */}
        <Box
          sx={{
            backgroundColor: isDark ? "#111111" : "#FFFFFF",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: isDark
              ? "0px 0px 180px rgba(0,0,0,0.08)"
              : "0px 8px 40px rgba(0,0,0,0.06)",
            border: isDark
              ? "1px solid rgba(255,255,255,0.03)"
              : "1px solid rgba(0,0,0,0.06)",
            transition: "all 0.25s ease",
            "&:hover": {
              backgroundColor: isDark ? "#151515" : "#FAFAFA",
            },
          }}
        >
          <Box
            sx={{
              px: 3,
              pt: 3,
              pb: 2,

              background: `
      radial-gradient(
        circle at top center,
        rgba(245,197,24,0.12) 0%,
        rgba(245,197,24,0.05) 20%,
        transparent 50%
      )
    `,
              borderBottom: isDark
                ? "1px solid rgba(255,255,255,0.04)"
                : "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: 16, md: 20 },
                color: "var(--text-primary)",
                lineHeight: 1.1,
                mb: 1,
              }}
            >
              Messages
            </Typography>

            <Typography
              sx={{ fontSize: 14, color: "var(--text-muted)", mt: 0.25 }}
            >
              Reminder
            </Typography>
          </Box>

          <Box sx={{ px: 1.5, py: 1 }}>
            {reminders.map((r, i) => (
              <ReminderCardRow
                key={r.id}
                title={r.title}
                subtitle={r.subtitle}
                time={r.time}
                avatar={r.avatar}
                isLast={i === reminders.length - 1}
              />
            ))}
          </Box>
        </Box>

        {/* ── SOS / Complains panel ── */}
        <Box
          sx={{
            backgroundColor: isDark ? "#111111" : "#FFFFFF",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: isDark
              ? "0px 0px 180px rgba(0,0,0,0.08)"
              : "0px 8px 40px rgba(0,0,0,0.06)",
            border: isDark
              ? "1px solid rgba(255,255,255,0.03)"
              : "1px solid rgba(0,0,0,0.06)",
            transition: "all 0.25s ease",
            "&:hover": {
              backgroundColor: isDark ? "#151515" : "#FAFAFA",
            },
          }}
        >
          <Box
            className="flex justify-between items-center"
            sx={{
              px: 3,
              pt: 3,
              pb: 2,
              background: `
      radial-gradient(
        circle at top center,
        rgba(245,197,24,0.12) 0%,
        rgba(245,197,24,0.05) 20%,
        transparent 50%
      )
    `,
              borderBottom: isDark
                ? "1px solid rgba(255,255,255,0.04)"
                : "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: 16, md: 20 },
                    color: "var(--text-primary)",
                  }}
                >
                  SOS
                </Typography>
                <Chip
                  label={
                    sosMessages.drivers.filter((m) => !m.read).length +
                    sosMessages.riders.filter((m) => !m.read).length
                  }
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: "rgba(239,83,80,0.13)",
                    color: "#EF5350",
                    border: "1px solid rgba(239,83,80,0.25)",
                    "& .MuiChip-label": { px: 0.75 },
                  }}
                />
              </Box>
              <Typography
                sx={{ fontSize: 14, color: "var(--text-muted)", mt: 0.25 }}
              >
                SOS / Complains
              </Typography>
            </Box>
            <IconButton
              size="small"
              component={Link}
              to="/sos"
              sx={{
                color: "var(--text-muted)",
                backgroundColor: "var(--border)",
                width: 26,
                height: 26,
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 11 }} />
            </IconButton>
          </Box>

          {/* Tabs */}
          <Box sx={{ px: 1.5 }}>
            <Tabs
              value={activeSosTab}
              onChange={(_, v: SosTab) => dispatch(setSosTab(v))}
              sx={{
                minHeight: 36,
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--accent-gold)",
                  height: 2,
                },
                "& .MuiTab-root": {
                  minHeight: 36,
                  py: 0.5,
                  fontSize: 12.5,
                  fontWeight: 500,
                  textTransform: "none",
                  color: "var(--text-muted)",
                  "&.Mui-selected": {
                    color: "var(--accent-gold)",
                    fontWeight: 600,
                  },
                },
              }}
            >
              <Tab value="drivers" label="Drivers" />
              <Tab value="riders" label="Riders" />
            </Tabs>
          </Box>

          {/* SOS list */}
          <Box sx={{ px: 1.5, pb: 1 }}>
            {(activeSosTab === "drivers"
              ? sosMessages.drivers
              : sosMessages.riders
            ).map((msg, i, arr) => (
              <SosCardRow
                key={msg.id}
                msg={msg}
                isLast={i === arr.length - 1}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Notifications table card ── */}
      <Box
        sx={{
          // overflow: "scroll",
          transition: "background-color 0.25s",
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            pt: 1.75,
            pb: 0,
            borderBottom: "1px solid var(--border)",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {/* Category tabs */}
          <Box sx={{ display: "flex" }}>
            {NOTIFICATION_CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.key;
              const catUnread = notifications.filter(
                (n) => n.category === tab.key && !n.read,
              ).length;
              return (
                <Box
                  key={tab.key}
                  onClick={() => dispatch(setCategory(tab.key))}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.75,
                    pb: 1.5,
                    pt: 0.5,
                    cursor: "pointer",
                    userSelect: "none",
                    borderBottom: isActive
                      ? "2px solid var(--accent-gold)"
                      : "2px solid transparent",
                    mb: "-1px",
                    transition: "all 0.15s",
                    "&:hover": { opacity: 0.85 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive
                        ? "var(--accent-gold)"
                        : "var(--text-muted)",
                      transition: "color 0.15s",
                    }}
                  >
                    {tab.label}
                  </Typography>
                  {catUnread > 0 && (
                    <Box
                      sx={{
                        minWidth: 16,
                        height: 16,
                        borderRadius: "50%",
                        px: 0.5,
                        backgroundColor: "#EF5350",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        {catUnread}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton
                size="small"
                onClick={() => dispatch(markAllRead())}
                sx={{
                  mb: 0.75,
                  color: "var(--accent-gold)",
                  backgroundColor: "var(--accent-gold-glow)",
                  border: "1px solid rgba(245,197,24,0.2)",
                  width: 28,
                  height: 28,
                  "&:hover": { backgroundColor: "rgba(245,197,24,0.2)" },
                }}
              >
                <DoneAllIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Name", "Date", "Message", "Action"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      borderBottom: "1px solid var(--border)",
                      py: 1.5,
                      px: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotifs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ border: "none", py: 8 }}
                  >
                    <NotificationsNoneIcon
                      sx={{ fontSize: 36, color: "var(--text-muted)", mb: 1 }}
                    />
                    <Typography
                      sx={{ fontSize: 13, color: "var(--text-muted)" }}
                    >
                      No notifications
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifs.map((n) => <NotifRow key={n.id} notif={n} />)
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
