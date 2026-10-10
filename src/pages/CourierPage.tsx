// import React from "react";
// import { Box } from "@mui/material";
// import { RIDERS_INFO, USERS_INFO, FINANCE_DATA, QUICK_LINKS, RECENT_SHIPMENTS } from "../data/data";
// import QuickActionsCard from "../components/courier/QuickActionCard";
// import CourierInfoCards from "../components/courier/CourierInfoCard";
// import RecentShipmentTable from "../components/courier/RecentShipmentTable";
// import FinanceAnalyticsChart from "../components/courier/FinanceAnalytics";
// import OverviewCards, { OverviewItem } from "../components/OverviewCard";
// import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
// import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
// import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
// import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// export default function CourierPage() {

//     const courierStats: OverviewItem[] = [
//       {
//         title: "Total Rider",
//         value: 100,
//         icon: <DirectionsBikeRoundedIcon />,
//       },
//       {
//         title: "Active Rider",
//         value: 52,
//         icon: <PeopleAltRoundedIcon color="success" />,
//       },
//       {
//         title: "Suspended Rider",
//         value: 3,
//         icon: <BlockRoundedIcon color="error" />,
//       },
//       {
//         title: "Total User",
//         value: 112,
//         icon: <PersonRoundedIcon color="info" />,
//       },
//       {
//         title: "Total Delivered",
//         value: 19,
//         icon: <CheckCircleIcon color="success" />,
//       },
//     ];

//   return (
//     <Box
//       className="fade-in"
//       sx={{ display: "flex", flexDirection: "column", gap: 3.5, p: 1 }}
//     >
//        <OverviewCards items={courierStats}  />

//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: { xs: "1fr", lg: "1.7fr 1fr" },
//           gap: 2.5,
//           alignItems: "stretch",
//         }}
//       >
//         <FinanceAnalyticsChart data={FINANCE_DATA} />
//         <QuickActionsCard links={QUICK_LINKS} />
//       </Box>

//       {/* Row 3 — recent shipments */}
//       <RecentShipmentTable shipments={RECENT_SHIPMENTS} />
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Typography,
} from "@mui/material";

import {
  fetchCourierRiders,
  fetchCourierUsers,
  fetchCourierReferrals,
  approveCourierRiderKyc,
} from "../api/xhrHelper";

import { AppDispatch, RootState } from "../redux/store";
import RidersTable from "../components/courier/RiderTable";
import CourierFilters from "../components/courier/CourierFilter";
import ReferralsTable from "../components/courier/ReferralsTable";
import UsersTable from "../components/courier/UsersTable";
import SearchFilterRow from "../components/SearchFilterRow";

type CourierTab = "riders" | "users" | "referrals";

const courierTabs = [
  { label: "Riders", value: "riders" },
  { label: "Users", value: "users" },
  { label: "Referrals", value: "referrals" },
] as const;

export default function CourierManagementPage() {
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState<CourierTab>("riders");

  const [search, setSearch] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    riders,
    users,
    referrals,
    kycApprovingId,
  } = useSelector(
    (state: RootState) => state.courier
  );

  useEffect(() => {
    const params = {
      page: page + 1,
      page_size: pageSize,
      search: search || undefined,
      account_status: accountStatus || undefined,
    };

    if (activeTab === "riders") {
      dispatch(
        fetchCourierRiders({
          ...params,
          kyc_status: kycStatus || undefined,
          vehicle_type: vehicleType || undefined,
        })
      );
    }

    if (activeTab === "users") {
      dispatch(fetchCourierUsers(params));
    }

    if (activeTab === "referrals") {
      dispatch(fetchCourierReferrals(params));
    }
  }, [
    dispatch,
    activeTab,
    page,
    pageSize,
    search,
    accountStatus,
    kycStatus,
    vehicleType,
  ]);

  const handleTabChange = (newValue: CourierTab) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(0);
  };

  const handleApproveKyc = (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to approve this rider’s KYC?"
      )
    ) {
      dispatch(approveCourierRiderKyc(userId));
    }
  };

  return (
    <Box
      className="fade-in"
      sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3.5 }}
    >
      {/* SEARCH FILTERS */}
      <Box className="md:max-w-3xl w-full">
        <SearchFilterRow
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search name, email, phone, referral code..."
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          width: "max-content",
          mb: 3,
        }}
      >
        {courierTabs.map((tab) => (
          <Typography
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              color:
                activeTab === tab.value
                  ? "var(--accent-gold)"
                  : "secondary.main",

              position: "relative",
              pb: 1.2,

              transition: "color 0.2s ease",

              "&:hover": {
                color: "var(--accent-gold)",
              },

              "&::after":
                activeTab === tab.value
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: -1,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: "var(--accent-gold)",
                      borderRadius: "2px 2px 0 0",
                    }
                  : {},
            }}
          >
            {tab.label}
          </Typography>
        ))}
      </Box>

      {/* Filters */}
      <CourierFilters
        activeTab={activeTab}
        accountStatus={accountStatus}
        kycStatus={kycStatus}
        vehicleType={vehicleType}
        onAccountStatusChange={(val) => {
          setAccountStatus(val);
          setPage(0);
        }}
        onKycStatusChange={(val) => {
          setKycStatus(val);
          setPage(0);
        }}
        onVehicleTypeChange={(val) => {
          setVehicleType(val);
          setPage(0);
        }}
      />
      </Box>


      {/* Riders */}
      {activeTab === "riders" && (
        <RidersTable
          riders={riders}
          page={page}
          pageSize={pageSize}
          kycApprovingId={kycApprovingId}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          onApproveKyc={handleApproveKyc}
        />
      )}

      {/* Users */}
      {activeTab === "users" && (
        <UsersTable
          users={users}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Referrals */}
      {activeTab === "referrals" && (
        <ReferralsTable
          referrals={referrals}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </Box>
  );
}