import Chip from "@mui/material/Chip";

interface SosIncidentStatusChipProps {
  status: string;
}

export default function SosIncidentStatusChip({
  status,
}: SosIncidentStatusChipProps) {
  const normalizedStatus = status?.toUpperCase();

  const styles =
    normalizedStatus === "OPEN"
      ? {
          label: "OPEN",
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: "#f87171e1",
          border: "1px solid rgba(239, 68, 68, 0.3)",
        }
      : normalizedStatus === "RESOLVED"
        ? {
            label: "RESOLVED",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            color: "#34d399e2",
            border: "1px solid rgba(16, 185, 129, 0.25)",
          }
        : {
            label: status || "IN PROGRESS",
            backgroundColor: "rgba(245, 158, 11, 0.12)",
            color: "#fbbe24e4",
            border: "1px solid rgba(245, 158, 11, 0.25)",
          };

  return (
    <Chip
      label={styles.label}
      size="small"
      sx={{
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        border: styles.border,
        fontWeight: 600,
        fontSize: 11,
        height: 26,
        borderRadius: "8px",
        "& .MuiChip-label": {
          px: 1.5,
        },
      }}
    />
  );
}