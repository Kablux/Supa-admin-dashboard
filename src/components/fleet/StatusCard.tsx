import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { FleetStatus } from "../../types/common.types";

interface Props {
  status: FleetStatus;
}

export default function FleetStatusCard({ status }: Props) {
  const renderRow = (
    label: string,
    value: number,
    color: string,
    icon?: React.ReactNode,
  ) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Status Icon Box */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "10px",
            backgroundColor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
          }}
        >
          {icon}
        </Box>
        {/* Label */}
        <Typography sx={{ color: "secondary.main" }}>{label}</Typography>
      </Box>
      <Typography sx={{ color: "primary", fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        background: "var(--bg-card)",
        borderRadius: "16px",
        p: 4,
        maxHeight: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 4,
      }}
    >
      {renderRow("Active", status.active, "#10B981", <CheckIcon />)}

      {renderRow("Offline", status.offline, "#4B5563", null)}

      {renderRow("Blocked", status.blocked, "#EF4444", null)}
    </Box>
  );
}
