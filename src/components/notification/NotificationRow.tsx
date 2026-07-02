import {
  TableRow,
  TableCell,
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { NotificationItem } from "../../types/common.types";
import { markRead, deleteNotification } from "../../redux/slices/Notification";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";

const cellSx = {
  borderBottom: "1px solid var(--border-subtle)",
  py: 1.4,
  px: 2,
};

export function NotifRow({
  notif,
}: {
  notif: NotificationItem;
}): React.ReactElement {
  const dispatch = useAppDispatch();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <TableRow
        sx={{
          opacity: notif.read ? 0.7 : 1,
          "&:last-child td": { borderBottom: "none" },
          "&:hover": { backgroundColor: "var(--bg-card-hover)" },
          transition: "background 0.12s",
          cursor: "pointer",
        }}
        onClick={() => dispatch(markRead(notif.id))}
      >
        {/* Name + avatar */}
        <TableCell sx={cellSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            {/* Unread dot */}
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                flexShrink: 0,
                backgroundColor: notif.read
                  ? "transparent"
                  : "var(--accent-gold)",
              }}
            />
            <Avatar
              src={notif.userAvatar ?? undefined}
              sx={{
                width: 30,
                height: 30,
                fontSize: 11,
                fontWeight: 700,
                bgcolor: "var(--border)",
                border: notif.read ? "none" : "1.5px solid var(--accent-gold)",
              }}
            >
              {notif.userName.charAt(0)}
            </Avatar>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: notif.read ? 400 : 600,
                color: "var(--text-primary)",
              }}
            >
              {notif.userName}
            </Typography>
          </Box>
        </TableCell>

        {/* Date */}
        <TableCell sx={cellSx}>
          <Typography sx={{ fontSize: 12.5, color: "var(--text-primary)" }}>
            {notif.date}
          </Typography>
        </TableCell>

        {/* Message */}
        <TableCell sx={cellSx}>
          <Typography
            sx={{
              fontSize: 12.5,
              color: notif.read ? "var(--text-secondary)" : "var(--text-primary)",
            }}
          >
            {notif.message}
          </Typography>
        </TableCell>


        {/* Actions */}
        <TableCell
          sx={{ ...cellSx, width: 50, pr: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            size="small"
            onClick={(e) => setAnchor(e.currentTarget)}
            sx={{ color: "var(--text-primary)" }}
          >
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={() => setAnchor(null)}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 150,
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                dispatch(markRead(notif.id));
                setAnchor(null);
              }}
              sx={{
                fontSize: 12.5,
                py: 0.9,
                gap: 1,
                color: "var(--text-secondary)",
                "&:hover": { backgroundColor: "var(--accent-gold-glow)" },
              }}
            >
              <CheckIcon sx={{ fontSize: 15 }} /> Mark as read
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(deleteNotification(notif.id));
                setAnchor(null);
              }}
              sx={{
                fontSize: 12.5,
                py: 0.9,
                gap: 1,
                color: "error.main",
                "&:hover": { backgroundColor: "rgba(239,83,80,0.08)" },
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    </>
  );
}
