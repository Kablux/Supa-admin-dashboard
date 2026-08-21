import React, { useState } from "react";
import { Box, Typography, Chip, Collapse } from "@mui/material";
import { MdDirectionsCar, MdAccountBalance, MdExpandMore } from "react-icons/md";
import { FiCameraOff } from "react-icons/fi";
import { Driver } from "../../../types/auth";
import ThumbnailStrip from "./Thumbnailsrip";
import ZoomableImage from "./Zoomableimage";



interface Props {
  driver: Driver;
  primaryVehicle: any;
  activeImgUrl: string | null;
  onSelectImage: (url: string | null) => void;
}

export default function DriverExpandedDetails({
  driver,
  primaryVehicle,
  activeImgUrl,
  onSelectImage,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const emptyState = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        maxHeight: 300,
        bgcolor: "background.paper",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--border)",
      }}
    >
      <FiCameraOff size={48} color="var(--text-secondary)" />
    </Box>
  );

  const toggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      if (next && !activeImgUrl && primaryVehicle?.images?.length) {
        onSelectImage(primaryVehicle.images[0].image_url);
      }
      return next;
    });
  };

  const recipient: any = (driver as any).transfer_recipient;

  return (
    <Box sx={{ mt: 1 }}>
      {/* Toggle */}
      <Box
        onClick={toggle}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          {expanded ? "Show Less" : "See More "}
        </Typography>
        <MdExpandMore
          size={22}
          style={{
            color: "var(--text-secondary)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mt: 2,
          }}
        >
          {/* LEFT: preview + thumbnails */}
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <ZoomableImage
              src={activeImgUrl}
              alt="Active Preview"
              zoomScale={2}
              emptyState={emptyState}
              containerSx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                border: "1px solid var(--border)",
              }}
            />
            <ThumbnailStrip
              images={primaryVehicle?.images}
              activeUrl={activeImgUrl}
              onSelect={onSelectImage}
              width={60}
              height={60}
              keyPrefix="veh-img"
            />
          </Box>

          {/* RIGHT: verification sheet */}
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Box sx={{ borderRadius: 2, p: 2, bgcolor: "background.paper" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <MdDirectionsCar size={20} color="var(--accent-gold, #FFB300)" />
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                  Vehicle Declaration
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    Model & Year
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                    {primaryVehicle.model} ({primaryVehicle.year})
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    Plate Number
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                    {primaryVehicle.plate_number}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    Color
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                    {primaryVehicle.color}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}
                  >
                    Condition
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      size="small"
                      label={
                        primaryVehicle.vehicle_info?.is_ac_working
                          ? "Good A/C"
                          : "Faulty A/C"
                      }
                      sx={{
                        bgcolor: primaryVehicle.vehicle_info?.is_ac_working
                          ? "#e8f5e9"
                          : "#ffebee",
                        color: primaryVehicle.vehicle_info?.is_ac_working
                          ? "#2e7d32"
                          : "#c62828",
                        fontSize: 10,
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      size="small"
                      label={
                        primaryVehicle.vehicle_info?.is_interior_neat
                          ? "Neat Interior"
                          : "Requires Attention"
                      }
                      sx={{
                        bgcolor: primaryVehicle.vehicle_info?.is_interior_neat
                          ? "#e8f5e9"
                          : "#ffebee",
                        color: primaryVehicle.vehicle_info?.is_interior_neat
                          ? "#2e7d32"
                          : "#c62828",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Bank / Account Info */}
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MdAccountBalance size={18} color="#4d8eff" />
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    Account Info
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mt: 1,
                }}
              >
                <Typography sx={{ color: "secondary.main", fontSize: 12 }}>
                  Bank Code:{" "}
                  <Typography
                    component="span"
                    sx={{ color: "var(--text-primary)", fontSize: 12 }}
                  >
                    {recipient?.bank_code || "N/A"}
                  </Typography>
                </Typography>
                <Typography sx={{ color: "secondary.main", fontSize: 12 }}>
                  Account Name:{" "}
                  <Typography
                    component="span"
                    sx={{ color: "var(--text-primary)", fontSize: 12 }}
                  >
                    {recipient?.account_name || "N/A"}
                  </Typography>
                </Typography>
                <Typography sx={{ color: "secondary.main", fontSize: 12 }}>
                  Account No:{" "}
                  <Typography
                    component="span"
                    sx={{ color: "var(--text-primary)", fontSize: 12 }}
                  >
                    {recipient?.account_number || "N/A"}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}