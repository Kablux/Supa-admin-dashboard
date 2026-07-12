import { Box } from "@mui/material";
import { FleetVehicle } from "../../types/common.types";

interface Props {
  vehicles: FleetVehicle[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function VehicleThumbnails({
  vehicles,
  selectedIndex,
  onSelect,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
        gap: 2,
        width: { xs: "100%", md: "140px" },
        overflowX: { xs: "auto", md: "visible" },
      }}
    >
      {vehicles.map((vehicle, idx) => (
        <Box
          key={vehicle.id}
          onClick={() => onSelect(idx)}
          sx={{
            width: { xs: 120, md: "100%" },
            height: 85,
            borderRadius: 1,
            overflow: "hidden",
            cursor: "pointer",
            border:
              selectedIndex === idx
                ? "3px solid #FFB300" // Yellow-orange highlight
                : "3px solid transparent",
            transition: "border 0.2s ease",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={vehicle.image}
            alt={vehicle.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
