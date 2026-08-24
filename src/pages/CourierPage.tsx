import React from "react";
import { Box } from "@mui/material";
import { RIDERS_INFO, USERS_INFO, FINANCE_DATA, QUICK_LINKS, RECENT_SHIPMENTS } from "../data/data";
import QuickActionsCard from "../components/courier/QuickActionCard";
import CourierInfoCards from "../components/courier/CourierInfoCard";
import RecentShipmentTable from "../components/courier/RecentShipmentTable";
import FinanceAnalyticsChart from "../components/courier/FinanceAnalytics";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function CourierPage() {
  
    const courierStats: OverviewItem[] = [
      {
        title: "Total Rider",
        value: 100,
        icon: <DirectionsBikeRoundedIcon />,
      },
      {
        title: "Active Rider",
        value: 52,
        icon: <PeopleAltRoundedIcon color="success" />,
      },
      {
        title: "Suspended Rider",
        value: 3,
        icon: <BlockRoundedIcon color="error" />,
      },
      {
        title: "Total User",
        value: 112,
        icon: <PersonRoundedIcon color="info" />,
      },
      {
        title: "Total Delivered",
        value: 19,
        icon: <CheckCircleIcon color="success" />,
      },
    ];
  
  return (
    <Box
      className="fade-in"
      sx={{ display: "flex", flexDirection: "column", gap: 3.5, p: 1 }}
    >
       <OverviewCards items={courierStats}  />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.7fr 1fr" },
          gap: 2.5,
          alignItems: "stretch",
        }}
      >
        <FinanceAnalyticsChart data={FINANCE_DATA} />
        <QuickActionsCard links={QUICK_LINKS} />
      </Box>

      {/* Row 3 — recent shipments */}
      <RecentShipmentTable shipments={RECENT_SHIPMENTS} />
    </Box>
  );
}