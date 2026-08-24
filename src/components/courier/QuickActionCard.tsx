import { Box, Typography, IconButton } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

interface Props {
  links: string[];
  onSelect?: (link: string) => void;
}

export default function QuickActionsCard({ links, onSelect }: Props) {
  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: "16px",
        p: 3,
        border: "1px solid var(--border, rgba(255,255,255,0.1))",
        background:
          "linear-gradient(160deg, rgba(255,215,0,0.06), var(--bg-card) 55%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
            Quick Actions
          </Typography>
          <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
            quick links
          </Typography>
        </Box>
        <IconButton
          sx={{
            width: 40,
            height: 40,
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "var(--text-primary)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
          }}
        >
          <ArrowForwardRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map((link) => (
          <Box
            key={link}
            onClick={() => onSelect?.(link)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              transition: "color 0.15s ease",
              "&:hover": { color: "var(--accent-gold, #FFD700)" },
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--text-primary)",
              }}
            />
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              {link}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}