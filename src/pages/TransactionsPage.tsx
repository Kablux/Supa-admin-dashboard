import { Box, Typography } from "@mui/material";
import { BalanceSection } from "../components/transactions/BalanceSection";
import { EarningSummary } from "../components/transactions/EarningSummary";
import { INCOME_CARDS, MICRO_STATS } from "../data/transactionMockData";
import { IncomeCard } from "../components/transactions/IncomeCard";
import { ReviewStatCard } from "../components/transactions/ReviewStatCard";
import { RecentTransactions } from "../components/transactions/RecentTransaction";

export default function TransactionsPage(): React.ReactElement {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box
      className="fade-in"
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      {/* ── Two-column grid ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          gap: 5,
          alignItems: "start",
        }}
      >
        {/* Left column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Header */}
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text-primary)",
              }}
            >
              Todays Earnings
            </Typography>
            <Typography
              sx={{ fontSize: 11, color: "var(--text-muted)", mt: 0.25 }}
            >
              {dateStr}, {timeStr}
            </Typography>
          </Box>

          {/* Income cards */}
          {INCOME_CARDS.map((card) => (
            <IncomeCard key={card.id} card={card} />
          ))}

          {/* Micro stats row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {MICRO_STATS.map((s) => (
              <ReviewStatCard key={s.id} stat={s} />
            ))}
          </Box>
        </Box>

        {/* Right column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <EarningSummary />
          <RecentTransactions />
          <BalanceSection />
          {/* <CardsSection /> */}
        </Box>
      </Box>
    </Box>
  );
}
