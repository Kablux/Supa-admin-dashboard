import React from "react";
import { Box, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

interface TransactionSummaryCardsProps {
  totalIncome: string;
  totalExpense: string;
  calculatedBalance: number;
}

export default function TransactionSummaryCards({
  totalIncome,
  totalExpense,
  calculatedBalance,
}: TransactionSummaryCardsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
        gap: 2.5,
      }}
    >
      {/* Total Income Card */}
      <Box
       sx={{
                backgroundColor: "var(--bg-card, #1A1D26)",
                border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
                borderRadius: "16px",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,

                // Shadow and hover effect
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                transition: "box-shadow 0.25s ease, border-color 0.25s ease",

                "&:hover": {
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                borderColor: "rgba(255, 190, 24, 0.25)",
                },
            }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              backgroundColor: "rgba(52, 211, 153, 0.1)",
              color: "#34D399",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpwardIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
            Total Income
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>
          ₦{Number(totalIncome || 0).toLocaleString()}
        </Typography>
      </Box>

      {/* Total Expense Card */}
      <Box
         sx={{
                backgroundColor: "var(--bg-card, #1A1D26)",
                border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
                borderRadius: "16px",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,

                // Shadow and hover effect
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                transition: "box-shadow 0.25s ease, border-color 0.25s ease",

                "&:hover": {
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                borderColor: "rgba(255, 190, 24, 0.25)",
                },
            }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowDownwardIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
            Total Expense
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>
          ₦{Number(totalExpense || 0).toLocaleString()}
        </Typography>
      </Box>

      {/* Total Balance Card */}
      <Box
        sx={{
          backgroundColor: "var(--accent-gold)",
          borderRadius: "16px",
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#000",
        //   boxShadow: "0 10px 25px rgba(124, 77, 255, 0.25)",
          
          boxShadow: "0 8px 24px rgba(255, 190, 24, 0.12)",
            transition: "box-shadow 0.25s ease, transform 0.25s ease",
            "&:hover": {
            boxShadow: "0 12px 30px rgba(255, 190, 24, 0.2)",
            transform: "translateY(-2px)",
},
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, opacity: 0.9 }}>Total Balance</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              backgroundColor: "rgba(0,0,0,0.1)",
              px: 1,
              py: 0.5,
              borderRadius: "6px",
              fontSize: 11,
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 14 }} /> NGN
          </Box>
        </Box>
        <Box sx={{ my: 1.5 }}>
          <Typography sx={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
            ₦{calculatedBalance.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}