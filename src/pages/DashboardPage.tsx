import React, { useEffect } from "react";
import { Box } from "@mui/material";
import FilterBar from "../components/dashboard/FilterBar";
import StatCard from "../components/dashboard/StatCard";
import QuickActions from "../components/dashboard/QuickActions";
import FinanceAnalytics from "../components/dashboard/FinanceAnalytics";
import MessagesPanel from "../components/dashboard/MessagesPanel";
import { getDashboardStats } from "../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Stat } from "../types/common.types";
import MapWidget from "../components/dashboard/MapWidget";

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  const {
    totalUsers,
    totalDrivers,
    liveTrips,
    liveTripsSummary,
    usersummary,
    driversummary,
    isLoading,
  } = useAppSelector((state) => state.dashboard);
  // const { isLoading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const statsData: Stat[] = [
    {
      id: "live_trips",
      label: "Total Live Trips",
      value: liveTrips.toLocaleString(),
      icon: "DirectionsCar",
      color: "#FEB40E",
      bg: "#2a2000",
      trendUp: true,
      description: "",

      details: [
        {
          label: "Driver On Way",
          value: liveTripsSummary.driver_on_way,
        },
        {
          label: "Arrived",
          value: liveTripsSummary.arrived,
        },
        {
          label: "Total",
          value: liveTripsSummary.total,
        },
      ],
    },
    {
      id: "total_users",
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: "PeopleAlt",
      color: "#1565C0",
      bg: "#2A409F",
      trendUp: true,
      description: "",
      details: [
        {
          label: "Active",
          value: usersummary.active,
        },
        {
          label: "Suspended",
          value: usersummary.suspended,
        },
        {
          label: "Total",
          value: usersummary.total,
        },
      ],
    },
    {
      id: "total_drivers",
      label: "Total Drivers",
      value: totalDrivers.toLocaleString(),
      icon: "Handshake",
      color: "#D21248",
      bg: "#2a0020",
      trendUp: true,
      description: "Registered drivers currently onboarded on Kablux.",

      details: [
        {
          label: "Active",
          value: driversummary.active,
        },
        {
          label: "Suspended",
          value: driversummary.suspended,
        },
        {
          label: "Total",
          value: driversummary.total,
        },
      ],
    },
    {
      id: "revenue",
      label: "Revenue",
      value: "₦0",
      icon: "AccountBalanceWallet",
      color: "#4B6D4D",
      bg: "#063006",
      trendUp: true,
      description: "Registered drivers currently onboarded on Kablux.",

      details: [
        {
          label: "Not available",
          value: 0,
        },
        {
          label: "Not available",
          value: 0,
        },
        {
          label: "Not available",
          value: 0,
        },
      ],
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
          <StatCard
            key={stat.id}
            stat={stat}
            delay={i * 70}
            loading={isLoading}
          />
        ))}
        <Box sx={{ display: { xs: "none", xl: "block" } }}>
          <QuickActions />
        </Box>
      </Box>

      <Box sx={{ display: { xs: "block", xl: "none" } }}>
        <QuickActions />
      </Box>

      {/* Row 2 — Live map */}
      <MapWidget />

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
