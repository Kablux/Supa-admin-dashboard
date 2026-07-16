import { Chip } from "@mui/material";
import { STATUS_CFG } from "../../data/inspectionData";
import { InspectedCar } from "../../types/common.types";

export function StatusBadge({ status }: { status: InspectedCar["status"] }) {
  const s = STATUS_CFG[status];
  return (
    <Chip
      label={s.label}
      size="small"
      sx={{
        height: 32,
        fontSize: 12,
        borderRadius: "4px",
        fontWeight: 700,
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}
