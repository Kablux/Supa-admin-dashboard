import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { updateGlobalConfig } from "../api/xhr";
import { GlobalConfig, RideTypePricing } from "../types/common.types";

/* ----------------------------- form model ----------------------------- */

interface RideTypeRow extends RideTypePricing {
  name: string;
}

interface FormState {
  base_fare: string;
  commission_rate: string;
  max_surge: string;
  driver_earning_percent: string;
  ride_request_ttl: string;
  driver_offer_ttl: string;
  rideTypes: RideTypeRow[];
  extra: Record<string, string>;
}

const toForm = (c: GlobalConfig): FormState => ({
  base_fare: c.base_fare ?? "",
  commission_rate: c.commission_rate ?? "",
  max_surge: c.max_surge ?? "",
  driver_earning_percent: c.driver_earning_percent ?? "",
  ride_request_ttl:
    c.ride_request_ttl != null ? String(c.ride_request_ttl) : "",
  driver_offer_ttl:
    c.driver_offer_ttl != null ? String(c.driver_offer_ttl) : "",
  rideTypes: Object.entries(c.ride_type_pricing ?? {}).map(([name, p]) => ({
    name,
    per_km: p.per_km ?? "",
    base_fare: p.base_fare ?? "",
    per_minute: p.per_minute ?? "",
    max_surge: p.max_surge ?? "",
  })),
  extra: { ...(c.extra ?? {}) },
});

const toConfig = (f: FormState): GlobalConfig => ({
  base_fare: f.base_fare,
  commission_rate: f.commission_rate,
  max_surge: f.max_surge,
  driver_earning_percent: f.driver_earning_percent,
  ride_request_ttl: parseInt(f.ride_request_ttl || "0", 10),
  driver_offer_ttl: parseInt(f.driver_offer_ttl || "0", 10),
  ride_type_pricing: f.rideTypes.reduce(
    (acc, r) => {
      const key = r.name.trim();
      if (key)
        acc[key] = {
          per_km: r.per_km,
          base_fare: r.base_fare,
          per_minute: r.per_minute,
          max_surge: r.max_surge,
        };
      return acc;
    },
    {} as Record<string, RideTypePricing>,
  ),
  extra: f.extra,
});

/* --------------------------- default seed ----------------------------- *
 * The config endpoint is still in progress, so the page seeds from these
 * local defaults instead of fetching. Replace with a GET once the endpoint
 * is ready (swap the DEFAULT_FORM initializers for a fetch effect).
 * -------------------------------------------------------------------- */
const DEFAULT_CONFIG: GlobalConfig = {
  base_fare: "400.00",
  commission_rate: "0.00",
  max_surge: "1.00",
  driver_earning_percent: "100.00",
  ride_request_ttl: 900,
  driver_offer_ttl: 600,
  ride_type_pricing: {
    luxury: {
      per_km: "800",
      base_fare: "2200",
      max_surge: "4.0",
      per_minute: "70",
    },
    premium: {
      per_km: "230",
      base_fare: "600",
      max_surge: "3.5",
      per_minute: "40",
    },
    standard: {
      per_km: "400",
      base_fare: "1800",
      max_surge: "3.0",
      per_minute: "30",
    },
  },
  extra: {
    admin_base_url: "http://api.kabluxe.com",
    kyc_reviewer_email: "adeshina@kabluxe.com",
  },
};

const DEFAULT_FORM = toForm(DEFAULT_CONFIG);

/* ------------------------------- styles ------------------------------- */

const cardSx = {
  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--border, rgba(255,255,255,0.1))",
  borderRadius: "16px",
  overflow: "hidden",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    height: 44,
    borderRadius: "10px",
    fontSize: 14,
    color: "var(--text-primary)",
    backgroundColor: "rgba(255,255,255,0.02)",
    "& fieldset": { borderColor: "var(--border, rgba(255,255,255,0.12))" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent-gold, #FFD700)" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.35)",
    opacity: 1,
  },
};

const adornSx = { color: "var(--text-secondary)", fontSize: 13 };

/* ---------------------------- small pieces ---------------------------- */

function Section({
  icon,
  title,
  subtitle,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box sx={cardSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          py: 2.25,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,215,0,0.08)",
              color: "var(--accent-gold, #FFD700)",
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography
                sx={{ fontSize: 12.5, color: "var(--text-secondary)" }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {action}
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text-primary)",
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      {children}
      {hint && (
        <Typography
          sx={{ fontSize: 11.5, color: "var(--text-secondary)", mt: 0.5 }}
        >
          {hint}
        </Typography>
      )}
    </Box>
  );
}

const ttlHint = (v: string) => {
  const n = Number(v);
  if (!n || Number.isNaN(n)) return "seconds";
  const m = Math.round((n / 60) * 10) / 10;
  return `${n} seconds ≈ ${m} min`;
};

