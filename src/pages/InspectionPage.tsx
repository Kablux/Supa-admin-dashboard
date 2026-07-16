import {
  Box,
  Chip,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import AppButton from "../components/common/AppButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { InspectedCar } from "../types/common.types";
import { HeroBanner } from "../components/inspection/HeroBanner";
import { CarTypeDonut } from "../components/inspection/CarTypeDonut";
import { setFilter, setSearch } from "../redux/slices/Inspection";
import { FILTER_TABS, STATUS_CFG } from "../data/inspectionData";
import { CarCard } from "../components/inspection/CarCard";



export default function InspectionPage(): React.ReactElement {
  const dispatch = useAppDispatch();
  const { cars, filter, search } = useAppSelector((s) => s.inspection);

  const [selectedCar, setSelectedCar] = useState<InspectedCar | null>(null);

  const filtered = useMemo(() => {
    let list = cars;
    if (filter !== "all") list = list.filter((c) => c.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.make.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.ownerName.toLowerCase().includes(q),
      );
    }
    return list;
  }, [cars, filter, search]);

  // Status summary counts
  const counts = useMemo(
    () => ({
      all: cars.length,
      approved: cars.filter((c) => c.status === "approved").length,
      pending: cars.filter((c) => c.status === "pending").length,
      failed: cars.filter((c) => c.status === "failed").length,
    }),
    [cars],
  );

  return (
    <Box
      className="fade-in"
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      {/* ── Row 1: hero + donut chart ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1.1fr" },
          gap: 2.5,
          alignItems: "stretch",
        }}
      >
        <HeroBanner />
        <CarTypeDonut />
      </Box>

      {/* ── Filter tabs + search ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        {/* Tabs */}
        <Box sx={{ display: "flex", gap: 0 }}>
          {FILTER_TABS.map((tab) => {
            const isActive = filter === tab.key;
            const count = counts[tab.key];
            return (
              <Box
                key={tab.key}
                onClick={() => dispatch(setFilter(tab.key))}
                sx={{
                  px: 1.75,
                  py: 0.75,
                  cursor: "pointer",
                  userSelect: "none",
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--accent-gold)" : "var(--text-muted)",
                  borderBottom: isActive
                    ? "2px solid var(--accent-gold)"
                    : "2px solid transparent",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                {tab.label}
                {count > 0 && (
                  <Chip
                    label={count}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      fontWeight: 600,
                      backgroundColor: isActive
                        ? "rgba(245,197,24,0.18)"
                        : "var(--border)",
                      color: isActive
                        ? "var(--accent-gold)"
                        : "var(--text-muted)",
                      "& .MuiChip-label": { px: 0.6 },
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Search */}
        {/* <TextField
          size="small"
          placeholder="Search cars, owners..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ fontSize: 15, color: "var(--text-muted)" }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: 230,
            "& .MuiOutlinedInput-root": {
              fontSize: 12.5,
              borderRadius: "10px",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              "& fieldset": { borderColor: "var(--border)" },
              "&:hover fieldset": { borderColor: "var(--accent-gold)" },
              "&.Mui-focused fieldset": {
                borderColor: "var(--accent-gold)",
                borderWidth: "1px",
              },
            },
          }}
        /> */}
      </Box>

      {/* ── Car cards grid ── */}
      {filtered.length === 0 ? (
        <Box
          sx={{
            py: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "20px",
              backgroundColor: "var(--accent-gold-glow)",
              border: "1px solid rgba(245,197,24,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)",
              fontSize: 32,
            }}
          >
            🚗
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 18,
              color: "var(--text-primary)",
            }}
          >
            No cars found
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: "var(--text-muted)",
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            {filter !== "all"
              ? `No cars with status "${STATUS_CFG[filter as keyof typeof STATUS_CFG]?.label}".`
              : "No cars match your search."}
          </Typography>
          {(filter !== "all" || search) && (
            <AppButton
              size="small"
              onClick={() => {
                dispatch(setFilter("all"));
                dispatch(setSearch(""));
              }}
            >
              Clear filters
            </AppButton>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} onAction={setSelectedCar} />
          ))}
        </Box>
      )}

      {/* ── Action modal ── */}
      {/* <ActionModal car={selectedCar} onClose={() => setSelectedCar(null)} /> */}
    </Box>
  );
}
