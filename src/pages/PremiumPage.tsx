import { Box } from "@mui/material";
import PremiumInfoCard from "../components/premium/InfoCard";
import { useAppSelector } from "../redux/hooks";
import StatCard from "../components/premium/StatCard";
import { PremiumStat } from "../types/common.types";
import PremiumTransactionsTable from "../components/premium/PremiumTable";
import { premiumTransactions } from "../data/data";

export default function PremiumPage() {
  const { isLoading } = useAppSelector((state) => state.premium);

  const premiumStats: PremiumStat[] = [
    {
      id: "1",
      label: "Daily Revenue",
      value: "450,000",
      icon: "AccountBalanceWallet",
      color: "#F5C518",
      bg: "#4A3600",
    },
    {
      id: "2",
      label: "Wallet",
      value: "100,000",
      icon: "Wallet",
      color: "#7289DA",
      bg: "#111C52",
    },
    {
      id: "3",
      label: "Card Transfer",
      value: "200,000",
      icon: "CreditCard",
      color: "#D81B60",
      bg: "#4A1127",
    },
    {
      id: "4",
      label: "Payout",
      value: "4,000,000",
      icon: "Payments",
      color: "#4CAF50",
      bg: "#1E4B28",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 2.5,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(4,1fr)",
            },
            gap: 2,
          }}
        >
          {premiumStats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              loading={isLoading}
              delay={index * 100}
            />
          ))}
        </Box>

        <PremiumInfoCard
          title="Wallet Transactions"
          subtitle="Transactions"
          items={[
            "Top-ups (card, bank transfer, mobile money)",
            "Adjustments by admin",
            "Incentives & promo credits",
            "Negative balance alerts",
          ]}
        />
      </Box>

      {/* Feature Cards */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 3,
        }}
      >
        <PremiumInfoCard
          title="Payout Management"
          subtitle="Payout"
          items={[
            "Driver settlements",
            "Fleet owner settlements",
            "Failed transfer alerts",
            "Disputed transactions",
          ]}
        />

        <PremiumInfoCard
          title="Reconciliation Tools"
          subtitle="Tools"
          items={[
            "Card gateway reconciliation",
            "Bank settlement differences",
            "Corporate billing reconciliation",
          ]}
        />
      </Box>

      {/* Transactions Table */}
      <PremiumTransactionsTable
        data={premiumTransactions}
        isLoading={isLoading}
      />
    </Box>
  );
}
