import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  MdDirectionsCar,
  MdAccountBalance,
  MdChevronLeft,
  MdChevronRight,
  MdExpandMore,
} from "react-icons/md";
import { MetricBox } from "../ModalMetricsBox";
import { fetchDriverDetails } from "../../api/xhr";
import { Driver, VehicleImage } from "../../types/auth";
import { Collapse } from "@mui/material";

const infoBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  p: 1.5,
  border: "1px solid var(--text-primary)",
  width: "100%",
  borderRadius: "4px",
};

interface DriverDetailsModalProps {
  driverId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DriverDetailsModal({
  driverId,
  isOpen,
  onClose,
}: DriverDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [driverData, setDriverData] = useState<Driver | null>(null);

  useEffect(() => {
    if (isOpen && driverId) {
      setLoading(true);
      fetchDriverDetails(driverId)
        .then((data) => setDriverData(data))
        .catch((err) => console.error("Failed to fetch driver details", err))
        .finally(() => setLoading(false));
    } else {
      setDriverData(null);
    }
  }, [isOpen, driverId]);

  const handleCopyEmail = () => {
    if (driverData?.email) navigator.clipboard.writeText(driverData.email);
  };

  const [expanded, setExpanded] = useState(false);

  // Extract front image from vehicle array fallback to index 0
  const vehicleImage =
    driverData?.vehicle?.images?.find((img) => img.image_type === "front")
      ?.image_url || driverData?.vehicle?.images?.[0]?.image_url;

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
          p: 4,
          border: "1px solid var(--border)",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        },
      }}
    >
      {loading || !driverData ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "var(--accent-gold)" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Header section: Avatar and Basic Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                src={driverData.profile_picture_url}
                sx={{ width: 54, height: 54 }}
              />
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <StarIcon sx={{ color: "#ffb400", fontSize: 18 }} />
                  <Typography sx={{ fontSize: 18, fontWeight: 700, mr: 0.5 }}>
                    {parseFloat(driverData.rating || "0").toFixed(1)}
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {driverData.full_name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography sx={{ fontSize: 14, color: "secondary.main" }}>
                    {driverData.email}
                  </Typography>
                  <IconButton
                    onClick={handleCopyEmail}
                    sx={{ color: "#4d8eff", p: 0.5 }}
                  >
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Chip
              label={driverData.status.toUpperCase()}
              size="small"
              sx={{
                backgroundColor:
                  driverData.status === "active"
                    ? "rgba(80,200,120,0.15)"
                    : "rgba(255,107,107,0.15)",
                color: driverData.status === "active" ? "#50c878" : "#ff6b6b",
                fontWeight: 700,
                fontSize: 12,
              }}
            />
          </Box>

          {/* Customer Info Section */}
          <Box>
            <Typography sx={{ fontSize: 14, mb: 1.5, color: "primary" }}>
              Customer Info
            </Typography>
            <Box className="gap-4 flex">
              <Box sx={infoBoxStyle}>
                <PhoneIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                <Typography sx={{ fontSize: 14 }}>
                  {driverData.phone_number || "N/A"}
                </Typography>
              </Box>
              <Box sx={infoBoxStyle}>
                <LocationOnIcon
                  sx={{ fontSize: 18, color: "secondary.main" }}
                />
                <Typography sx={{ fontSize: 14 }}>
                  {driverData.address || "No address provided"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Dynamic Metrics Section */}
          <Box className="flex gap-4 flex-wrap sm:flex-nowrap">
            {/* Points Section */}
            <Box className="w-[55%]">
              <Typography sx={{ fontSize: 14, mb: 1.5, color: "primary" }}>
                Points
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <MetricBox
                  value={driverData.loyalty_points || "0"}
                  label="Bonus"
                  labelColor="#6467F2"
                />
                <MetricBox
                  value={driverData.mileage_points || "0"}
                  label="Millage"
                  labelColor="#21C45D"
                />
              </Box>
            </Box>

            {/* Ride Overview Section */}
            <Box className="w-full">
              <Typography sx={{ fontSize: 14, mb: 1.5, color: "primary" }}>
                Ride overview
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <MetricBox
                  value={driverData.total_rides || "0"}
                  label="Total Ride"
                  labelColor="#7a92f0"
                />
                <MetricBox
                  value={driverData.completed_rides || "0"}
                  label="Completed"
                  labelColor="#50c878"
                />
                <MetricBox
                  value={driverData.cancelled_rides || "0"}
                  label="Canceled"
                  labelColor="#ff6b6b"
                />
              </Box>
            </Box>
          </Box>

          {/* Core Vehicle Information Section */}

          {/* --- SEE MORE COLLAPSIBLE SECTION --- */}
          {driverData.vehicle && (
            <Box sx={{ mt: 1 }}>
              {/* Clickable Header Button Link */}
              <Box
                onClick={() => setExpanded(!expanded)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
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

              {/* Collapsible Container Content */}
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mt: 2,
                  }}
                >
                  <Typography sx={{ fontSize: 14 }}>
                    Vehicle & Account Information
                  </Typography>

                  {/* 1. Image Carousel Block */}
                  {driverData.vehicle.images &&
                    driverData.vehicle.images.length > 0 && (
                      <VehicleImageSlider images={driverData.vehicle.images} />
                    )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  {/* Left Side: Vehicle Details */}
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      border: "2px dashed var(--border)",
                      borderRadius: "4px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MdDirectionsCar
                        size={18}
                        color="var(--accent-gold, #FFB300)"
                      />
                      <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                        {driverData.vehicle.model} ({driverData.vehicle.year})
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography sx={{ color: "secondary.main" }}>
                        Plate No:{" "}
                        <Typography
                          component="span"
                          sx={{ color: "var(--text-primary)" }}
                        >
                          {driverData.vehicle.plate_number}
                        </Typography>
                      </Typography>
                      <Typography sx={{ color: "secondary.main" }}>
                        Vehicle Color:{" "}
                        <Typography
                          component="span"
                          sx={{ color: "var(--text-primary)" }}
                        >
                          {driverData.vehicle.color}
                        </Typography>
                      </Typography>
                      <Typography sx={{ color: "secondary.main" }}>
                        A/C:{" "}
                        <Typography
                          component="span"
                          sx={{
                            color: driverData.vehicle.vehicle_info
                              ?.is_ac_working
                              ? "#50c878"
                              : "#ff6b6b",
                          }}
                        >
                          {driverData.vehicle.vehicle_info?.is_ac_working
                            ? "Functional"
                            : "Faulty"}
                        </Typography>
                      </Typography>
                      <Typography sx={{ color: "secondary.main" }}>
                        Interior:{" "}
                        <Typography
                          component="span"
                          sx={{
                            color: driverData.vehicle.vehicle_info
                              ?.is_interior_neat
                              ? "#50c878"
                              : "#ff6b6b",
                          }}
                        >
                          {driverData.vehicle.vehicle_info?.is_interior_neat
                            ? "Clean"
                            : "Requires Attention"}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Right Side: Settlement Banking Details */}
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      border: "2px dashed var(--border)",
                      borderRadius: "4px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 1.5,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <MdAccountBalance size={18} color="#4d8eff" />
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "secondary.main",
                          }}
                        >
                          Account Info
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography sx={{ color: "secondary.main" }}>
                        Bank Code:{" "}
                        <Typography
                          component="span"
                          sx={{ color: "var(--text-primary)" }}
                        >
                          {driverData.transfer_recipient?.bank_code || "N/A"}
                        </Typography>
                      </Typography>
                      <Typography sx={{ color: "secondary.main" }}>
                        Account Name:{" "}
                        <Typography
                          component="span"
                          sx={{ color: "var(--text-primary)" }}
                        >
                          {driverData.transfer_recipient.account_name}
                        </Typography>
                      </Typography>
                      <Typography sx={{ color: "secondary.main" }}>
                        Account No:{" "}
                        <Typography
                          component="span"
                          sx={{ color: "var(--text-primary)" }}
                        >
                          {driverData.transfer_recipient.account_number}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          )}
        </Box>
      )}
    </Dialog>
  );
}

function VehicleImageSlider({ images }: { images: VehicleImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 180,
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border)",
      }}
    >
      <Box
        component="img"
        src={images[activeIndex].image_url}
        alt={`Vehicle view ${activeIndex}`}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Angle Identifier Tag */}
      <Chip
        label={images[activeIndex].image_type.toUpperCase()}
        size="small"
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />

      {/* Control overlays if multiple views exist */}
      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.75)" },
            }}
            size="small"
          >
            <MdChevronLeft size={20} />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.75)" },
            }}
            size="small"
          >
            <MdChevronRight size={20} />
          </IconButton>

          {/* Navigation Dots */}
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 0.75,
              p: "4px 8px",
              borderRadius: "10px",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            {images.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor:
                    idx === activeIndex ? "#FFB300" : "rgba(255,255,255,0.4)",
                  transition: "background-color 0.2s ease",
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