const SAMPLE_KM = 10;
const SAMPLE_MIN = 15;
const estimateFare = (r: RideTypeRow) => {
  const base = Number(r.base_fare) || 0;
  const perKm = Number(r.per_km) || 0;
  const perMin = Number(r.per_minute) || 0;
  const total = base + perKm * SAMPLE_KM + perMin * SAMPLE_MIN;
  return `₦${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

/* ------------------------------ ride type ----------------------------- */

function RideTypeCard({
  row,
  onChange,
  onRemove,
}: {
  row: RideTypeRow;
  onChange: (patch: Partial<RideTypeRow>) => void;
  onRemove: () => void;
}) {
  const priceField = (
    label: string,
    key: keyof RideTypePricing,
    startAdorn?: string,
    endAdorn?: string,
  ) => (
    <Field label={label}>
      <TextField
        value={row[key]}
        onChange={(e) =>
          onChange({ [key]: e.target.value } as Partial<RideTypeRow>)
        }
        size="small"
        fullWidth
        sx={inputSx}
        slotProps={{
          input: {
            startAdornment: startAdorn ? (
              <InputAdornment position="start">
                <span style={adornSx}>{startAdorn}</span>
              </InputAdornment>
            ) : undefined,
            endAdornment: endAdorn ? (
              <InputAdornment position="end">
                <span style={adornSx}>{endAdorn}</span>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
    </Field>
  );

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
        {priceField("Cost per km", "per_km", "₦", "/km")}
        {priceField("Base fare", "base_fare", "₦")}
        {priceField("Per minute", "per_minute", "₦", "/min")}
        {priceField("Max surge", "max_surge", undefined, "×")}
      </Box>
    </Box>
  );
}

/* -------------------------------- page -------------------------------- */

interface SettingsPageProps {
  /** Optional: called after a plain "Save" (e.g. to navigate away). */
  onSaved?: () => void;
}

export default function SettingsPage({ onSaved }: SettingsPageProps) {
  const [saving, setSaving] = useState<false | "save" | "continue">(false);
  // Seeded from local defaults — no fetch on mount (endpoint in progress).
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [snapshot, setSnapshot] = useState(JSON.stringify(DEFAULT_FORM));

  const isDirty = useMemo(
    () => JSON.stringify(form) !== snapshot,
    [form, snapshot],
  );

  const patch = (p: Partial<FormState>) =>
    setForm((f) => (f ? { ...f, ...p } : f));

  const setExtra = (key: string, val: string) =>
    setForm((f) => (f ? { ...f, extra: { ...f.extra, [key]: val } } : f));

  const patchRideType = (idx: number, p: Partial<RideTypeRow>) =>
    setForm((f) =>
      f
        ? {
            ...f,
            rideTypes: f.rideTypes.map((r, i) =>
              i === idx ? { ...r, ...p } : r,
            ),
          }
        : f,
    );

  const addRideType = () =>
    setForm((f) =>
      f
        ? {
            ...f,
            rideTypes: [
              ...f.rideTypes,
              {
                name: "",
                per_km: "0",
                base_fare: "0",
                per_minute: "0",
                max_surge: "1.0",
              },
            ],
          }
        : f,
    );

  const removeRideType = (idx: number) =>
    setForm((f) =>
      f ? { ...f, rideTypes: f.rideTypes.filter((_, i) => i !== idx) } : f,
    );

  const handleSave = async (mode: "save" | "continue") => {
    // Validate ride-type names: non-empty & unique.
    const names = form.rideTypes.map((r) => r.name.trim());
    if (names.some((n) => !n)) {
      toast.error("Every ride type needs a name");
      return;
    }
    if (new Set(names).size !== names.length) {
      toast.error("Ride type names must be unique");
      return;
    }

    setSaving(mode);
    try {
      const updated = await updateGlobalConfig(toConfig(form));
      const next = toForm(updated);
      setForm(next);
      setSnapshot(JSON.stringify(next));
      toast.success("Settings saved");
      if (mode === "save") onSaved?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (snapshot) setForm(JSON.parse(snapshot));
  };

  const numberField = (
    value: string,
    onChange: (v: string) => void,
    opts: { start?: string; end?: string; placeholder?: string } = {},
  ) => (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={opts.placeholder}
      size="small"
      fullWidth
      sx={inputSx}
      slotProps={{
        input: {
          startAdornment: opts.start ? (
            <InputAdornment position="start">
              <span style={adornSx}>{opts.start}</span>
            </InputAdornment>
          ) : undefined,
          endAdornment: opts.end ? (
            <InputAdornment position="end">
              <span style={adornSx}>{opts.end}</span>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );

  return (
    <Box className="fade-in" sx={{ pb: 12 }}>
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
          px: 0.5,
        }}
      >
        <SettingsRoundedIcon
          sx={{ color: "var(--accent-gold, #FFD700)", fontSize: 26 }}
        />
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
            Settings
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
            Global platform configuration
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2.5,
            width: "100%",
          }}
        >
          {/* Fares & Commission */}
          <Section
            icon={<PaymentsRoundedIcon fontSize="small" />}
            title="Fares & Commission"
            subtitle="Platform-wide defaults for pricing and revenue split"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.5,
              }}
            >
              <Field label="Base fare" hint="Default fallback base fare">
                {numberField(form.base_fare, (v) => patch({ base_fare: v }), {
                  start: "₦",
                })}
              </Field>
              <Field
                label="Commission rate"
                hint="Platform commission percentage"
              >
                {numberField(
                  form.commission_rate,
                  (v) => patch({ commission_rate: v }),
                  { end: "%" },
                )}
              </Field>
              <Field
                label="Driver earning percent"
                hint="Driver share after commission"
              >
                {numberField(
                  form.driver_earning_percent,
                  (v) => patch({ driver_earning_percent: v }),
                  { end: "%" },
                )}
              </Field>
              <Field label="Max surge" hint="Global maximum surge multiplier">
                {numberField(form.max_surge, (v) => patch({ max_surge: v }), {
                  end: "×",
                })}
              </Field>
            </Box>
          </Section>

          {/* Request timing */}
          <Section
            icon={<TimerRoundedIcon fontSize="small" />}
            title="Request Timing"
            subtitle="How long requests and offers stay live"
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.5,
              }}
            >
              <Field
                label="Ride request TTL"
                hint={ttlHint(form.ride_request_ttl)}
              >
                {numberField(
                  form.ride_request_ttl,
                  (v) => patch({ ride_request_ttl: v }),
                  { end: "sec" },
                )}
              </Field>
              <Field
                label="Driver offer TTL"
                hint={ttlHint(form.driver_offer_ttl)}
              >
                {numberField(
                  form.driver_offer_ttl,
                  (v) => patch({ driver_offer_ttl: v }),
                  { end: "sec" },
                )}
              </Field>
            </Box>
          </Section>
        </Box>
 
        {/* Ride type pricing */}
        <Section
          icon={<DirectionsCarRoundedIcon fontSize="small" />}
          title="Ride Type Pricing"
          subtitle="Control cost per km, base fare, and surge for each tier"
          action={
            <Button
              onClick={addRideType}
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
            {form.rideTypes.length === 0 ? (
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
              form.rideTypes.map((row, idx) => (
                <RideTypeCard
                  key={idx}
                  row={row}
                  onChange={(p) => patchRideType(idx, p)}
                  onRemove={() => removeRideType(idx)}
                />
              ))
            )}
          </Box>
        </Section>

        {/* System */}
        <Section
          icon={<TuneRoundedIcon fontSize="small" />}
          title="System"
          subtitle="Operational endpoints and reviewer routing"
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.5,
            }}
          >
            <Field label="Admin base URL">
              {numberField(
                form.extra.admin_base_url ?? "",
                (v) => setExtra("admin_base_url", v),
                { placeholder: "https://api.example.com" },
              )}
            </Field>
            <Field label="KYC reviewer email">
              {numberField(
                form.extra.kyc_reviewer_email ?? "",
                (v) => setExtra("kyc_reviewer_email", v),
                { placeholder: "reviewer@example.com" },
              )}
            </Field>
          </Box>
        </Section>
      </Box>

      {/* Sticky action bar */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          mt: 3,
          mx: -0.5,
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border, rgba(255,255,255,0.1))",
          borderRadius: "14px",
          boxShadow: "0 -8px 24px rgba(0,0,0,0.35)",
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            color: isDirty
              ? "var(--accent-gold, #FFD700)"
              : "var(--text-secondary)",
            fontWeight: isDirty ? 600 : 400,
          }}
        >
          {isDirty ? "You have unsaved changes" : "All changes saved"}
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          {isDirty && (
            <Button
              onClick={discard}
              disabled={!!saving}
              sx={{
                textTransform: "none",
                fontSize: 13.5,
                fontWeight: 600,
                borderRadius: "10px",
                px: 2,
                height: 42,
                color: "var(--text-secondary)",
                "&:hover": {
                  color: "var(--text-primary)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                },
              }}
            >
              Discard
            </Button>
          )}
          <Button
            onClick={() => handleSave("continue")}
            disabled={!isDirty || !!saving}
            sx={{
              textTransform: "none",
              fontSize: 13.5,
              fontWeight: 600,
              borderRadius: "10px",
              px: 2.5,
              height: 42,
              color: "var(--text-primary)",
              border: "1px solid var(--border, rgba(255,255,255,0.15))",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.3)",
                backgroundColor: "rgba(255,255,255,0.03)",
              },
              "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
            }}
          >
            {saving === "continue" ? (
              <CircularProgress size={18} sx={{ color: "inherit" }} />
            ) : (
              "Save and continue"
            )}
          </Button>
          <Button
            onClick={() => handleSave("save")}
            disabled={!isDirty || !!saving}
            sx={{
              textTransform: "none",
              fontSize: 13.5,
              fontWeight: 700,
              borderRadius: "10px",
              px: 3,
              height: 42,
              backgroundColor: "var(--accent-gold, #FFD700)",
              color: "#000",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "var(--accent-gold, #FFD700)",
                boxShadow: "0 4px 12px rgba(255,215,0,0.25)",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.4)",
              },
            }}
          >
            {saving === "save" ? (
              <CircularProgress size={18} sx={{ color: "#000" }} />
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
