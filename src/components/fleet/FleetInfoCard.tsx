import { Box, Typography, IconButton, Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Create a flexible type that handles both FleetReminders and VehiclePairings
interface InfoItem {
  id: string;
  avatar: string | null;
  title: string;
  subtitle: string;
  time?: string;
}

interface Props {
  title: string;
  subtitle?: string;
  items: InfoItem[];
}

export default function FleetInfoCard({ title, subtitle, items }: Props) {
  return (
    <Box
      sx={{
        background: "#121212", // Adjusted to match the dark card background
        borderRadius: "16px",
        p: 3,
        minHeight: 220,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 22,
            color: "#ffffff",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.48)",
            fontSize: 14,
            mt: 0.5,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {items.map((item) => (
          <Box
            key={item.id} // Fixed: Must use a string/number ID, not the object itself
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Left side: Avatar and Text */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar
                src={item.avatar || undefined}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                }}
              >
                {item.title[0]}
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#ffffff",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.48)",
                    mt: 0.25,
                  }}
                >
                  {item.subtitle}
                </Typography>
              </Box>
            </Box>

            {/* Right side: Time and Icon Action */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {item.time && (
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.48)",
                  }}
                >
                  {item.time}
                </Typography>
              )}

              <IconButton size="small" sx={{ color: "rgba(255,255,255,0.48)" }}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}