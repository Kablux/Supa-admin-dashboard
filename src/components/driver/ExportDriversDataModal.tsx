import React from "react";
import { getDriverList } from "../../api/xhr";
import { DriverQueryParams } from "../../types/auth";
import ExportModal, { ExportColumn } from "../ExportModal";

const DRIVER_COLUMNS: ExportColumn[] = [
  { key: "id", label: "ID", default: true },
  { key: "full_name", label: "Full Name", default: true },
  { key: "email", label: "Email", default: true },
  { key: "phone_number", label: "Phone Number", default: true },
  { key: "status", label: "Status", default: true },
  { key: "kyc_status", label: "KYC Status", default: true },
  { key: "address", label: "Address" },
  { key: "rating", label: "Rating" },
  { key: "is_online", label: "Online" },
  { key: "ready_for_dispatch", label: "Ready for Dispatch" },
  { key: "mileage_points", label: "Mileage Points" },
  { key: "total_rides", label: "Total Rides" },
  { key: "completed_rides", label: "Completed Rides" },
  { key: "cancelled_rides", label: "Cancelled Rides" },
  { key: "total_amount", label: "Total Earnings" },
  { key: "created_at", label: "Created At", default: true },
];

interface ExportDriversModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current view's filters (search/kyc_status/type/is_online/tier/period/dates). */
  params: DriverQueryParams;
}

export default function ExportDriversModal({
  isOpen,
  onClose,
  params,
}: ExportDriversModalProps) {
  return (
    <ExportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Drivers"
      entityLabel="drivers"
      fileBaseName="drivers_export"
      columns={DRIVER_COLUMNS}
      fetchPage={async (page, page_size) => {
        const res = await getDriverList({ ...params, page, page_size });
        return {
          results: res.results as unknown as Record<string, unknown>[], 
          count: res.count
        };
      }}
    />
  );
}