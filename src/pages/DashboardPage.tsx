import React, { useEffect } from "react";
import { Box } from "@mui/material";
import FilterBar from "../components/dashboard/FilterBar.js";
import StatCard from "../components/dashboard/StatCard.js";
import QuickActions from "../components/dashboard/QuickActions.js";
import FinanceAnalytics from "../components/dashboard/FinanceAnalytics.js";
import MessagesPanel from "../components/dashboard/MessagesPanel.js";
import { getDashboardStats } from "../api/xhrHelper.js";
import { useAppDispatch, useAppSelector } from "../redux/hooks.js";
import { Stat } from "../types/common.types";

export default function DashboardPage() {
  const dispatch = useAppDispatch();

const { totalUsers, totalDrivers } =
  useAppSelector(
    (state) => state.dashboard
  );

useEffect(() => {
  dispatch(getDashboardStats());
}, [dispatch]);

const statsData: Stat[] = [
  {
    id: "live_trips",
    label: "Live Trips",
    value: "45",
    icon: "DirectionsCar",
    color: "#FEB40E",
    bg: "#2a2000",
    trend: "+12%",
    trendUp: true,
  },
  {
    id: "total_users",
    label: "Total Users",
    value: totalUsers.toLocaleString(),
    icon: "PeopleAlt",
    color: "#1565C0",
    bg: "#2A409F",
    trend: "+8%",
    trendUp: true,
  },
  {
    id: "total_partners",
    label: "Total Drivers",
    value: totalDrivers.toLocaleString(),
    icon: "Handshake",
    color: "#D21248",
    bg: "#2a0020",
    trend: "+5%",
    trendUp: true,
  },
  {
    id: "revenue",
    label: "Revenue",
    value: "₦0",
    icon: "AccountBalanceWallet",
    color: "#4B6D4D",
    bg: "#002000",
    trend: "+0%",
    trendUp: true,
  },
];

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
