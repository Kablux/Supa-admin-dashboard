import React from "react";
import { Box } from "@mui/material";
import FilterBar from "../components/dashboard/FilterBar.js";
import StatCard from "../components/dashboard/StatCard.js";
import QuickActions from "../components/dashboard/QuickActions.js";
import FinanceAnalytics from "../components/dashboard/FinanceAnalytics.js";
import MessagesPanel from "../components/dashboard/MessagesPanel.js";
import { statsData } from "../data/mockData";

export default function DashboardPage() {
  return (
    <Box
      className="fade-in"
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      {/* Filter + search bar */}
      <FilterBar />

      {/* Row 1 — 4 stat cards + quick actions panel */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "1fr 1fr 1fr 1fr",
            xl: "1fr 1fr 1fr 1fr 1.35fr",
          },
          gap: 2,
        }}
      >
        {statsData.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} delay={i * 70} />
        ))}
        <Box sx={{ display: { xs: "none", xl: "block" } }}>
          <QuickActions />
        </Box>
      </Box>

      <Box sx={{ display: { xs: "block", xl: "none" } }}>
        <QuickActions />
      </Box>

      {/* Row 2 — Live map */}
      {/* <MapWidget /> */}

      {/* Row 3 — Finance analytics + Messages panel */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <FinanceAnalytics />
        <MessagesPanel />
      </Box>
    </Box>
  );
}
