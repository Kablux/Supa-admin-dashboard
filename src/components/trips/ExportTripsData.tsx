import React from "react";
import ExportModal, { ExportColumn } from "../ExportModal";
import { getTrips } from "../../api/xhr";
import { TripQueryParams } from "../../types/auth";

const TRIP_COLUMNS: ExportColumn[] = [
  { key: "id", label: "user_id", default: true },
  { key: "rider", label: "Rider", default: true },
  { key: "driver", label: "Driver", default: true },
  { key: "status", label: "Status", default: true },
  { key: "fare", label: "Fare", default: true },
  { key: "agreed_fare", label: "Agreed Fare" },
  { key: "pickup_address", label: "Pickup" },
  { key: "dropoff_address", label: "Dropoff" },
  { key: "start_time", label: "Start Time", default: true },
  { key: "end_time", label: "End Time" },
  { key: "cancellation_reason", label: "Cancellation Reason" },
  { key: "cancelled_by", label: "Cancelled By" },
];

interface ExportTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: TripQueryParams;
}

export default function ExportTripsModal({
  isOpen,
  onClose,
  params,
}: ExportTripsModalProps) {
  return (
    <ExportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Trips"
      entityLabel="trips"
      fileBaseName="trips_export"
      columns={TRIP_COLUMNS}
      fetchPage={async (page, page_size) => {
        const res = await getTrips({ ...params, page, page_size });
        return {
          results: res.results as unknown as Record<string, unknown>[],
          count: res.count,
        };
      }}
    />
  );
}