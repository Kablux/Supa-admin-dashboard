import { Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export function StarRating({ rating }: { rating: string }): React.ReactElement {
  const value = Math.max(0, Math.min(5, Math.round(parseFloat(rating) || 0)));
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
      {Array.from({ length: 5 }).map((_, i) =>
        i < value ? (
          <StarIcon
            key={i}
            sx={{ fontSize: 13, color: "var(--accent-gold)" }}
          />
        ) : (
          <StarBorderIcon
            key={i}
            sx={{ fontSize: 13, color: "var(--text-muted)" }}
          />
        ),
      )}
    </Box>
  );
}
