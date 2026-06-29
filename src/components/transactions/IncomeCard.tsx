import { Box, Typography, Chip, Divider } from "@mui/material";
import { formatNaira } from "../../utils/hook";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { IncomeCard } from "../../types/transaction";

export function IncomeCard({ card }: { card: IncomeCard }) {
  const positive = card.trend >= 0;
  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        transition: "background-color 0.25s",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 13,
              color: "var(--text-primary)",
              letterSpacing: "0.04em",
            }}
          >
            {card.label}
          </Typography>
          <Typography
            sx={{ fontSize: 10.5, color: "var(--text-muted)", mt: 0.25 }}
          >
            Income
          </Typography>
        </Box>
        <Chip
          label="Today"
          size="small"
          sx={{
            height: 24,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: "rgba(245,197,24,0.18)",
            color: "var(--accent-gold)",
            border: "1px solid rgba(245,197,24,0.25)",
            "& .MuiChip-label": { px: 1.25 },
          }}
        />
      </Box>

      {/* Divider line */}
      <Divider sx={{ borderColor: "var(--border-subtle)" }} />

      {/* Amount + trend */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 22,
            color: "var(--text-primary)",
            letterSpacing: "-0.5px",
          }}
        >
          {formatNaira(card.amount)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            px: 0.75,
            py: 0.25,
            borderRadius: "6px",
            backgroundColor: positive
              ? "rgba(76,175,80,0.12)"
              : "rgba(239,83,80,0.12)",
          }}
        >
          {positive ? (
            <TrendingUpIcon sx={{ fontSize: 13, color: "#4CAF50" }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 13, color: "#EF5350" }} />
          )}
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: positive ? "#4CAF50" : "#EF5350",
            }}
          >
            {Math.abs(card.trend)}%
          </Typography>
        </Box>
      </Box>

      {/* Compared */}
      <Typography sx={{ fontSize: 11, color: "var(--text-muted)" }}>
        Compared to{" "}
        <span style={{ color: "var(--text-secondary)" }}>
          N{card.comparedAmount.toFixed(2)}
        </span>{" "}
        yesterday
      </Typography>

      {/* Last week row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 11, color: "var(--text-muted)" }}>
          Last Weeks Income
        </Typography>
        <Typography
          sx={{ fontSize: 12, fontWeight: 600, color: "var(--accent-gold)" }}
        >
          {formatNaira(card.lastWeekIncome)}
        </Typography>
      </Box>
    </Box>
  );
}
