import { Box, Typography, Divider } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { fetchFleetData } from "../api/xhrHelper";
import FleetInfoCard from "../components/fleet/FleetInfoCard";
import StatCard from "../components/fleet/StatCard";
import FleetStatusCard from "../components/fleet/StatusCard";
import FleetTransactionsTable from "../components/fleet/FleetTable";
import FleetVehicleShowcase from "../components/fleet/FleetShowcase";

export default function FleetPage() {
  const dispatch = useAppDispatch();

  const { stats, reminders, pairings, vehicles, isLoading, owners, status } =
    useAppSelector((state) => state.fleet);

  useEffect(() => {
    dispatch(fetchFleetData());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Stats */}
      {/* <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3,1fr)",
              md: "repeat(4,1fr)",
            },
            gap: 2,
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              loading={isLoading}
              // delay={index * 100}
            />
          ))}
        </Box>
      </Box> */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "450px 1fr" }, // Allocates fixed space for 2x2 stats, rest to hero
          gap: 5,
        }}
      >
        {/* 2x2 Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            alignContent: "start",
          }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              stat={stat}
              loading={isLoading}
              delay={index * 100}
            />
          ))}
        </Box>

        {/* Interactive Vehicle Showcase */}
        {vehicles && (
          <FleetVehicleShowcase vehicles={vehicles} />
        )}
      </Box>

      {/* Feature Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)", // Changed to 3 columns to fit the new card
          },
          gap: 3,
          mb: 4,
        }}
      >
        <FleetInfoCard title="Messages" subtitle="Reminder" items={reminders} />

        <FleetInfoCard
          title="Vehicle Pairing"
          subtitle="Reminder"
          items={pairings}
        />

        {/* Render the new status card and pass the status object */}
        {status && <FleetStatusCard status={status} />}
      </Box>

      {/* Transactions Table */}

      <FleetTransactionsTable data={owners} isLoading={isLoading} />
    </Box>
  );
}
