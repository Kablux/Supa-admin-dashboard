import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Chip,
  Button,
  DialogActions,
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
import { FiCameraOff } from "react-icons/fi";
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
  onDriverAction?: (
    driverId: string,
    actionType: "approve" | "activate" | "reject" | "suspend" | "delete",
  ) => void;
}

export default function DriverDetailsModal({
  driverId,
  isOpen,
  onClose,
  onDriverAction,
}: DriverDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [driverData, setDriverData] = useState<Driver | null>(null);
  const [activeImgUrl, setActiveImgUrl] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isOpen && driverId) {
      setLoading(true);
      fetchDriverDetails(driverId)
        .then((data) => {
          setDriverData(data);
          const fallbackImg =
            data?.vehicle?.images?.find(
              (img: any) => img.image_type === "front",
            )?.image_url ||
            data?.vehicle?.images?.[0]?.image_url ||
            null;
          setActiveImgUrl(fallbackImg);
        })
        .catch((err) => console.error("Failed to fetch driver details", err))
        .finally(() => setLoading(false));
    } else {
      setDriverData(null);
      setActiveImgUrl(null);
    }
  }, [isOpen, driverId]);

  const handleCopyEmail = () => {
    if (driverData?.email) {
      navigator.clipboard.writeText(driverData.email);
    }
  };

  const isPending = driverData?.status === "pending_verification";
  const isActive = driverData?.status === "active";
  const isSuspended = driverData?.status === "suspended";

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
                fontWeight: 600,
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
          {isActive && (
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
          )}

          {/* Core Vehicle Information Section */}
          {isPending && (
            <Box>
              {activeImgUrl ? (
                /* Primary Large Active Display Showcase Frame */
                <Box
                  sx={{
                    width: "100%",
                    height: 280,
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "#1c1c1c",
                    border: "1px solid rgba(255,255,255,0.08)",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                  }}
                >
                  <img
                    src={activeImgUrl}
                    alt="Active Preview Panel"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={() => setActiveImgUrl(null)} // Triggers placeholder fallback on bad/dead links
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: 229,
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.01)",
                    border: "1px dashed rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    mb: 1.5,
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 215, 0, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-gold, #FFD700)",
                      border: "1px solid rgba(255, 215, 0, 0.12)",
                    }}
                  >
                    <FiCameraOff size={22} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#E5E7EB",
                        mb: 0.5,
                      }}
                    >
                      No Vehicle Image Available
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.4)",
                        maxWidth: 300,
                        mx: "auto",
                        lineHeight: 1.4,
                      }}
                    >
                      Verification photos haven't been uploaded by this operator
                      yet or the registry file is unavailable.
                    </Typography>
                  </Box>
                </Box>
              )}
              {/* Grid Deck for Secondary Thumbnails */}
              {driverData?.vehicle?.images &&
                driverData.vehicle.images.length > 0 && (
                  <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    {driverData.vehicle.images.map((img: any, idx: number) => {
                      const isSelected = activeImgUrl === img.image_url;
                      return (
                        <Box
                          key={img.id || idx}
                          onClick={() => setActiveImgUrl(img.image_url)}
                          sx={{
                            width: 80,
                            height: 70,
                            borderRadius: "8px",
                            overflow: "hidden",
                            cursor: "pointer",
                            position: "relative",
                            border: isSelected
                              ? "2px solid var(--accent-gold, #FFD700)"
                              : "1px solid rgba(255,255,255,0.1)",
                            opacity: isSelected ? 1 : 0.5,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": { opacity: 1, transform: "scale(1.02)" },
                          }}
                        >
                          <img
                            src={img.image_url}
                            alt={img.image_type}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              width: "100%",
                              background: "rgba(0,0,0,0.6)",
                              py: 0.2,
                              px: 0.4,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 9,
                                textTransform: "uppercase",
                                textAlign: "center",
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.8)",
                              }}
                            >
                              {img.image_type || `View ${idx + 1}`}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
            </Box>
          )}

          {/* --- SEE MORE COLLAPSIBLE SECTION --- */}
          {isActive && driverData.vehicle && (
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

          {(isPending || isActive || isSuspended) && (
            <DialogActions
              sx={{
                p: 3,
                gap: 2,
                backgroundColor: "", // Optional: e.g., "rgba(0,0,0,0.2)"
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
              }}
            >
              {/* Action Suite: Registration Approvals */}
              {isPending && (
                <>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 1.2,
                      fontSize: 14,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      color: "#E57373",
                      borderColor: "rgba(229, 115, 115, 0.3)",
                      "&:hover": {
                        borderColor: "#E57373",
                        backgroundColor: "rgba(229, 115, 115, 0.08)",
                      },
                    }}
                    onClick={() => onDriverAction?.(driverData.id, "reject")}
                  >
                    Decline Request
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      py: 1.2,
                      fontSize: 14,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      backgroundColor: "#2E7D32",
                      color: "#fff",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#1B5E20",
                        boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                      },
                    }}
                    onClick={() => onDriverAction?.(driverData.id, "approve")}
                  >
                    Accept Request
                  </Button>
                </>
              )}

              {/* Action Suite: Active Moderator Controls */}
              {isActive && (
                <>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 1.2,
                      fontSize: 14,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      color: "#EF5350",
                      borderColor: "rgba(239, 83, 80, 0.3)",
                      "&:hover": {
                        borderColor: "#EF5350",
                        backgroundColor: "rgba(239, 83, 80, 0.08)",
                      },
                    }}
                    onClick={() => onDriverAction?.(driverData.id, "delete")}
                  >
                    Delete Account
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      py: 1.2,
                      fontSize: 14,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      backgroundColor: "primary.main",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                    onClick={() => onDriverAction?.(driverData.id, "suspend")}
                  >
                    Suspend Account
                  </Button>
                </>
              )}

              {/* Action Suite: Suspended Moderator Controls */}
              {isSuspended && (
                <>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 1.2,
                      fontSize: 14,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      color: "#EF5350",
                      borderColor: "rgba(239, 83, 80, 0.3)",
                      "&:hover": {
                        borderColor: "#EF5350",
                        backgroundColor: "rgba(239, 83, 80, 0.08)",
                      },
                    }}
                    onClick={() => onDriverAction?.(driverData.id, "delete")}
                  >
                    Delete Account
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      py: 1.2,
                      fontSize: 14,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      backgroundColor: "#2E7D32", // Green to signal reactivation
                      color: "#fff",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#1B5E20",
                        boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
                      },
                    }}
                    onClick={() => onDriverAction?.(driverData.id, "activate")}
                  >
                    Activate Account
                  </Button>
                </>
              )}
            </DialogActions>
          )}
        </Box>
        // </Box>
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
