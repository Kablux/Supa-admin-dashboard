import React from "react";
import { Box, Typography } from "@mui/material";
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

const microLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(255,255,255,0.4)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  mb: 1,
};

export default function DriverReviewPanel({
  driver,
  primaryVehicle,
  activeImgUrl,
  onSelectImage,
}: Props) {
  const emptyState = (
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
        p: 2,
        textAlign: "center",
      }}
    >
      <FiCameraOff size={24} style={{ color: "rgba(255,255,255,0.3)" }} />
      <Typography
        sx={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}
      >
        Select Asset to Preview
      </Typography>
    </Box>
  );

  const documents: any[] = (driver as any)?.documents || [];

  return (
    <Box className="flex flex-wrap md:flex-nowrap justify-center items-center gap-5 w-full">
      {/* Left Column: preview + thumbnails */}
      <Box className="md:w-1/2">
        <Box sx={{ mb: 1.5 }}>
          <ZoomableImage
            src={activeImgUrl}
            alt="Asset Review Display"
            onError={() => onSelectImage(null)}
            zoomScale={2.5}
            emptyState={emptyState}
          />
        </Box>
        <ThumbnailStrip
          images={primaryVehicle?.images}
          activeUrl={activeImgUrl}
          onSelect={onSelectImage}
          width={64}
          height={58}
          showType
          justify="space-between"
          keyPrefix="veh"
        />
      </Box>

      {/* Right Column: verification audit sheet */}
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        className="w-full md:w-1/2"
      >
        {/* Vehicle Declaration */}
        <Box>
          <Typography sx={microLabelSx}>Vehicle Declaration</Typography>
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
                <Typography sx={{ fontSize: 12, color: "secondary.main" }}>
                  Plate Identifier:
                </Typography>
                <Typography
                  sx={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.02em" }}
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
                <Typography sx={{ fontSize: 12, color: "secondary.main" }}>
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

        {/* Legal Document Registry */}
        <Box>
          <Typography sx={microLabelSx}>Legal Document Registry</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {documents.length > 0 ? (
              documents.map((doc: any) => {
                const isInspecting = activeImgUrl === doc.file_url;
                return (
                  <Box
                    key={doc.id}
                    onClick={() => doc.file_url && onSelectImage(doc.file_url)}
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
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                        sx={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}
                      >
                        Click to view file
                      </Typography>
                    </Box>
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
                        color: doc.status === "APPROVED" ? "#50c878" : "#ffb300",
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
  );
}