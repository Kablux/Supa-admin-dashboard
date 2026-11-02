import React from "react";
import { Box, Typography } from "@mui/material";

import { CourierRider } from "../../../types/common.types";
import DetailSection from "./shared/DetailSection";

function ComplianceRow({ label, value, color }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "space-between" }}>
      <Typography variant="caption" sx={{ color: color ?? "var(--text-secondary)" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, color }}>
        {value}
      </Typography>
    </Box>
  );
}

interface ComplianceNotesSectionProps {
  rider: CourierRider;
  /** Shown as "Approved By" for verified riders */
  approverEmail: string;
}

export default function ComplianceNotesSection({ rider, approverEmail }: ComplianceNotesSectionProps) {
  const isVerified = rider.kyc_status === "VERIFIED";

  return (
    <DetailSection title="Compliance Notes" contentSx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <ComplianceRow
        label="Submitted At:"
        value={rider.kyc_submitted_at ? new Date(rider.kyc_submitted_at).toLocaleString() : "Not submitted"}
      />

      {rider.approval_date && (
        <ComplianceRow label="Approval Date:" value={new Date(rider.approval_date).toLocaleString()} />
      )}

      {isVerified && <ComplianceRow label="Approved By:" value={approverEmail} />}

      {rider.kyc_rejection_reason && (
        <ComplianceRow label="Rejection Reason" value={rider.kyc_rejection_reason} color="#EF4444" />
      )}
    </DetailSection>
  );
}
