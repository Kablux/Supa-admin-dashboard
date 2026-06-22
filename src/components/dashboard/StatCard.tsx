import React, { useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import * as Icons from "@mui/icons-material";
import { Stat } from "../../types/common.types";
import StatsModal from "./StatsModal";

interface DynamicIconProps {
  name: keyof typeof Icons;
}

interface StatCardProps {
  stat: Stat;
  delay?: number;
  loading?: boolean;
}

const DynamicIcon = ({ name }: DynamicIconProps) => {
  const IconComponent = Icons[name];

  return IconComponent ? <IconComponent sx={{ fontSize: 16 }} /> : null;
};

export default function StatCard({
  stat,
  delay = 0,
  loading = false,
}: StatCardProps) {
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
        </Box>

        {/* Bottom row */}
        <Box className="py-4">
          <Typography
            sx={{ fontSize: 11, color: "rgba(255,255,255,0.48)", mb: 0.25 }}
          >
            {loading ? (
              <Skeleton
                variant="text"
                width={80}
                sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
              />
            ) : (
              stat.label
            )}
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
              {loading ? (
                <Skeleton
                  variant="text"
                  width={100}
                  height={36}
                  sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
                />
              ) : (
                stat.value
              )}
            </Typography>
            {loading ? (
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
              />
            ) : (
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
            )}
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
