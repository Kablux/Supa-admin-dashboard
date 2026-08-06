import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { fetchTrips, getDashboardStats } from "../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { TRIP_TAB_MAPPING } from "../types/common.types";
import SearchFilterRow from "../components/SearchFilterRow";
import TripsTable from "../components/trips/TripsTable";
import TripDetailsModal from "../components/trips/TripDetailModal";
import TripFilters, { TripFilterState } from "../components/trips/TripFilterDrawer";
import { setCurrentPage } from "../redux/slices/Drivers";
type UITabType = keyof typeof TRIP_TAB_MAPPING;

export default function TripsPage() {
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<UITabType>("all");
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<TripFilterState>({});
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const {
    items: tripList,
    totalCount,
    currentPage,
    isLoading,
  } = useAppSelector((state) => state.trips);
  const { liveTripsSummary } = useAppSelector((state) => state.dashboard);

  // Stable dependency for the filters object.
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchTrips({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery,
        status: TRIP_TAB_MAPPING[activeTab], // status comes from the tabs
        ...filters, 
      }),
    );
  }, [dispatch, currentPage, pageSize, activeTab, searchQuery, filterKey]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleTabChange = (tab: UITabType) => {
    setActiveTab(tab);
    dispatch(setCurrentPage(1));
  };

  const handleFiltersChange = (next: TripFilterState) => {
    setFilters(next);
    dispatch(setCurrentPage(1));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage + 1));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    dispatch(setCurrentPage(1));
  };

  const liveStats: OverviewItem[] = [
    {
      title: "Live Trip",
      value: liveTripsSummary.active,
      icon: <DirectionsCarIcon />,
    },
    {
      title: "Completed Trip",
      value: liveTripsSummary.completed,
      icon: <CheckCircleIcon color="success" />,
    },
    {
      title: "Cancelled Trip",
      value: liveTripsSummary.cancelled,
      icon: <CancelIcon color="error" />,
    },
    {
      title: "Total Trip",
      value: totalCount,
      icon: <ReceiptLongIcon />,
    },
  ];

  return (
    <Box
      className="fade-in"
      sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3.5 }}
    >
      {/* Search Input */}
      <SearchFilterRow
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for live rides by name or email"
      />

      {/* Overview Cards Block */}
      <OverviewCards items={liveStats} loading={isLoading} />

      {/* Status tabs (left) + Filters trigger (right) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {(["all", "active", "completed", "cancelled"] as const).map((tab) => (
            <Typography
              key={tab}
              onClick={() => handleTabChange(tab)}
              sx={{
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                textTransform: "capitalize",
                color:
                  activeTab === tab ? "var(--accent-gold)" : "secondary.main",
                position: "relative",
                pb: 0.5,
                transition: "color 0.2s",
                "&::after":
                  activeTab === tab
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "2px",
                        backgroundColor: "var(--accent-gold)",
                      }
                    : {},
              }}
            >
              {tab}
            </Typography>
          ))}
        </Box>

        <TripFilters value={filters} onChange={handleFiltersChange} />
      </Box>

      {/* Trips Table  */}
      <TripsTable
        isLoading={isLoading}
        tripsList={tripList}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handleChangePage}
        onPageSizeChange={handlePageSizeChange}
        onViewTrip={(id) => setSelectedTripId(id)}
      />

      <TripDetailsModal
        tripId={selectedTripId}
        isOpen={!!selectedTripId}
        onClose={() => setSelectedTripId(null)}
      />
    </Box>
  );
}