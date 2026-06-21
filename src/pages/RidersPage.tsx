import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchRiders } from "../api/xhrHelper";
import AppButton from "../components/common/AppButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentPage } from "../redux/slices/Riders";
import OverviewCards, { OverviewItem } from "../components/rider/OverviewCard";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import SearchFilterRow from "../components/rider/SearchFilterRow";
import RidersTable from "../components/rider/RidersTable";
import { TAB_MAPPING } from "../types/common.types";


type UITabType = keyof typeof TAB_MAPPING;

export default function RidersPage() {
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<UITabType>("all");
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { ridersummary } = useAppSelector((state) => state.dashboard);
  const {
    items: ridersList,
    totalCount,
    currentPage,
    isLoading,
  } = useAppSelector((state) => state.riders);

  useEffect(() => {
    dispatch(
      fetchRiders({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery,
        status: TAB_MAPPING[activeTab],
      }),
    );
  }, [dispatch, currentPage, pageSize, activeTab, searchQuery]);

  // Handle Input Changes & reset back to page 1 to protect search query structures
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleTabChange = (tab: UITabType) => {
    setActiveTab(tab);
    dispatch(setCurrentPage(1));
  };

  const handleChangePage = (_: any, newPage: number) => {
    // MUI pagination index starts at 0, our backend starts page counters at 1
    dispatch(setCurrentPage(newPage + 1));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    dispatch(setCurrentPage(1)); 
  };

  const handleFilterToggle = () => {
    console.log("Filter toggled");
  };

  const riderStats: OverviewItem[] = [
    {
      title: "Total Riders",
      value: ridersummary?.total,
      icon: <PeopleIcon />,
    },
    {
      title: "Active Riders",
      value: ridersummary?.active,
      icon: <CheckCircleIcon color="success" />,
    },
    {
      title: "Suspended Riders",
      value: ridersummary?.suspended,
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
        placeholder="Search for a rider by name or email"
        onFilterClick={handleFilterToggle}
      />

      {/* Overview Cards Block */}
      <OverviewCards items={riderStats} maxWidth={768} />

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
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
                color:
                  activeTab === tab
                    ? "var(--accent-gold)"
                    : "rgba(255,255,255,0.45)",
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

        <AppButton
          onClick={() => setIsModalOpen(true)}
          startIcon={<AddIcon sx={{ fontSize: 14 }} />}
          sx={{ height: 36, borderRadius: "8px", px: 2, fontSize: 12.5 }}
        >
          Add New
        </AppButton>
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
      />

      {/* <AddRiderModal open={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
    </Box>
  );
}
