import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { fetchDrivers, fetchTrips, getDashboardStats } from "../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentPage } from "../redux/slices/Drivers";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { TAB_MAPPING } from "../types/common.types";
import { useNavigate } from "react-router-dom";
import SearchFilterRow from "../components/SearchFilterRow";
import TripsTable from "../components/trips/TripsTable";

type UITabType = keyof typeof TAB_MAPPING;

export default function TripsPage() {
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<UITabType>("all");
  const [pageSize, setPageSize] = useState(10);
  const { liveTripsSummary } = useAppSelector((state) => state.dashboard);
  const {
    items: tripList,
    totalCount,
    currentPage,
    isLoading,
  } = useAppSelector((state) => state.trips);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchTrips({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery,
        status: TAB_MAPPING[activeTab],
      }),
    );
  }, [dispatch, currentPage, pageSize, activeTab, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleTabChange = (tab: UITabType) => {
    setActiveTab(tab);
    dispatch(setCurrentPage(1));
  };

  const handleChangePage = (_: any, newPage: number) => {
    dispatch(setCurrentPage(newPage + 1));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    dispatch(setCurrentPage(1));
  };

  const handleFilterToggle = () => {
    console.log("Filter toggled");
  };

  const liveStats: OverviewItem[] = [
    {
      title: "Live Trip",
      value: liveTripsSummary.driver_on_way,
      icon: <DirectionsCarIcon />,
    },
    {
      title: "Total Trip",
      value: liveTripsSummary.total,
      icon: <ReceiptLongIcon />,
    },
  ];

  return (
    <Box
      className="fade-in"
      sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3.5 }}
    >
      {/* Search Input and Filter Row */}
      <SearchFilterRow
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for live rides by name or email"
        onFilterClick={handleFilterToggle}
      />

      {/* Overview Cards Block */}
      <OverviewCards items={liveStats} maxWidth={548} loading={isLoading} />

      {/* Tabs and Add New Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 3 }}>
          {(["all", "approved", "pending", "cancelled"] as const).map((tab) => (
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
        // onViewDriver={(id) => setSelectedTripId(id)}
      />
    </Box>
  );
}
