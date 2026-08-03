import React from "react";
import { Box, Typography } from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SettingsActionBar from "../components/settings/ActionBar";
import FaresCommissionSection from "../components/settings/FaresCommissionSection";
import RequestTimingSection from "../components/settings/RequestTimingSection";
import RideTypePricingSection from "../components/settings/RidetypePricing";
import SystemSection from "../components/settings/SystemSection";
import { useGlobalConfigForm } from "../utils/useGlobalConfigForm";

interface SettingsPageProps {
  /** Optional: called after a plain "Save" (e.g. to navigate away). */
  onSaved?: () => void;
}

export default function SettingsPage({ onSaved }: SettingsPageProps) {
  const {
    form,
    hydrating,
    saving,
    isDirty,
    patch,
    setExtra,
    patchRideType,
    addRideType,
    removeRideType,
    handleSave,
    discard,
  } = useGlobalConfigForm(onSaved);

  return (
    <Box className="fade-in" sx={{ pb: 12 }}>
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
          px: 0.5,
        }}
      >
        <SettingsRoundedIcon
          sx={{ color: "var(--accent-gold, #FFD700)", fontSize: 26 }}
        />
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
            Settings
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
            Global platform configuration
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2.5,
            width: "100%",
          }}
        >
          <FaresCommissionSection form={form} patch={patch} />
          <RequestTimingSection form={form} patch={patch} />
        </Box>

        <RideTypePricingSection
          rideTypes={form.rideTypes}
          onAdd={addRideType}
          onChange={patchRideType}
          onRemove={removeRideType}
        />

        <SystemSection extra={form.extra} setExtra={setExtra} />
      </Box>

      <SettingsActionBar
        hydrating={hydrating}
        isDirty={isDirty}
        saving={saving}
        onDiscard={discard}
        onSave={handleSave}
      />
    </Box>
  );
}
