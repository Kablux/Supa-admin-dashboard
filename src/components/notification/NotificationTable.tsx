import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { NOTIFICATION_CATEGORY_TABS } from "../../data/mockData";
import { NotifRow } from "./NotificationRow";
import { NotifCategory, NotificationItem } from "../../types/common.types";



interface NotificationsTablePanelProps {
  activeCategory: NotifCategory; 
  notifications: NotificationItem[]; 
  filteredNotifs: NotificationItem[]; 
  unreadCount: number;
  onCategoryChange: (category: NotifCategory) => void
  onMarkAllRead: () => void;
}

export default function NotificationsTablePanel({
  activeCategory,
  notifications,
  filteredNotifs,
  unreadCount,
  onCategoryChange,
  onMarkAllRead,
}: NotificationsTablePanelProps) {
  return (
    <Box>
      <Box sx={{ transition: "background-color 0.25s" }}>
        
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
                (n) => n.category === tab.key && !n.read
              ).length;

              return (
                <Box
                  key={tab.key}
                  onClick={() => onCategoryChange(tab.key)}
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
                      color: isActive ? "var(--accent-gold)" : "var(--text-muted)",
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
                onClick={onMarkAllRead}
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