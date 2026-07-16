import { Box, Typography, IconButton } from "@mui/material";
import { InspectedCar } from "../../types/common.types";
import { CarSpecRow } from "./CarSpecRow";
import { StatusBadge } from "./StatusBadge";

export function CarCard({
  car,
  onAction,
}: {
  car: InspectedCar;
  onAction: (car: InspectedCar) => void;
}) {
  // const dispatch = useAppDispatch();
  // const cfg = STATUS_CFG[car.status];

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.18s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.25)",
          borderColor: "rgba(245,197,24,0.2)",
        },
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={() => onAction(car)}
    >
      {/* Image + favourite */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#111",
          aspectRatio: "16/9",
          overflow: "hidden",
        }}
      >
        {car.imageUrl ? (
          <Box
            component="img"
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.04)" },
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.3,
            }}
          >
            <Typography sx={{ fontSize: 32 }}>🚗</Typography>
          </Box>
        )}
      </Box>

      {/* Card body */}
      <Box
        sx={{
          p: 1.75,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          flex: 1,
        }}
      >
        {/* Make / model + category */}
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 14,
              color: "var(--text-primary)",
              lineHeight: 1.25,
            }}
          >
            {car.make} – {car.model}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
            {car.category}
          </Typography>
        </Box>

        {/* Specs */}
        <CarSpecRow car={car} />

        {/* Price + status badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "auto",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4 }}>
              <Typography
                sx={{ fontWeight: 700, color: "var(--text-primary)" }}
              >
                N{car.pricePerDay}.00/
              </Typography>
              <Typography sx={{ fontSize: 14, color: "var(--text-muted)" }}>
                day
              </Typography>
            </Box>
            {car.originalPricePerDay && (
              <Typography
                sx={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  textDecoration: "line-through",
                }}
              >
                ${car.originalPricePerDay}.00
              </Typography>
            )}
          </Box>
          <StatusBadge status={car.status} />
        </Box>
      </Box>
    </Box>
  );
}
