import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import toast from "react-hot-toast";

import {
  fetchCourierRiders,
  fetchCourierUsers,
  fetchCourierReferrals,
  approveCourierRiderKyc,
  rejectCourierRiderKyc,
} from "../api/xhrHelper";

import { AppDispatch, RootState } from "../redux/store";
import RidersTable from "../components/courier/RiderTable";
import CourierFilters from "../components/courier/CourierFilter";
import ReferralsTable from "../components/courier/ReferralsTable";
import UsersTable from "../components/courier/UsersTable";
import SearchFilterRow from "../components/SearchFilterRow";
import ApproveKycConfirmationModal from "../components/courier/ApproveKycModal";
import RejectKycConfirmationModal from "../components/courier/RejectKycModal";
import RiderDetailsModal from "../components/courier/RiderDetailsModal";

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

  // Modal triggers
  const [confirmingRiderId, setConfirmingRiderId] = useState<string | null>(null);
  const [rejectingRiderId, setRejectingRiderId] = useState<string | null>(null);

  // Selected rider for detail drawer
  const [selectedRider, setSelectedRider] = useState<any | null>(null);

  const {
    riders,
    users,
    referrals,
    kycApprovingId,
    kycRejectingId,
  } = useSelector((state: RootState) => state.courier);

  const refetchRiders = () => {
    dispatch(
      fetchCourierRiders({
        page: page + 1,
        page_size: pageSize,
        search: search || undefined,
        account_status: accountStatus || undefined,
        kyc_status: kycStatus || undefined,
        vehicle_type: vehicleType || undefined,
      })
    );
  };

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

  // ── Approval Handlers ──
  const handleOpenApproveConfirm = (userId: string) => {
    setConfirmingRiderId(userId);
  };

  const handleConfirmApproveKyc = async () => {
    if (!confirmingRiderId) return;

    try {
      await dispatch(approveCourierRiderKyc(confirmingRiderId)).unwrap();
      toast.success("Rider KYC approved successfully!");
      setConfirmingRiderId(null);
      setSelectedRider(null);
      refetchRiders();
    } catch (error: any) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to approve rider KYC"
      );
    }
  };

  // ── Rejection Handlers ──
  const handleOpenRejectConfirm = (rider: any) => {
    setRejectingRiderId(rider.id);
  };

  const handleConfirmRejectKyc = async (reason: string) => {
    if (!rejectingRiderId) return;

    try {
      await dispatch(
        rejectCourierRiderKyc({ userId: rejectingRiderId, reason })
      ).unwrap();
      toast.success("Rider KYC rejected successfully!");
      setRejectingRiderId(null);
      setSelectedRider(null);
      refetchRiders();
    } catch (error: any) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to reject rider KYC"
      );
    }
  };

  const selectedRiderForConfirm = riders.data.find(
    (r) => r.id === confirmingRiderId
  );
  const selectedRiderForReject = riders.data.find(
    (r) => r.id === rejectingRiderId
  );

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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
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
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          onRowClick={(rider) => setSelectedRider(rider)}
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

      {/* Approve KYC Confirmation Modal */}
      <ApproveKycConfirmationModal
        open={Boolean(confirmingRiderId)}
        riderName={
          selectedRiderForConfirm
            ? `${selectedRiderForConfirm.first_name} ${selectedRiderForConfirm.last_name}`
            : undefined
        }
        loading={Boolean(kycApprovingId)}
        onClose={() => setConfirmingRiderId(null)}
        onConfirm={handleConfirmApproveKyc}
      />

      {/* Reject KYC Confirmation Modal */}
      <RejectKycConfirmationModal
        open={Boolean(rejectingRiderId)}
        riderName={
          selectedRiderForReject
            ? `${selectedRiderForReject.first_name} ${selectedRiderForReject.last_name}`
            : undefined
        }
        loading={Boolean(kycRejectingId)}
        onClose={() => setRejectingRiderId(null)}
        onConfirm={handleConfirmRejectKyc}
      />

      {/* Rider Details Modal */}
      <RiderDetailsModal
        open={Boolean(selectedRider)}
        rider={selectedRider}
        kycApprovingId={kycApprovingId}
        kycRejectingId={kycRejectingId}
        onClose={() => setSelectedRider(null)}
        onApproveKyc={handleOpenApproveConfirm}
        onRejectKyc={handleOpenRejectConfirm}
      />
    </Box>
  );
}