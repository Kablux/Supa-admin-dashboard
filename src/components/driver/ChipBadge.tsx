import { Chip } from "@mui/material";

interface KycStatusChipProps {
  status: string;
}

export default function KycStatusChip({ status }: KycStatusChipProps) {
  const normalizedStatus = status || "";

  const getStatusStyles = () => {
    switch (normalizedStatus) {
      case "APPROVED":
        return { color: "#50c878", bg: "rgba(80, 200, 120, 0.12)" };
      case "completed":
        return { color: "#50c878", bg: "rgba(80, 200, 120, 0.12)" };
      case "driver_on_way":
        return { color: "#ffb300", bg: "rgba(255, 179, 0, 0.12)" };
      case "IN_REVIEW":
      case "cancelled":
        return { color: "#ff6b6b", bg: "rgba(255, 107, 107, 0.12)" };
      case "IN_REVIEW":
        return { color: "#4d8eff", bg: "rgba(77, 142, 255, 0.12)" };
      case "PENDING":
        return { color: "#ffb300", bg: "rgba(255, 179, 0, 0.12)" };
      case "REJECTED":
      case "SUSPENDED":
        return { color: "#ff6b6b", bg: "rgba(255, 107, 107, 0.12)" };
      default:
        return {
          color: "rgba(255, 255, 255, 0.6)",
          bg: "rgba(255, 255, 255, 0.08)",
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <Chip
      label={normalizedStatus.replace("_", " ")}
      size="small"
      sx={{
        backgroundColor: styles.bg,
        color: styles.color,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: "0.04em",
        borderRadius: "6px",
        px: 0.5,
        border: `1px solid ${styles.color}20`,
      }}
    />
  );
}
