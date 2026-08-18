import React, { useEffect, useState, useMemo } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LeakAddIcon from "@mui/icons-material/LeakAdd";
import BlockIcon from "@mui/icons-material/Block";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { getDashboardStats, fetchRideRequests } from "../api/xhrHelper";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import RideRequestTable from "../components/ride-request/RideRequestTable";
import SearchFilterRow from "../components/SearchFilterRow";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RIDE_REQUEST_TAB } from "../types/common.types";
import RideRequestFilters, {
  RideRequestFilterState,
  initialFilterState,
} from "../components/ride-request/RideRequestFilter";
import { setCurrentPage } from "../redux/slices/RideRequests";
import RequestDetailModal from "../components/ride-request/RequestDetailModal";
import ExportRideRequestsModal from "../components/ride-request/ExportRideRequestModal";

type UITabType = keyof typeof RIDE_REQUEST_TAB;

export default function RideRequestPage() {
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<UITabType>("all");
  const [selectedRideRequestId, setSelectedRideRequestId] = useState<
    string | null
  >(null);
const [exportOpen, setExportOpen] = useState(false);
  const [filters, setFilters] =
    useState<RideRequestFilterState>(initialFilterState);

  const requestsummary = useAppSelector(
    (state) => state.dashboard.requestsummary,
  );
  const {
    items: rideRequestList,
    totalCount,
    currentPage,
    isLoading,
  } = useAppSelector((state) => state.rideRequest);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  // Handle the API fetching
  useEffect(() => {
    const getBool = (val: string) =>
      val === "true" ? true : val === "false" ? false : undefined;

    dispatch(
      fetchRideRequests({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery || undefined,
        status: RIDE_REQUEST_TAB[activeTab] || undefined,
        // Map drawer filters
        type: filters.type || undefined,
        payment_method: filters.payment_method || undefined,
        period: filters.period || undefined,
        created_at_after: filters.created_at_after || undefined,
        created_at_before: filters.created_at_before || undefined,
        dispatch_status: filters.dispatch_status || undefined,
        rider: filters.rider || undefined,
        driver: filters.driver || undefined,
        is_scheduled: getBool(filters.is_scheduled),
        is_expired: getBool(filters.is_expired),
       
      }),
    );
  }, [dispatch, currentPage, pageSize, searchQuery, activeTab, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleTabChange = (tab: UITabType) => {
    setActiveTab(tab);
    dispatch(setCurrentPage(1));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage + 1));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    dispatch(setCurrentPage(1));
  };

  const handleFiltersChange = (newFilters: RideRequestFilterState) => {
    setFilters(newFilters);
    dispatch(setCurrentPage(1));
  };

  const handleRemoveSingleFilter = (key: keyof RideRequestFilterState) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
    dispatch(setCurrentPage(1));
  };

  // Compute active filters for rendering chips
  const activeChips = useMemo(() => {
    return Object.entries(filters)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => ({
        key: key as keyof RideRequestFilterState,
        value,
      }));
  }, [filters]);

  const requestStats: OverviewItem[] = [
    {
      title: "Total Request",
      value: requestsummary?.total || 0,
      icon: <PeopleIcon />,
    },
    {
      title: "Searching",
      value: requestsummary?.searching || 0,
      icon: <SearchIcon sx={{ color: "#4A90E2" }} />,
    },
    {
      title: "Pending",
      value: requestsummary?.pending || 0,
      icon: <VisibilityIcon color="secondary" />,
    },
    {
      title: "Matched",
      value: requestsummary?.matched || 0,
      icon: <LeakAddIcon color="success" />,
    },
    {
      title: "Cancelled",
      value: requestsummary?.cancelled || 0,
      icon: <BlockIcon color="error" />,
    },
    {
      title: "Expired",
      value: requestsummary?.expired || 0,
      icon: <RunningWithErrorsIcon />,
    },
  ];

  return (
    <Box
      className="fade-in"
      sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3.5 }}
    >
      {/* Search */}
      <SearchFilterRow
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for a ride request"
      />

      {/* Overview Cards */}
      <OverviewCards items={requestStats} loading={isLoading} />

      <Box>
        {/* Tabs and Filter Trigger */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mt: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 3,flexWrap: "wrap", }}>
            {(
              [
                "all",
                "pending",
                "searching",
                "matched",
                "cancelled",
                "expired",
              ] as const
            ).map((tab) => (
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

          {/* New Filter Component Trigger */}
             <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            onClick={() => setExportOpen(true)}
            startIcon={<FileDownloadRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 40,
              px: 2,
              textTransform: "none",
              fontSize: 13.5,
              fontWeight: 600,
              borderRadius: "10px",
              color: "var(--text-primary)",
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border, rgba(255,255,255,0.12))",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.25)",
                backgroundColor: "rgba(255,255,255,0.06)",
              },
            }}
          >
            Export
          </Button>
          <RideRequestFilters filters={filters} onChange={handleFiltersChange} />
        </Box>
        </Box>

        {/* Active Filter Chips (Renders right below tabs if any filter is active) */}
        {activeChips.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Active Filters:
            </Typography>
            {activeChips.map((chip) => (
              <Chip
                key={chip.key}
                label={`${chip.key.replace("_", " ")}: ${
                  chip.value === "true"
                    ? "Yes"
                    : chip.value === "false"
                      ? "No"
                      : chip.value
                }`}
                onDelete={() => handleRemoveSingleFilter(chip.key)}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ textTransform: "capitalize" }}
              />
            ))}
            <Typography
              variant="body2"
              color="error"
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
                ml: 1,
              }}
              onClick={() => handleFiltersChange(initialFilterState)}
            >
              Clear All
            </Typography>
          </Box>
        )}
      </Box>

      {/* Ride Request Table */}
      <RideRequestTable
        isLoading={isLoading}
        rideRequestList={rideRequestList}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handleChangePage}
        onPageSizeChange={handlePageSizeChange}
        onViewRequest={(rideId) => setSelectedRideRequestId(rideId)}
      />

      {/*Render the details modal here */}
      <RequestDetailModal
        rideRequestId={selectedRideRequestId}
        isOpen={!!selectedRideRequestId}
        onClose={() => setSelectedRideRequestId(null)}
      />
      
        <ExportRideRequestsModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
       params={{
  search: searchQuery || undefined,
  status: RIDE_REQUEST_TAB[activeTab] || undefined,
  ...filters,
  is_scheduled: filters.is_scheduled ? filters.is_scheduled === "true" : undefined,
  is_expired: filters.is_expired ? filters.is_expired === "true" : undefined,
  period: filters.period || undefined,
}}
      />
    </Box>
  );
}
