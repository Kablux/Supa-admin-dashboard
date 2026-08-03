import React, { useEffect, useState, useMemo } from "react";
import { Box, Chip, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import PersonIcon from "@mui/icons-material/Person";

import { getDashboardStats, fetchReferrals } from "../api/xhrHelper";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import SearchFilterRow from "../components/SearchFilterRow";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { REFERRALS_TAB } from "../types/common.types";
import ReferralFilters, {
  ReferralFilterState,
} from "../components/referrals/ReferralFilters";
import ReferralsTable from "../components/referrals/ReferralsTable";
import ReferralDetailModal from "../components/referrals/ReferralDetailModal";

type UITabType = keyof typeof REFERRALS_TAB;

export default function ReferralPage() {
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<UITabType>("all");
  const [filters, setFilters] = useState<ReferralFilterState>({});
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(
    null,
  );

  const referralsummary = useAppSelector(
    (state) => state.dashboard.referralsSummary,
  );
  const {
    referrals: referralList,
    totalCount,
    loading,
  } = useAppSelector((state) => state.referrals);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  // Fetch List whenever dependencies change
  useEffect(() => {
    const roleParam = activeTab === "all" ? undefined : activeTab;

    dispatch(
      fetchReferrals({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery || undefined,
        role: roleParam,
        period: filters.period || undefined,
        created_at_after: filters.created_at_after || undefined,
        created_at_before: filters.created_at_before || undefined,
      }),
    );
  }, [dispatch, currentPage, pageSize, activeTab, searchQuery, filters]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: UITabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: ReferralFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // MUI TablePagination is 0-indexed, so we add 1 for our API state
  const handleChangePage = (_: unknown, newPage: number) => {
    setCurrentPage(newPage + 1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleViewReferral = (referralId: string) => {
    setSelectedReferralId(referralId);
  };
  // Overview Stats
  const referralStats: OverviewItem[] = [
    {
      title: "Total Referrals",
      value: referralsummary?.total || 0,
      icon: <PeopleIcon sx={{ color: "var(--accent-gold)" }} />,
    },
    {
      title: "Rider Referrals",
      value: referralsummary?.rider || 0,
      icon: <PersonIcon sx={{ color: "#3498DB" }} />,
    },
    {
      title: "Driver Referrals",
      value: referralsummary?.driver || 0,
      icon: <DriveEtaIcon sx={{ color: "#7F8C8D" }} />,
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
        placeholder="Search by user ID or name..."
      />

      {/* Overview Cards */}
      <OverviewCards
        items={referralStats}
        loading={!referralsummary && loading}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 3 }}>
          {(["all", "rider", "driver"] as const).map((tab) => (
            <Typography
              key={tab}
              onClick={() => handleTabChange(tab)}
              sx={{
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                textTransform: "capitalize",
                color:
                  activeTab === tab ? "var(--accent-gold)" : "text.secondary",
                position: "relative",
                pb: 1.5,
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
                "&:hover": { color: "var(--accent-gold)" },
              }}
            >
              {tab}
            </Typography>
          ))}
        </Box>

        <ReferralFilters filters={filters} onChange={handleFiltersChange} />
      </Box>

      {/* Ride Request Table */}
      <ReferralsTable
        isLoading={loading}
        referralsList={referralList}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handleChangePage}
        onPageSizeChange={handlePageSizeChange}
        onViewReferral={handleViewReferral}
      />

      {/*Render the details modal here */}
      <ReferralDetailModal
        referralId={selectedReferralId}
        isOpen={!!selectedReferralId}
        onClose={() => setSelectedReferralId(null)}
      />
    </Box>
  );
}
