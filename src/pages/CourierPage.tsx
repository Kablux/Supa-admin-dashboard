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
  unsuspendCourierRider,
} from "../api/xhrHelper";

import { AppDispatch, RootState } from "../redux/store";
import { CourierRider } from "../types/common.types";
import RidersTable from "../components/courier/RiderTable";
import CourierFilters from "../components/courier/CourierFilter";
import ReferralsTable from "../components/courier/ReferralsTable";
import UsersTable from "../components/courier/UsersTable";
import SearchFilterRow from "../components/SearchFilterRow";
import ApproveKycConfirmationModal from "../components/courier/ApproveKycModal";
import RejectKycConfirmationModal from "../components/courier/RejectKycModal";
import UnsuspendRiderModal from "../components/courier/UnsuspendRiderModal";
import RiderDetailsModal from "../components/courier/RiderDetailsModal/RiderDetailsModal";

type CourierTab = "riders" | "users" | "referrals";

const courierTabs = [
  { label: "Riders", value: "riders" },
  { label: "Users", value: "users" },
  { label: "Referrals", value: "referrals" },
] as const;

const riderFullName = (rider?: CourierRider | null) =>
  rider ? `${rider.first_name} ${rider.last_name}` : undefined;

export default function CourierManagementPage() {
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState<CourierTab>("riders");

  const [search, setSearch] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [confirmingRiderId, setConfirmingRiderId] = useState<string | null>(null);
  const [rejectingRiderId, setRejectingRiderId] = useState<string | null>(null);
  const [unsuspendingRiderId, setUnsuspendingRiderId] = useState<string | null>(null);

  const [selectedRider, setSelectedRider] = useState<CourierRider | null>(null);

  const {
    riders,
    users,
    referrals,
    kycApprovingId,
    kycRejectingId,
    unsuspendingId,
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

  const toastError = (error: any, fallback: string) =>
    toast.error(typeof error === "string" ? error : error?.message || fallback);

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
      toastError(error, "Failed to approve rider KYC");
    }
  };

  // ── Rejection Handlers ──
  const handleOpenRejectConfirm = (rider: CourierRider) => {
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
      toastError(error, "Failed to reject rider KYC");
    }
  };

  // ── Unsuspend Handlers ──
  const handleOpenUnsuspendConfirm = (rider: CourierRider) => {
    setUnsuspendingRiderId(rider.id);
  };

  const handleConfirmUnsuspend = async () => {
    if (!unsuspendingRiderId) return;

    try {
      const res = await dispatch(
        unsuspendCourierRider(unsuspendingRiderId)
      ).unwrap();
      toast.success("Rider unsuspended successfully!");

      // selectedRider is local state, so the slice update doesn't reach it —
      // patch it here so the details modal stays open with the new status.
      const newStatus = res?.status?.toUpperCase() || "ACTIVE";
      setSelectedRider((prev) =>
        prev && prev.id === unsuspendingRiderId
          ? { ...prev, account_status: newStatus }
          : prev
      );

      setUnsuspendingRiderId(null);
      refetchRiders();
    } catch (error: any) {
      toastError(error, "Failed to unsuspend rider");
    }
  };

  // Look up in the list first, fall back to the open details rider
  const findRider = (id: string | null) =>
    id
      ? riders.data.find((r) => r.id === id) ??
        (selectedRider?.id === id ? selectedRider : undefined)
      : undefined;

  const selectedRiderForConfirm = findRider(confirmingRiderId);
  const selectedRiderForReject = findRider(rejectingRiderId);
  const selectedRiderForUnsuspend = findRider(unsuspendingRiderId);

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
        riderName={riderFullName(selectedRiderForConfirm)}
        loading={Boolean(kycApprovingId)}
        onClose={() => setConfirmingRiderId(null)}
        onConfirm={handleConfirmApproveKyc}
      />

      {/* Reject KYC Confirmation Modal */}
      <RejectKycConfirmationModal
        open={Boolean(rejectingRiderId)}
        riderName={riderFullName(selectedRiderForReject)}
        loading={Boolean(kycRejectingId)}
        onClose={() => setRejectingRiderId(null)}
        onConfirm={handleConfirmRejectKyc}
      />

      {/* Unsuspend Rider Confirmation Modal */}
      <UnsuspendRiderModal
        open={Boolean(unsuspendingRiderId)}
        riderName={riderFullName(selectedRiderForUnsuspend)}
        loading={Boolean(unsuspendingId)}
        onClose={() => setUnsuspendingRiderId(null)}
        onConfirm={handleConfirmUnsuspend}
      />

      {/* Rider Details Modal */}
      <RiderDetailsModal
        open={Boolean(selectedRider)}
        rider={selectedRider}
        kycApprovingId={kycApprovingId}
        kycRejectingId={kycRejectingId}
        unsuspendingId={unsuspendingId}
        onClose={() => setSelectedRider(null)}
        onApproveKyc={handleOpenApproveConfirm}
        onRejectKyc={handleOpenRejectConfirm}
        onUnsuspend={handleOpenUnsuspendConfirm}
      />
    </Box>
  );
}