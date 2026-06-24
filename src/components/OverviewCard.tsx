import React from "react";
import { Box, Skeleton, Typography } from "@mui/material";

export interface OverviewItem {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

interface OverviewCardsProps {
  items: OverviewItem[];
  maxWidth?: number | string;
  loading?: boolean;
}

export default function OverviewCards({
  items,
  maxWidth = 768,
  loading = false,
}: OverviewCardsProps) {
  const totalItems = items.length;

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card, #181818)",
        border: "1px solid var(--border, #222)",
        borderRadius: "14px",
        maxWidth: maxWidth,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: `repeat(${totalItems}, 1fr)`,
        },
        overflow: "hidden",
      }}
      className="text-center"
    >
      {items.map((item, index) => {
        const isLast = index === totalItems - 1;

        return (
          <Box
            key={item.title + index}
            sx={{
              p: 2.5,
              px: 3.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRight: {
                xs: "none",
                md: isLast ? "none" : "1px solid var(--border, #222)",
              },
              borderBottom: {
                xs: isLast ? "none" : "1px solid var(--border, #222)",
                md: "none",
              },
            }}
          >
            {/* Elegant Icon Container */}
            {item.icon && (
              <Box
                sx={{
                  mb: 1,
                  display: "flex",
                  color: "primary.main",
                  "& svg": { fontSize: 22 },
                }}
              >
                {item.icon}
              </Box>
            )}

            <Typography
              sx={{ fontSize: 12, color: "secondary.main", mb: 0.5 }}
            >
              {item.title}
            </Typography>

            <Typography sx={{ fontSize: 24, fontWeight: 700, color: "primary" }}>
              {loading ? (
                <Skeleton
                  variant="text"
                  width={60}
                  sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
                />
              ) : typeof item.value === "number" ? (
                item.value.toLocaleString()
              ) : (
                item.value || "0"
              )}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
