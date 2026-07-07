import { Box, Typography, IconButton } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  title: string;
  subtitle: string;
  items: string[];
}

export default function PremiumInfoCard({ title, subtitle, items }: Props) {
  return (
    <Box
      sx={{
        background: "var(--bg-card)",
        borderRadius: "16px",
        p: 4,
        minHeight: 220,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 24,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: "var(--text-secondary)",
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        <IconButton
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#a4a4a44f",
            borderRadius: "100%",
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
        </IconButton>
      </Box>

      {items.map((item) => (
        <Box
          key={item}
          sx={{
            mb: 2,
            display: "flex",
            gap: 2,
          }}
        >
          <IconButton>
            <CircleIcon sx={{ fontSize: 12 }} />
          </IconButton>{" "}
          {item}
        </Box>
      ))}
    </Box>
  );
}
