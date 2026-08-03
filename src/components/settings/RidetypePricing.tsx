import React from "react";
import { Box, Button, Typography } from "@mui/material";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { RideTypeRow } from "./helpers/FormMapper";
import RideTypeCard from "./RidetypeCard";
import Section from "./Section";


interface Props {
  rideTypes: RideTypeRow[];
  onAdd: () => void;
  onChange: (idx: number, patch: Partial<RideTypeRow>) => void;
  onRemove: (idx: number) => void;
}

export default function RideTypePricingSection({
  rideTypes,
  onAdd,
  onChange,
  onRemove,
}: Props) {
  return (
    <Section
      icon={<DirectionsCarRoundedIcon fontSize="small" />}
      title="Ride Type Pricing"
      subtitle="Control cost per km, base fare, and surge for each tier"
      action={
        <Button
          onClick={onAdd}
          startIcon={<AddRoundedIcon />}
          sx={{
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: "10px",
            px: 1.75,
            height: 38,
            color: "var(--text-primary)",
            border: "1px solid var(--border, rgba(255,255,255,0.15))",
            "&:hover": {
              borderColor: "var(--accent-gold, #FFD700)",
              backgroundColor: "rgba(255,215,0,0.04)",
            },
          }}
        >
          Add ride type
        </Button>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {rideTypes.length === 0 ? (
          <Typography
            sx={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              fontStyle: "italic",
            }}
          >
            No ride types configured. Add one to start pricing.
          </Typography>
        ) : (
          rideTypes.map((row, idx) => (
            <RideTypeCard
              key={idx}
              row={row}
              onChange={(p) => onChange(idx, p)}
              onRemove={() => onRemove(idx)}
            />
          ))
        )}
      </Box>
    </Section>
  );
}