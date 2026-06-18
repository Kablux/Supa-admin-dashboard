import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import * as Icons from "@mui/icons-material";
import { Stat } from "../../types/common.types";
import StatsModal from "./StatsModal";

interface DynamicIconProps {
  name: keyof typeof Icons;
}

interface StatCardProps {
  stat: Stat;
  delay?: number;
}

const DynamicIcon = ({ name }: DynamicIconProps) => {
  const IconComponent = Icons[name];

  return IconComponent ? <IconComponent sx={{ fontSize: 16 }} /> : null;
};

export default function StatCard({ stat, delay = 0 }: StatCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Box
        className="card-hover fade-in"
        sx={{
          backgroundColor: stat.bg,
          border: `1px solid ${stat.color}28`,
          borderRadius: "14px",
          p: 2.25,
          cursor: "pointer",
          animationDelay: `${delay}ms`,
          position: "relative",
          overflow: "hidden",
          minHeight: 108,
          maxHeight: 197,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -24,
            right: -24,
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: `${stat.color}0e`,
            pointerEvents: "none",
          },
        }}
      >
        {/* Top row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "8px",
              backgroundColor: `${stat.color}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: stat.color,
            }}
          >
            <DynamicIcon name={stat.icon} />
          </Box>

          {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            px: 0.75,
            py: 0.2,
            borderRadius: "6px",
            backgroundColor: stat.trendUp
              ? "rgba(76,175,80,0.13)"
              : "rgba(239,83,80,0.13)",
          }}
        >
          {stat.trendUp ? (
            <TrendingUpIcon sx={{ fontSize: 11, color: "#4CAF50" }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 11, color: "#EF5350" }} />
          )}
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: stat.trendUp ? "#4CAF50" : "#EF5350",
            }}
          >
            {stat.trend}
          </Typography>
        </Box> */}
        </Box>

        {/* Bottom row */}
        <Box>
          <Typography
            sx={{ fontSize: 11, color: "rgba(255,255,255,0.48)", mb: 0.25 }}
          >
            {stat.label}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 21,
                color: "#fff",
                letterSpacing: "-0.5px",
              }}
            >
              {stat.value}
            </Typography>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: `${stat.color}28`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: stat.color,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 12 }} />
            </Box>
          </Box>
        </Box>
      </Box>
      <StatsModal
        open={open}
        onClose={() => setOpen(false)}
        title={stat.label}
        value={stat.value}
        description={stat.description ?? ""}
        details={stat.details ?? []}
      />
    </>
  );
}
