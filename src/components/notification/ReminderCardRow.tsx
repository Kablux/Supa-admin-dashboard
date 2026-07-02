import { Box, Avatar, Typography, IconButton, Divider } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export function ReminderCardRow({
  title,
  subtitle,
  time,
  avatar,
  isLast,
}: {
  title: string;
  subtitle: string;
  time: string;
  avatar: string | null;
  isLast: boolean;
}): React.ReactElement {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          py: 1.5,
          px: 0.5,
          cursor: "pointer",
          transition: "background 0.15s",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.03)" },
        }}
      >
        <Avatar
          src={avatar ?? undefined}
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            bgcolor: "rgba(245,197,24,0.15)",
            border: "1.5px solid var(--border)",
          }}
        >
          🚗
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
            {subtitle}
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}
        >
          <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
            {time}
          </Typography>
          <IconButton size="small" sx={{ color: "var(--text-muted)" }}>
            <MoreVertIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>
      </Box>
      {!isLast && (
        <Divider sx={{ borderColor: "var(--border-subtle)", mx: 0.5 }} />
      )}
    </>
  );
}
