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
  TextField,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
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
import KycStatusChip from "./ChipBadge";

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
     reason?: string,
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
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: "50%", y: "50%" });
   const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (isOpen && driverId) {
      setLoading(true);
      fetchDriverDetails(driverId)
        .then((data) => {
          setDriverData(data);

          const vehicleData = data?.vehicles?.[0] || data?.vehicle;
          const fallbackImg =
            vehicleData?.images?.find((img: any) => img.image_type === "front")
              ?.image_url ||
            vehicleData?.images?.[0]?.image_url ||
            null;

          setActiveImgUrl(fallbackImg);
        })
        .catch((err) => console.error("Failed to fetch driver details", err))
        .finally(() => setLoading(false));
    } else {
      setDriverData(null);
      setActiveImgUrl(null);
       setRejectMode(false);
      setRejectReason("");
    }
  }, [isOpen, driverId]);

  const handleCopyEmail = async () => {
    if (!driverData?.email) return;
    await navigator.clipboard.writeText(driverData.email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  //  Handler to calculate mouse position as a percentage of the image box
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin({ x: `${x}%`, y: `${y}%` });
  };

  const [actionLoading, setActionLoading] = useState<
    "approve" | "activate" | "reject" | "suspend" | "delete" | null
  >(null);

   const executeAction = async (
    actionType: "approve" | "activate" | "reject" | "suspend" | "delete",
    reason?: string,
  ) => {
    if (!driverData?.id || !onDriverAction) return;
 
    try {
      setActionLoading(actionType);
      await onDriverAction(driverData.id, actionType, reason);
    } catch (error) {
      console.error(`Action ${actionType} failed`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const isActive = driverData?.kyc_status === "APPROVED";
  const isSuspended = driverData?.status === "suspended";
  const isInReview = driverData?.kyc_status === "IN_REVIEW";
  const isPending = driverData?.kyc_status === "PENDING";
  const isRejected = driverData?.kyc_status === "REJECTED";
  const primaryVehicle = driverData?.vehicles?.[0] || driverData?.vehicle;

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
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "secondary.main",
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
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

                  <Box className="flex items-center gap-2">
                    <IconButton
                      onClick={handleCopyEmail}
                      sx={{ color: "#4d8eff", p: 0.5 }}
                    >
                      <ContentCopyIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    {copied && (
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 500,
                          mt: 0.5,
                        }}
                      >
                        Copied
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            <KycStatusChip status={driverData.kyc_status} />
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

          {/* IsInReview Core Vehicle Information Section */}
          {(isInReview || isPending) && (
            <Box className="flex justify-center items-center gap-5 w-full">
              {/* Left Column */}
              <Box className="w-1/2">
                {activeImgUrl ? (
                  <Box
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                    sx={{
                      width: "100%",
                      maxHeight: 300,
                      height: "100%",
                      borderRadius: "10px",
                      overflow: "hidden",
                      backgroundColor: "#121212",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.5,
                      position: "relative",
                      cursor: isZoomed ? "zoom-in" : "default",
                    }}
                  >
                    <Box
                      component="img"
                      src={activeImgUrl}
                      alt="Asset Review Display"
                      onError={() => setActiveImgUrl(null)}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        transform: isZoomed ? "scale(2.5)" : "scale(1)",
                        transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}`,
                        transition: isZoomed
                          ? "none"
                          : "transform 0.3s ease-out",
                        willChange: "transform",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 240,
                      borderRadius: "10px",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px dashed rgba(255, 255, 255, 0.12)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      mb: 1.5,
                      p: 2,
                      textAlign: "center",
                    }}
                  >
                    <FiCameraOff
                      size={24}
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    />
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      Select Asset to Preview
                    </Typography>
                  </Box>
                )}

                {/* Combined Thumbnail Stream: Vehicles + Documents */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  {primaryVehicle?.images?.map((img: any, idx: number) => {
                    const isSelected = activeImgUrl === img.image_url;
                    return (
                      <Box
                        key={img.id || `veh-${idx}`}
                        onClick={() => setActiveImgUrl(img.image_url)}
                        sx={{
                          width: 64,
                          height: 58,
                          borderRadius: "6px",
                          overflow: "hidden",
                          cursor: "pointer",
                          position: "relative",
                          border: isSelected
                            ? "2px solid var(--accent-gold, #FFD700)"
                            : "1px solid rgba(255,255,255,0.08)",
                          opacity: isSelected ? 1 : 0.6,
                          transition: "all 0.15s ease",
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <img
                          src={img.image_url}
                          alt="Vehicle thumbnail"
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
                            width: "100%",
                            bg: "rgba(0,0,0,0.7)",
                            py: 0.1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 8,
                              textTransform: "uppercase",
                              textAlign: "center",
                              fontWeight: 700,
                              color: "#FFF",
                            }}
                          >
                            {img.image_type}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Right Column: Verification Audit Sheet */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                className="w-1/2"
              >
                {/* Section A: Core Vehicle Assets */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      mb: 1,
                    }}
                  >
                    Vehicle Declaration
                  </Typography>

                  {primaryVehicle ? (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.06)",
                        backgroundColor: "rgba(255,255,255,0.01)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                        {primaryVehicle.model} •{" "}
                        <span style={{ color: "rgba(255,255,255,0.5)" }}>
                          {primaryVehicle.year}
                        </span>
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: 12, color: "secondary.main" }}
                        >
                          Plate Identifier:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {primaryVehicle.plate_number}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: 12, color: "secondary.main" }}
                        >
                          Exterior Coat:
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                          {primaryVehicle.color}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          mt: 0.5,
                          pt: 1,
                          borderTop: "1px dashed rgba(255,255,255,0.06)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: primaryVehicle.vehicle_info?.is_ac_working
                              ? "#50c878"
                              : "#ff6b6b",
                          }}
                        >
                          {primaryVehicle.vehicle_info?.is_ac_working
                            ? "✓ A/C Good"
                            : "✗ No A/C"}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: primaryVehicle.vehicle_info?.is_interior_neat
                              ? "#50c878"
                              : "#ff6b6b",
                          }}
                        >
                          {primaryVehicle.vehicle_info?.is_interior_neat
                            ? "✓ Neat Cabin"
                            : "✗ Interior Alert"}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.4)",
                        fontStyle: "italic",
                      }}
                    >
                      No vehicle metadata associated with request.
                    </Typography>
                  )}
                </Box>

                {/* Section B: Document Verification Registry Checklist */}
                <Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      mb: 1,
                    }}
                  >
                    Legal Document Registry
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {driverData?.documents &&
                    driverData.documents.length > 0 ? (
                      driverData.documents.map((doc: any) => {
                        const isInspecting = activeImgUrl === doc.file_url;
                        return (
                          <Box
                            key={doc.id}
                            onClick={() =>
                              doc.file_url && setActiveImgUrl(doc.file_url)
                            }
                            sx={{
                              p: 1.2,
                              borderRadius: "8px",
                              border: "1px solid",
                              borderColor: isInspecting
                                ? "var(--accent-gold, #FFD700)"
                                : "rgba(255,255,255,0.06)",
                              backgroundColor: isInspecting
                                ? "rgba(255,215,0,0.03)"
                                : "rgba(0,0,0,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              "&:hover": {
                                borderColor: isInspecting
                                  ? "var(--accent-gold, #FFD700)"
                                  : "rgba(255,255,255,0.15)",
                                backgroundColor: isInspecting
                                  ? "rgba(255,215,0,0.05)"
                                  : "rgba(255,255,255,0.02)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: isInspecting
                                    ? "var(--accent-gold, #FFD700)"
                                    : "#FFF",
                                }}
                              >
                                {doc.doc_type?.replace("_", " ")}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 10,
                                  color: "rgba(255,255,255,0.4)",
                                }}
                              >
                                Click to view file
                              </Typography>
                            </Box>

                            {/* Small context badge tracking processing status */}
                            <Box
                              sx={{
                                fontSize: 10,
                                fontWeight: 700,
                                px: 1,
                                py: 0.2,
                                borderRadius: "4px",
                                textTransform: "uppercase",
                                backgroundColor:
                                  doc.status === "APPROVED"
                                    ? "rgba(80,200,120,0.1)"
                                    : "rgba(255,179,0,0.1)",
                                color:
                                  doc.status === "APPROVED"
                                    ? "#50c878"
                                    : "#ffb300",
                              }}
                            >
                              {doc.status}
                            </Box>
                          </Box>
                        );
                      })
                    ) : (
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.4)",
                          fontStyle: "italic",
                        }}
                      >
                        No legal attachments filed.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* --- SEE MORE COLLAPSIBLE SECTION --- */}
          {isActive && primaryVehicle && (
            <Box sx={{ mt: 1 }}>
              {/* Clickable Header Button Link */}
              <Box
                onClick={() => {
                  setExpanded(!expanded);

                  if (
                    !expanded &&
                    !activeImgUrl &&
                    primaryVehicle.images &&
                    primaryVehicle.images.length > 0
                  ) {
                    setActiveImgUrl(primaryVehicle.images[0].image_url);
                  }
                }}
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

              {/* Collapsible Container Content (Split-Pane Layout) */}
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {/* LEFT COLUMN: Active Image Preview & Thumbnails */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {/* Main Preview Container */}
                    <Box
                      onMouseEnter={() => setIsZoomed(true)}
                      onMouseLeave={() => setIsZoomed(false)}
                      onMouseMove={handleMouseMove}
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
                        overflow: "hidden",
                        position: "relative",
                        cursor: activeImgUrl ? "zoom-in" : "default",
                      }}
                    >
                      {activeImgUrl ? (
                        <Box
                          component="img"
                          src={activeImgUrl}
                          alt="Active Preview"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            transform: isZoomed ? "scale(2)" : "scale(1)",
                            transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}`,
                            transition: isZoomed
                              ? "none"
                              : "transform 0.3s ease-out",
                            willChange: "transform",
                          }}
                        />
                      ) : (
                        <FiCameraOff size={48} color="var(--text-secondary)" />
                      )}
                    </Box>

                    {/* Thumbnail Wrap-around Row */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                      {primaryVehicle.images?.map((img, idx) => (
                        <Box
                          key={`veh-img-${idx}`}
                          onClick={() => setActiveImgUrl(img.image_url)}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1,
                            cursor: "pointer",
                            overflow: "hidden",
                            border:
                              activeImgUrl === img.image_url
                                ? "2px solid var(--accent-gold, #FFB300)"
                                : "1px solid var(--border)",
                            transition: "border-color 0.2s ease",
                            position: "relative",
                          }}
                        >
                          <Box
                            component="img"
                            src={img.image_url}
                            alt={`Thumbnail ${idx}`}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* RIGHT COLUMN: Verification Sheet */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    {/* Section 1: Vehicle Declaration */}
                    <Box
                      sx={{
                        // border: "1px solid var(--border)",
                        borderRadius: 2,
                        p: 2,
                        bgcolor: "background.paper",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <MdDirectionsCar
                          size={20}
                          color="var(--accent-gold, #FFB300)"
                        />
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
                          <Typography
                            sx={{ fontSize: 12, color: "text.secondary" }}
                          >
                            Model & Year
                          </Typography>
                          <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                            {primaryVehicle.model} ({primaryVehicle.year})
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            sx={{ fontSize: 12, color: "text.secondary" }}
                          >
                            Plate Number
                          </Typography>
                          <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                            {primaryVehicle.plate_number}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            sx={{ fontSize: 12, color: "text.secondary" }}
                          >
                            Color
                          </Typography>
                          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                            {primaryVehicle.color}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                              mb: 0.5,
                            }}
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
                                bgcolor: primaryVehicle.vehicle_info
                                  ?.is_ac_working
                                  ? "#e8f5e9"
                                  : "#ffebee",
                                color: primaryVehicle.vehicle_info
                                  ?.is_ac_working
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
                                bgcolor: primaryVehicle.vehicle_info
                                  ?.is_interior_neat
                                  ? "#e8f5e9"
                                  : "#ffebee",
                                color: primaryVehicle.vehicle_info
                                  ?.is_interior_neat
                                  ? "#2e7d32"
                                  : "#c62828",
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      {/* 2: Bank Info */}
                      <Box sx={{ mt: 4 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <MdAccountBalance size={18} color="#4d8eff" />
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 600,
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
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <Typography
                          sx={{ color: "secondary.main", fontSize: 12 }}
                        >
                          Bank Code:{" "}
                          <Typography
                            component="span"
                            sx={{
                              color: "var(--text-primary)",
                              fontSize: 12,
                            }}
                          >
                            {driverData.transfer_recipient?.bank_code || "N/A"}
                          </Typography>
                        </Typography>
                        <Typography
                          sx={{ color: "secondary.main", fontSize: 12 }}
                        >
                          Account Name:{" "}
                          <Typography
                            component="span"
                            sx={{
                              color: "var(--text-primary)",
                              fontSize: 12,
                            }}
                          >
                            {driverData.transfer_recipient?.account_name ||
                              "N/A"}
                          </Typography>
                        </Typography>
                        <Typography
                          sx={{ color: "secondary.main", fontSize: 12 }}
                        >
                          Account No:{" "}
                          <Typography
                            component="span"
                            sx={{
                              color: "var(--text-primary)",
                              fontSize: 12,
                            }}
                          >
                            {driverData.transfer_recipient?.account_number ||
                              "N/A"}
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          )}

          {(isInReview || isActive || isRejected) && (
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
                 {isInReview &&
                (rejectMode ? (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <TextField
                      label="Rejection reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Vehicle documents are blurry or expired"
                      multiline
                      minRows={2}
                      maxRows={5}
                      fullWidth
                      autoFocus
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          fontSize: 14,
                          color: "var(--text-primary)",
                          backgroundColor: "rgba(255,255,255,0.02)",
                          "& fieldset": {
                            borderColor: "rgba(255,255,255,0.12)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255,255,255,0.25)",
                          },
                          "&.Mui-focused fieldset": { borderColor: "#E57373" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "var(--text-secondary)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#E57373",
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        disabled={!!actionLoading}
                        onClick={() => {
                          setRejectMode(false);
                          setRejectReason("");
                        }}
                        sx={{
                          py: 1.2,
                          fontSize: 14,
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          borderColor: "rgba(255,255,255,0.15)",
                          "&:hover": {
                            borderColor: "rgba(255,255,255,0.3)",
                            backgroundColor: "rgba(255,255,255,0.03)",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        disabled={!rejectReason.trim() || !!actionLoading}
                        onClick={() =>
                          executeAction("reject", rejectReason.trim())
                        }
                        sx={{
                          py: 1.2,
                          fontSize: 14,
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: "8px",
                          backgroundColor: "#E53935",
                          color: "#fff",
                          boxShadow: "none",
                          "&:hover": {
                            backgroundColor: "#C62828",
                            boxShadow: "0 4px 12px rgba(229,57,53,0.3)",
                          },
                          "&.Mui-disabled": {
                            backgroundColor: "rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.4)",
                          },
                        }}
                      >
                        {actionLoading === "reject" ? (
                          <CircularProgress size={18} sx={{ color: "#fff" }} />
                        ) : (
                          "Confirm Rejection"
                        )}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      fullWidth
                      disabled={!!actionLoading}
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
                      onClick={() => setRejectMode(true)}
                    >
                      Reject Request
                    </Button>
                   <Button
                      variant="contained"
                      fullWidth
                      disabled={!!actionLoading}
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
                      onClick={() => executeAction("approve")}
                    >
                      {actionLoading === "approve" ? (
                        <CircularProgress size={18} sx={{ color: "#fff" }} />
                      ) : (
                        "Accept Request"
                      )}
                    </Button>
                  </>
                ))}

              {/* Action Suite: Active Moderator Controls */}
              {isActive && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Left Side: Earnings */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "rgba(255, 255, 255, 0.4)",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                      }}
                    >
                      Total Earnings
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 700,
                        textAlign: "center",
                        lineHeight: 1,
                      }}
                    >
                      {driverData.total_amount}
                    </Typography>
                  </Box>

                  {/* Right Side: Suspend Action */}
                  <Button
                    variant="contained"
                    disabled={!!actionLoading || isSuspended}
                    sx={{
                      py: 1.2,
                      px: 4,
                      fontSize: 14,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      minWidth: 180,
                      boxShadow: "none",
                      backgroundColor: isSuspended
                        ? "rgba(255,255,255,0.12)"
                        : "var(--accent-gold, #FFD700)",
                      color: isSuspended ? "rgba(255,255,255,0.6)" : "#000",
                      "&:hover": {
                        backgroundColor: isSuspended
                          ? "rgba(255,255,255,0.12)"
                          : "var(--accent-gold, #FFD700)",
                        boxShadow: isSuspended
                          ? "none"
                          : "0 4px 12px rgba(237,108,2,0.2)",
                      },
                    }}
                    onClick={() => {
                      if (!isSuspended) {
                        executeAction("suspend");
                      }
                    }}
                  >
                    {actionLoading === "suspend" ? (
                      <CircularProgress size={18} sx={{ color: "#000" }} />
                    ) : isSuspended ? (
                      "Driver Suspended"
                    ) : (
                      "Suspend Account"
                    )}
                  </Button>
                </Box>
              )}

                 {isRejected && (
                <>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled
                    sx={{
                      py: 1.2,
                      fontSize: 14,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      // backgroundColor: "#2E7D32",
                      color: "#fff",
                      boxShadow: "none",
                    }}
                    onClick={() => onDriverAction?.(driverData.id, "activate")}
                  >
                    Driver Rejected
                  </Button>
                </>
              )}
            </DialogActions>
          )}
        </Box>
      )}
    </Dialog>
  );
}
