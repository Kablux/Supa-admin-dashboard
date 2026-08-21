import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { FaListCheck } from "react-icons/fa6";
import { getDashboardStats, fetchDrivers } from "../api/xhrHelper";
import { approveDriverKyc, rejectDriverKyc, suspendDriver } from "../api/xhr";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentPage } from "../redux/slices/Drivers";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import SearchFilterRow from "../components/SearchFilterRow";
import DriversTable from "../components/driver/DriversTable";
import DriverDetailsModal from "../components/driver/DriverDetailModal";
import DriverFilters, { DriverFilterState } from "../components/driver/DriverFilter";
import ExportDriversModal from "../components/driver/ExportDriversDataModal";
import { DRIVER_TAB_MAPPING } from "../types/common.types";


type UITabType = keyof typeof DRIVER_TAB_MAPPING;

export default function DriversPage() {
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<UITabType>("all");
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<DriverFilterState>({});
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const { driversummary } = useAppSelector((state) => state.dashboard);
  const {
    items: driversList,
    totalCount,
    currentPage,
    isLoading,
  } = useAppSelector((state) => state.drivers);

  // Stable dependency for the filters object.
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchDrivers({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery,
        kyc_status: DRIVER_TAB_MAPPING[activeTab], // kyc_status comes from the tabs
        ...filters, // type, is_online, tier, date ranges
      }),
    );
  }, [dispatch, currentPage, pageSize, activeTab, searchQuery, filterKey]);

  const refetchDrivers = () =>
    dispatch(
      fetchDrivers({
        page: currentPage,
        page_size: pageSize,
        search: searchQuery,
        kyc_status: DRIVER_TAB_MAPPING[activeTab],
        ...filters,
      }),
    );

  const handleDriverAction = async (
    driverId: string,
    actionType: "approve" | "activate" | "reject" | "suspend" | "delete",
     reason?: string,
  ) => {
    try {
      const targetDriver = driversList.find((d: any) => d.id === driverId);

      if (!targetDriver) {
        toast.error("Driver not found in state!");
        return;
      }

        if (actionType === "approve") {
        const payload = {
          kyc_status: targetDriver.kyc_status,
          is_online: targetDriver.is_online,
          rating: targetDriver.rating || "N/A",
          ready_for_dispatch: targetDriver.ready_for_dispatch,
        };
        await approveDriverKyc(driverId, payload);
        toast.success(`${targetDriver.full_name} is Approved Successfully`);
        setSelectedDriverId(null);
        dispatch(getDashboardStats());
        refetchDrivers();
      } else if (actionType === "suspend") {
        const payload = {
          kyc_status: targetDriver.kyc_status,
          is_online: targetDriver.is_online,
          rating: targetDriver.rating || "N/A",
          ready_for_dispatch: targetDriver.ready_for_dispatch,
        };
        await suspendDriver(driverId, payload);
        toast.success(`${targetDriver.full_name} is suspended!`);
        setSelectedDriverId(null);
        dispatch(getDashboardStats());
        refetchDrivers();
      } else if (actionType === "reject") {
        if (!reason || !reason.trim()) {
          toast.error("A rejection reason is required");
          return;
        }
        await rejectDriverKyc(driverId, reason.trim());
        toast.success(`${targetDriver.full_name}'s KYC was rejected`);
        setSelectedDriverId(null);
        dispatch(getDashboardStats());
        refetchDrivers();
      }
    } catch (error: any) {
      console.error(
        `Failed to execute ${actionType} on driver ID: ${driverId}`,
        error,
      );
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.rejection_reason?.[0] ||
          `Failed to ${actionType} driver`,
      );
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleTabChange = (tab: UITabType) => {
    setActiveTab(tab);
    dispatch(setCurrentPage(1));
  };

  const handleFiltersChange = (next: DriverFilterState) => {
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

  const driverStats: OverviewItem[] = [
    {
      title: "Total Drivers",
      value: driversummary?.total,
      icon: <PeopleIcon />,
    },
    {
      title: "Active Drivers",
      value: driversummary?.online,
      icon: <CheckCircleIcon color="success" />,
    },
    {
      title: "Pending Drivers",
      value: driversummary?.not_started_kyc,
      icon: <VisibilityIcon color="secondary" />,
    },
    {
      title: "Drivers In Review",
      value: driversummary?.pending_kyc,
      icon: <FaListCheck color="#4A90E2" />,
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
      {/* Search Input */}
      <SearchFilterRow
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for a driver by name or email"
      />

      {/* Overview Cards Block */}
      <OverviewCards items={driverStats} loading={isLoading} />

      {/* Status tabs (left) + Filters trigger (right) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", gap: 3 }}>
          {(["all", "approved", "pending", "review", "rejected"] as const).map(
            (tab) => (
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
            ),
          )}
        </Box>

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
          <DriverFilters value={filters} onChange={handleFiltersChange} />
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
        // onDriverAction={handleDriverAction}
      />

      {/* Details modal */}
      <DriverDetailsModal
        driverId={selectedDriverId}
        isOpen={!!selectedDriverId}
        onClose={() => setSelectedDriverId(null)}
        onDriverAction={handleDriverAction}
      />

      <ExportDriversModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        params={{
          search: searchQuery || undefined,
          kyc_status: DRIVER_TAB_MAPPING[activeTab] || undefined,
          ...filters,
        }}
      />
    </Box>
  );
}