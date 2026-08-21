import React, { useEffect, useState } from "react";
import { Dialog, Box, CircularProgress, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DriverActions from "./DriverActions";
import DriverCustomerInfo from "./DriverCustomerInfo";
import DriverExpandedDetails from "./DriverExpandedDetails";
import DriverMetrics from "./DriverMetrics";
import DriverModalHeader from "./DriverModalHeader";
import DriverReviewPanel from "./DriverReviewPanel";
import { DriverActionType, primaryImageOf, getDriverFlags, primaryVehicleOf } from "./helpers";
import { useDriverDetails } from "./useDriverDetails";


interface DriverDetailsModalProps {
  driverId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onDriverAction?: (
    driverId: string,
    actionType: DriverActionType,
    reason?: string,
  ) => void | Promise<void>;
}

export default function DriverDetailsModal({
  driverId,
  isOpen,
  onClose,
  onDriverAction,
}: DriverDetailsModalProps) {
  const { driverData, loading } = useDriverDetails(driverId, isOpen);
  const [activeImgUrl, setActiveImgUrl] = useState<string | null>(null);

  // Seed the active preview from the driver's primary image on load.
  useEffect(() => {
    setActiveImgUrl(primaryImageOf(driverData));
  }, [driverData]);

  const { isActive, isInReview, isPending } = getDriverFlags(driverData);
  const primaryVehicle = primaryVehicleOf(driverData);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card)",
          color: "primary",
          borderRadius: "18px",
          maxWidth: 684,
          width: "100%",
          p: {xs:2, sm:4},
          border: "1px solid var(--border)",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, color: "secondary.main" }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {loading || !driverData ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "var(--accent-gold)" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <DriverModalHeader driver={driverData} />

          <DriverCustomerInfo driver={driverData} />

          {isActive && <DriverMetrics driver={driverData} />}

          {(isInReview || isPending) && (
            <DriverReviewPanel
              driver={driverData}
              primaryVehicle={primaryVehicle}
              activeImgUrl={activeImgUrl}
              onSelectImage={setActiveImgUrl}
            />
          )}

          {isActive && primaryVehicle && (
            <DriverExpandedDetails
              driver={driverData}
              primaryVehicle={primaryVehicle}
              activeImgUrl={activeImgUrl}
              onSelectImage={setActiveImgUrl}
            />
          )}

          <DriverActions driver={driverData} onDriverAction={onDriverAction} />
        </Box>
      )}
    </Dialog>
  );
}