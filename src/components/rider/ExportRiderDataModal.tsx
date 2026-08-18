import React from "react";
import { getRiders } from "../../api/xhr";
import { RiderQueryParams } from "../../types/auth";
import ExportModal, { ExportColumn } from "../ExportModal";

const RIDER_COLUMNS: ExportColumn[] = [
  { key: "id", label: "user_id", default: true },
  { key: "full_name", label: "Full Name", default: true },
  { key: "email", label: "Email", default: true },
  { key: "phone_number", label: "Phone Number", default: true },
  { key: "status", label: "Status", default: true },
  { key: "address", label: "Address" },
  { key: "rating", label: "Rating" },
  { key: "loyalty_points", label: "Loyalty Points" },
  { key: "total_rides", label: "Total Rides" },
  { key: "completed_rides", label: "Completed Rides" },
  { key: "cancelled_rides", label: "Cancelled Rides" },
  { key: "created_at", label: "Created At", default: true },
];

interface ExportRidersModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: RiderQueryParams;
}

export default function ExportRidersModal({
  isOpen,
  onClose,
  params,
}: ExportRidersModalProps) {
  return (
    <ExportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Riders"
      entityLabel="riders"
      fileBaseName="riders_export"
      columns={RIDER_COLUMNS}
      fetchPage={async (page, page_size) => {
        const res = await getRiders({ ...params, page, page_size });
        return { 
          results: res.results as unknown as Record<string, unknown>[], 
          count: res.count 
        };
      }}
    />
  );
}