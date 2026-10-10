import React from "react";
import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

interface KycStatusChipProps {
  status: string;
  isApproved: boolean;
}

const KycStatusChip: React.FC<KycStatusChipProps> = ({
  status,
  isApproved,
}) => {
  if (isApproved) {
    return (
      <Chip
        label="Approved"
        color="success"
        size="small"
        icon={<CheckCircleIcon />}
      />
    );
  }

  switch (status) {
    case "UNDER_REVIEW":
      return (
        <Chip
          label="Under Review"
          color="warning"
          size="small"
          icon={<HourglassEmptyIcon />}
        />
      );

    case "NEEDS_RESUBMISSION":
      return (
        <Chip
          label="Needs Resubmission"
          color="info"
          size="small"
        />
      );

    case "REJECTED":
      return (
        <Chip
          label="Rejected"
          color="error"
          size="small"
          icon={<CancelIcon />}
        />
      );

    default:
      return <Chip label={status || "Pending"} size="small" />;
  }
};

export default KycStatusChip;