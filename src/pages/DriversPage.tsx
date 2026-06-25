import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { fetchDrivers, getDashboardStats } from "../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentPage } from "../redux/slices/Drivers";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import { TAB_MAPPING } from "../types/common.types";
import { useNavigate } from "react-router-dom";
import DriversTable from "../components/driver/DriversTable";
import SearchFilterRow from "../components/SearchFilterRow";
import DriverDetailsModal from "../components/driver/DriverDetailModal";

type UITabType = keyof typeof TAB_MAPPING;

export default function DriversPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<UITabType>("all");
  const [pageSize, setPageSize] = useState(10);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const { driversummary } = useAppSelector((state) => state.dashboard);
  const {
    items: driversList,
    totalCount,
    currentPage,
    isLoading,
  } = useAppSelector((state) => state.drivers);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchDrivers({
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

  const driverStats: OverviewItem[] = [
    {
      title: "Total Drivers",
      value: driversummary?.total,
      icon: <PeopleIcon />,
    },
    {
      title: "Active Drivers",
      value: driversummary?.active,
      icon: <CheckCircleIcon color="success" />,
    },
    {
      title: "Suspended Drivers",
      value: driversummary?.suspended,
      icon: <BlockIcon color="error" />,
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
        placeholder="Search for a driver by name or email"
        onFilterClick={handleFilterToggle}
      />

      {/* Overview Cards Block */}
      <OverviewCards items={driverStats} maxWidth={768} loading={isLoading} />

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

      {/* Drivers Table  */}
      <DriversTable
        isLoading={isLoading}
        driversList={driversList}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handleChangePage}
        onPageSizeChange={handlePageSizeChange}
        onViewDriver={(id) => setSelectedDriverId(id)}
      />

      {/*Render the details modal here */}
      <DriverDetailsModal
        driverId={selectedDriverId}
        isOpen={!!selectedDriverId}
        onClose={() => setSelectedDriverId(null)}
      />
    </Box>
  );
}
