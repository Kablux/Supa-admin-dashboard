import React from "react";
import { Box, Typography, Chip, Divider } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

import { CourierGuarantor, CourierRider } from "../../../types/common.types";
import DetailSection from "./shared/DetailSection";

function GuarantorRow({ guarantor }: { guarantor: CourierGuarantor }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.02)",
        p: 1,
        borderRadius: "6px",
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Slot {guarantor.slot}: {guarantor.full_name}
        </Typography>
        <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
          {guarantor.phone_number}
        </Typography>
      </Box>
      <Chip label={guarantor.status} size="small" sx={{ fontSize: 10, height: 20 }} />
    </Box>
  );
}

export default function GuarantorsSection({ rider }: { rider: CourierRider }) {
  const guarantors = rider.guarantors ?? [];

  return (
    <DetailSection
      title="Guarantors & Next of Kin"
      icon={<GroupIcon fontSize="small" />}
      contentSx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Box>
        <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
          Next of Kin
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {rider.next_of_kin_full_name || "N/A"} ({rider.next_of_kin_phone_number || "No Phone"})
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "var(--border)" }} />

      <Box>
        <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block", mb: 1 }}>
          Registered Guarantors ({guarantors.length})
        </Typography>
        {guarantors.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {guarantors.map((g) => (
              <GuarantorRow key={g.slot} guarantor={g} />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
            No guarantors listed.
          </Typography>
        )}
      </Box>
    </DetailSection>
  );
}
