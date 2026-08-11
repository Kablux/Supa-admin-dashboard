import React from "react";
import { getRideRequests } from "../../api/xhr";
import { RideRequestQueryParams } from "../../types/common.types";
import ExportModal, { ExportColumn } from "../ExportModal";

const RIDE_REQUEST_COLUMNS: ExportColumn[] = [
  { key: "id", label: "ID", default: true },
  { key: "rider", label: "Rider", default: true },
  { key: "status", label: "Status", default: true },
  { key: "type", label: "Type", default: true },
  { key: "payment_method", label: "Payment Method", default: true },
  { key: "pickup_address", label: "Pickup" },
  { key: "dropoff_address", label: "Dropoff" },
  { key: "estimated_fare", label: "Estimated Fare" },
  { key: "rider_offer", label: "Rider Offer" },
  { key: "is_scheduled", label: "Scheduled" },
  { key: "is_expired", label: "Expired" },
  { key: "created_at", label: "Created At", default: true },
  { key: "expires_at", label: "Expires At" },
];

interface ExportRideRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current view's filters (search/status/type/payment/period/etc.). */
  params: RideRequestQueryParams;
}

export default function ExportRideRequestsModal({
  isOpen,
  onClose,
  params,
}: ExportRideRequestsModalProps) {
  return (
    <ExportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Ride Requests"
      entityLabel="ride requests"
      fileBaseName="ride_requests_export"
      columns={RIDE_REQUEST_COLUMNS}
      fetchPage={async (page, page_size) => {
        const res = await getRideRequests({ ...params, page, page_size });
        return {
           results: res.results as unknown as Record<string, unknown>[], 
          count: res.count,
        };
      }}
    />
  );
}