import React from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { CourierRider } from "../../../types/common.types";
import DetailSection from "./shared/DetailSection";
import InfoField from "./shared/InfoField";

export default function VehicleInfoSection({ rider }: { rider: CourierRider }) {
  return (
    <DetailSection
      title="Vehicle Information"
      icon={<LocalShippingIcon fontSize="small" />}
      contentSx={{
        display: "grid",
        gridTemplateColumns: { sm: "repeat(3, 1fr)" },
        gap: 2,
        border: "1px solid var(--border, rgba(255,255,255,0.09))",
      }}
    >
      <InfoField
        label="Vehicle Type"
        value={rider.vehicle_type || "N/A"}
        valueSx={{ textTransform: "capitalize" }}
      />
      <InfoField label="Brand / Make" value={rider.vehicle_brand || "N/A"} />
      <InfoField
        label="Registration Number"
        value={rider.vehicle_registration_number || "No plate number"}
        valueSx={{ fontFamily: "monospace" }}
      />
    </DetailSection>
  );
}
