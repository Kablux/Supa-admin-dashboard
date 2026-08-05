import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import { fetchRiders, getDashboardStats } from "../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentPage } from "../redux/slices/Riders";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import RidersTable from "../components/rider/RidersTable";
import { TAB_MAPPING } from "../types/common.types";
import RiderDetailsModal from "../components/rider/RideDetailsModal";

import SearchFilterRow from "../components/SearchFilterRow";
import RiderFilters, { RiderFilterState } from "../components/rider/RiderFilter";

type UITabType = keyof typeof TAB_MAPPING;

export default function RidersPage() {
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<UITabType>("all");
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<RiderFilterState>({});
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const { ridersummary } = useAppSelector((state) => state.dashboard);
  const {
    items: ridersList,
    totalCount,
    currentPage,
    isLoading,
  } = useAppSelector((state) => state.riders);

  // Stable dependency for the filters object.
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchRiders({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery,
        status: TAB_MAPPING[activeTab], // status comes from the tabs
        ...filters, // period, created_at_after, created_at_before
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

  const handleFiltersChange = (next: RiderFilterState) => {
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

  const riderStats: OverviewItem[] = [
    {
      title: "Total Rider",
      value: ridersummary?.total,
      icon: <PeopleIcon />,
    },
    {
      title: "Active Rider",
      value: ridersummary?.active,
      icon: <CheckCircleIcon color="success" />,
    },
    {
      title: "Pending Verification",
      value: "N/A",
      icon: <VisibilityIcon color="secondary" />,
    },
    {
      title: "Suspended Rider",
      value: ridersummary?.suspended,
      icon: <BlockIcon color="error" />,
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
        placeholder="Search for a rider by name or email"
      />

      {/* Overview Cards Block */}
      <OverviewCards items={riderStats} loading={isLoading} />

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
          {(["all", "active", "pending", "suspended"] as const).map((tab) => (
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

        <RiderFilters value={filters} onChange={handleFiltersChange} />
      </Box>

      {/* Riders Table  */}
      <RidersTable
        isLoading={isLoading}
        ridersList={ridersList}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handleChangePage}
        onPageSizeChange={handlePageSizeChange}
        onViewRider={(id) => setSelectedRiderId(id)}
      />

      {/* Details modal */}
      <RiderDetailsModal
        riderId={selectedRiderId}
        isOpen={!!selectedRiderId}
        onClose={() => setSelectedRiderId(null)}
      />
    </Box>
  );
}