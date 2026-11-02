import React from "react";

import { CourierRider } from "../../../types/common.types";
import DetailSection from "./shared/DetailSection";
import InfoField from "./shared/InfoField";

export default function ContactInfoSection({ rider }: { rider: CourierRider }) {
  const workExperience = rider.previous_place_of_work
    ? `${rider.previous_place_of_work} (${rider.years_worked || "Duration N/A"})`
    : "N/A";

  return (
    <DetailSection
      title="Contact & General Information"
      contentSx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}
    >
      <InfoField label="Email Address" value={rider.email || "N/A"} valueSx={{ wordBreak: "break-all" }} />
      <InfoField label="Phone Number" value={rider.phone_number || "N/A"} />
      <InfoField
        label="Gender & DOB"
        value={`${rider.gender || "N/A"} ${rider.date_of_birth ? `(${rider.date_of_birth})` : ""}`}
      />
      <InfoField label="City / State" value={[rider.city, rider.state].filter(Boolean).join(", ") || "N/A"} />
      <InfoField label="Referral Code" value={rider.referral_code || "N/A"} valueSx={{ fontFamily: "monospace" }} />
      <InfoField
        label="Date Joined"
        value={rider.date_joined ? new Date(rider.date_joined).toLocaleDateString() : "N/A"}
      />
      <InfoField label="Work Experience" value={workExperience} />
    </DetailSection>
  );
}
