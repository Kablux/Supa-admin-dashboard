import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FilterBar from "../components/dashboard/FilterBar";
import StatCard from "../components/dashboard/StatCard";
import QuickActions from "../components/dashboard/QuickActions";
import FinanceAnalytics from "../components/dashboard/FinanceAnalytics";
import MessagesPanel from "../components/dashboard/MessagesPanel";
import { getDashboardStats } from "../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Stat } from "../types/common.types";
import MapWidget from "../components/dashboard/map/MapWidget";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PushNotificationModal from "../components/dashboard/PushNotModal";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const [pushOpen, setPushOpen] = useState(false);

  const {
    totalUsers,
    totalDrivers,
    liveTripsSummary,
    referralsSummary,
    usersummary,
    ridersummary,
    requestsummary,
    driversummary,
    isLoading,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  // ── Template Download Handler ──
  const handleDownloadTemplate = () => {
    try {
      const templateData = [
        {
          user_id: "123456789abcdef",
        },
        
      ];

      // Create a new worksheet from the array of objects
      const worksheet = XLSX.utils.json_to_sheet(templateData);

      // Create a workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

      // Trigger file download
      XLSX.writeFile(workbook, "push_notification_template.xlsx");
      toast.success("Template downloaded successfully!");
    } catch (error) {
      console.error("Failed to download template:", error);
      toast.error("Failed to download template file");
    }
  };

  const statsData: Stat[] = [
    {
      id: "live_trips",
      label: "Live Trips",
      value: liveTripsSummary.active,
      icon: "DirectionsCar",
      color: "#FEB40E",
      bg: "#2a2000",
      trendUp: true,
      description: "",
      details: [
        { label: "Active", value: liveTripsSummary.active },
        { label: "Completed", value: liveTripsSummary.completed },
        { label: "Cancelled", value: liveTripsSummary.cancelled },
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
        { label: "Active", value: usersummary.active },
        { label: "Suspended", value: usersummary.suspended },
        { label: "Total", value: usersummary.total },
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
        { label: "Active", value: driversummary.online },
        { label: "In Review", value: driversummary.pending_kyc },
        { label: "Pending", value: driversummary.not_started_kyc },
        { label: "Suspended", value: driversummary.suspended },
        { label: "Total", value: driversummary.total },
      ],
    },
    {
      id: "rider_summary",
      label: "Riders",
      value: ridersummary.total.toLocaleString(),
      icon: "Person",
      color: "#FF9800",
      bg: "#3A2300",
      trendUp: true,
      description: "Registered riders on the platform.",
      details: [
        { label: "Active", value: ridersummary.active },
        { label: "Pending", value: ridersummary.pending_verification },
        { label: "Suspended", value: ridersummary.suspended },
        { label: "Total", value: ridersummary.total },
      ],
    },
    {
      id: "ride_requests",
      label: "Ride Requests",
      value: requestsummary.total.toLocaleString(),
      icon: "Search",
      color: "#00C2A8",
      bg: "#073B37",
      trendUp: true,
      description: "Incoming ride requests across the platform.",
      details: [
        { label: "Searching", value: requestsummary.searching },
        { label: "Pending", value: requestsummary.pending },
        { label: "Matched", value: requestsummary.matched },
        { label: "Cancelled", value: requestsummary.cancelled },
        { label: "Expired", value: requestsummary.expired },
        { label: "Total", value: requestsummary.total },
      ],
    },
    {
      id: "referrals",
      label: "Referrals",
      value: referralsSummary.total.toLocaleString(),
      icon: "GroupAdd",
      color: "#7C4DFF",
      bg: "#24154B",
      trendUp: true,
      description: "Successful referrals across riders and drivers.",
      details: [
        { label: "Drivers", value: referralsSummary.driver },
        { label: "Riders", value: referralsSummary.rider },
        { label: "Total", value: referralsSummary.total },
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
        { label: "Not available", value: 0 },
        { label: "Not available", value: 0 },
        { label: "Not available", value: 0 },
      ],
    },
  ];

  return (
    <Box className="fade-in" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* Filter + search bar & Push Notification Action Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <FilterBar />

        {/* Push notification compose container with Download Template & Compose button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          {/* Download Template Button */}
          <Button
            onClick={handleDownloadTemplate}
            startIcon={<DownloadRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: "none",
              fontSize: 13.5,
              fontWeight: 600,
              borderRadius: "10px",
              px: 2,
              py: 1,
              backgroundColor: "rgba(255,255,255,0.03)",
              color: "var(--text-primary)",
              border: "1px solid var(--border, rgba(255,255,255,0.12))",
              "&:hover": {
                borderColor: "var(--accent-gold, #FFD700)",
                backgroundColor: "rgba(255,215,0,0.04)",
              },
            }}
          >
            Download Template
          </Button>

          {/* Push Compose Box */}
          <Box
            onClick={() => setPushOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 0.8,
              borderRadius: "14px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              cursor: "pointer",
              transition: "border-color 0.15s ease",
              "&:hover": { borderColor: "var(--accent-gold, #FFD700)" },
            }}
          >
            <CampaignRoundedIcon sx={{ color: "var(--accent-gold, #FFD700)" }} />
            <Typography
              sx={{ display: { xs: "none", sm: "block" }, fontSize: 13.5, color: "var(--text-secondary)" }}
            >
              Send push notification…
            </Typography>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setPushOpen(true);
              }}
              startIcon={<SendRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: "none",
                fontSize: 13.5,
                fontWeight: 700,
                borderRadius: "10px",
                px: 2,
                py: 0.8,
                backgroundColor: "var(--accent-gold, #FFD700)",
                color: "#000",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--accent-gold, #FFD700)",
                  boxShadow: "0 4px 12px rgba(255,215,0,0.25)",
                },
              }}
            >
              Compose
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Row 1 — 4 stat cards + quick actions panel */}
      <Box className="flex justify-between gap-4">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
              lg: "1fr 1fr 1fr 1fr 1fr",
              xl: "1fr 1fr 1fr 1fr",
            },
            gap: 2,
            width: { xs: "100%", xl: "75%" },
          }}
        >
          {statsData.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} delay={i * 70} loading={isLoading} />
          ))}
        </Box>
        <Box
          sx={{
            display: { xs: "none", xl: "block" },
            height: "max-content",
            width: { xs: "100%", xl: "25%" },
          }}
        >
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

      {/* Push notification modal */}
      <PushNotificationModal isOpen={pushOpen} onClose={() => setPushOpen(false)} />
    </Box>
  );
}