import React from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { RideTypeRow } from "./helpers/FormMapper";
import NumberField from "./helpers/NumberField";
import Field from "./helpers/Field";


const SAMPLE_KM = 10;
const SAMPLE_MIN = 15;

export const estimateFare = (r: RideTypeRow) => {
  const base = Number(r.base_fare) || 0;
  const perKm = Number(r.per_km) || 0;
  const perMin = Number(r.per_minute) || 0;
  const total = base + perKm * SAMPLE_KM + perMin * SAMPLE_MIN;
  return `₦${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

interface RideTypeCardProps {
  row: RideTypeRow;
  onChange: (patch: Partial<RideTypeRow>) => void;
  onRemove: () => void;
}

export default function RideTypeCard({
  row,
  onChange,
  onRemove,
}: RideTypeCardProps) {
  return (
    <Box
      sx={{
        p: 2.25,
        borderRadius: "12px",
        border: "1px solid var(--border, rgba(255,255,255,0.1))",
        backgroundColor: "rgba(255,255,255,0.015)",
      }}
    >
      {/* Card header: name + estimate + remove */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 2,
        }}
      >
        <TextField
          value={row.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Ride type name"
          variant="standard"
          sx={{
            "& .MuiInput-input": {
              fontSize: 15,
              fontWeight: 700,
              textTransform: "capitalize",
              color: "var(--text-primary)",
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "var(--border, rgba(255,255,255,0.15))",
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "rgba(255,255,255,0.35) !important",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "var(--accent-gold, #FFD700)",
            },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: "8px",
              backgroundColor: "rgba(255,215,0,0.08)",
              border: "1px solid rgba(255,215,0,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                color: "var(--text-secondary)",
                lineHeight: 1,
              }}
            >
              {`${SAMPLE_KM} km · ${SAMPLE_MIN} min`}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--accent-gold, #FFD700)",
              }}
            >
              {estimateFare(row)}
            </Typography>
          </Box>
          <IconButton
            onClick={onRemove}
            sx={{
              color: "#E57373",
              "&:hover": { backgroundColor: "rgba(229,115,115,0.08)" },
            }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Pricing grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        <Field label="Cost per km">
          <NumberField
            value={row.per_km}
            onChange={(v) => onChange({ per_km: v })}
            start="₦"
            end="/km"
          />
        </Field>
        <Field label="Base fare">
          <NumberField
            value={row.base_fare}
            onChange={(v) => onChange({ base_fare: v })}
            start="₦"
          />
        </Field>
        <Field label="Per minute">
          <NumberField
            value={row.per_minute}
            onChange={(v) => onChange({ per_minute: v })}
            start="₦"
            end="/min"
          />
        </Field>
        <Field label="Max surge">
          <NumberField
            value={row.max_surge}
            onChange={(v) => onChange({ max_surge: v })}
            end="×"
          />
        </Field>
      </Box>
    </Box>
  );
}