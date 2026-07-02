import { Box, Avatar, Typography, IconButton, Divider } from "@mui/material";
import { SosMessage } from "../../types/common.types";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export function SosCardRow({
  msg,
  isLast,
}: {
  msg: SosMessage;
  isLast: boolean;
}): React.ReactElement {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: 1.5,
          px: 0.5,
          cursor: "pointer",
          transition: "background 0.15s",
          "&:hover": { backgroundColor: "var(--accent-gold-glow)" },
        }}
      >
        {/* Avatar with unread dot */}
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <Avatar
            src={msg.avatar ?? undefined}
            sx={{
              width: 30,
              height: 30,
              fontSize: 11,
              fontWeight: 700,
              bgcolor: "var(--border)",
              border: "1.5px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {msg.name.charAt(0)}
          </Avatar>
          {!msg.read && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "var(--accent-gold)",
                border: "1.5px solid var(--bg-card)",
              }}
            />
          )}
        </Box>

        {/* Name + plate */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}
          >
            {msg.name}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {msg.plate}
          </Typography>
        </Box>

        {/* Complaint + time */}
        <Box sx={{ textAlign: "right", flexShrink: 0, maxWidth: 180 }}>
          <Typography
            sx={{ fontSize: 12, color: "var(--text-secondary)", mb: 0.25 }}
          >
            {msg.complaint}
          </Typography>
          <Typography sx={{ fontSize: 10, color: "var(--text-muted)" }}>
            {msg.time}
          </Typography>
        </Box>

        <IconButton
          size="small"
          sx={{ color: "var(--text-muted)", flexShrink: 0 }}
        >
          <MoreVertIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
      {!isLast && (
        <Divider sx={{ borderColor: "var(--border-subtle)", mx: 0.5 }} />
      )}
    </>
  );
}
