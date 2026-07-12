import { useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  MdDirectionsCar,
  MdAccountBalance,
  MdAlbum,
  MdAssignment,
} from "react-icons/md";
import { FleetVehicle } from "../../types/common.types";
import { Divider, MetaItem } from "./MetaItems";
import VehicleThumbnails from "./VechileThumbnails";
import NoFleet from "./NoFleet";

interface Props {
  vehicles: FleetVehicle[];
}

export default function FleetVehicleShowcase({ vehicles }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  //  EMPTY STATE
  if (!vehicles || vehicles.length === 0) {
    return <NoFleet />;
  }

  const activeVehicle = vehicles[selectedIndex];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 250, md: 320 },
            borderRadius: 2,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Box
            component="img"
            src={activeVehicle.image}
            alt={activeVehicle.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {activeVehicle.inspectionReminder && (
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                backgroundColor: "#4A1011",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "12px",
                maxWidth: 250,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
              }}
            >
              {activeVehicle.inspectionReminder}
            </Box>
          )}
        </Box>

        {/* Pricing & Title */}
        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
            {activeVehicle.name}
          </Typography>
          <Typography sx={{ fontSize: 24, color: "var(--text-secondary)" }}>
            |
          </Typography>
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
              N{activeVehicle.amount.toLocaleString()}
            </Typography>
            <Typography
              sx={{ fontSize: 12, color: "var(--text-secondary)", mt: -0.5 }}
            >
              Per day
            </Typography>
          </Box>
        </Box>

        {/* Vehicle Metadata */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <MetaItem
            icon={<MdDirectionsCar size="14px" />}
            label="Model"
            value={activeVehicle.model}
          />
          <Divider />
          <MetaItem
            icon={<MdAccountBalance size="14px" />}
            label="Insurance"
            value={activeVehicle.insuranceYear}
          />
          <Divider />
          <MetaItem
            icon={<MdAlbum size="14px" />}
            label="Plate"
            value={activeVehicle.plateNumber}
          />
          <Divider />
          <MetaItem
            icon={<MdAssignment size="14px" />}
            label="Year"
            value={activeVehicle.year}
          />
        </Box>
      </Box>

      {/* Right Area: Selectable Thumbnails */}
      <VehicleThumbnails
        vehicles={vehicles}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
    </Box>
  );
}
