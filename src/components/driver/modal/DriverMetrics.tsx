import React from "react";
import { Box, Typography } from "@mui/material";
import { MetricBox } from "../../ModalMetricsBox";
import { Driver } from "../../../types/auth";

export default function DriverMetrics({ driver }: { driver: Driver }) {
  return (
    <Box className="flex gap-4 flex-wrap sm:flex-nowrap">
      {/* Points */}
      <Box className="w-[55%]">
        <Typography sx={{ fontSize: 14, mb: 1.5, color: "primary" }}>
          Points
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <MetricBox
            value={driver.loyalty_points || "0"}
            label="Bonus"
            labelColor="#6467F2"
          />
          <MetricBox
            value={driver.mileage_points || "0"}
            label="Millage"
            labelColor="#21C45D"
          />
        </Box>
      </Box>

      {/* Ride overview */}
      <Box className="w-full">
        <Typography sx={{ fontSize: 14, mb: 1.5, color: "primary" }}>
          Ride overview
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <MetricBox
            value={driver.total_rides || "0"}
            label="Total Ride"
            labelColor="#7a92f0"
          />
          <MetricBox
            value={driver.completed_rides || "0"}
            label="Completed"
            labelColor="#50c878"
          />
          <MetricBox
            value={driver.cancelled_rides || "0"}
            label="Canceled"
            labelColor="#ff6b6b"
          />
        </Box>
      </Box>
    </Box>
  );
}