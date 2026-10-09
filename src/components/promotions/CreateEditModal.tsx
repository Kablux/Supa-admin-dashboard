
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  CircularProgress,
  IconButton,
  Divider,
  InputAdornment,
  Chip,
} from "@mui/material";

import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ToggleOnRoundedIcon from "@mui/icons-material/ToggleOnRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import {
  Promotion,
  CreatePromotionPayload,
} from "../../types/common.types";

interface ModalProps {
  open: boolean;
  editingPromo: Promotion | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePromotionPayload) => void;
}

const GOLD = "var(--accent-gold, #FFC107)";
const MUTED = "var(--text-muted, #8A92A6)";
const PRIMARY = "var(--text-primary, #FFFFFF)";
const BORDER = "var(--border, rgba(255,255,255,0.09))";
const CARD = "var(--bg-secondary, #161B26)";

const getInitialFormData = (): CreatePromotionPayload => ({
  name: "",
  code: "",
  description: "",
  applies_to: "ride.ride",
  discount_type: "PERCENTAGE",
  discount_value: "",
  max_eligible_amount: "",
  priority: 1,
  is_active: true,
  start_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16),
  end_date: new Date(
    Date.now() + 86400000 * 7 -
      new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16),
  max_redemptions: 100,
  is_clickable: false,
  cta_type: "NONE",
  cta_value: "",
});

const fieldSx = {
  "& .MuiInputLabel-root": {
    color: MUTED,
    fontSize: 13,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: GOLD,
  },
  "& .MuiOutlinedInput-root": {
    color: PRIMARY,
    backgroundColor: CARD,
    borderRadius: "10px",
    fontSize: 13,
    transition: "all 180ms ease",
    "& fieldset": {
      borderColor: BORDER,
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,193,7,0.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: GOLD,
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input": {
    py: 1.5,
  },
  "& .MuiInputBase-input::placeholder": {
    color: MUTED,
    opacity: 0.7,
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: MUTED,
  },
  "& .MuiSvgIcon-root": {
    color: MUTED,
  },
  "& .MuiFormHelperText-root": {
    mx: 0,
    fontSize: 11,
  },
};

const selectSx = {
  ...fieldSx,
  "& .MuiSelect-select": {
    py: 1.5,
  },
};

const sectionTitleSx = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.7px",
  color: PRIMARY,
};

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          color: GOLD,
          borderRadius: "11px",
          backgroundColor: "rgba(255,193,7,0.09)",
          border: "1px solid rgba(255,193,7,0.12)",
          "& svg": { fontSize: 20 },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography sx={sectionTitleSx}>{title}</Typography>
        <Typography
          sx={{ color: MUTED, fontSize: 11, mt: 0.4, lineHeight: 1.5 }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CreateEditPromotionModal({
  open,
  editingPromo,
  saving,
  onClose,
  onSubmit,
}: ModalProps) {
  const [formData, setFormData] =
    useState<CreatePromotionPayload>(getInitialFormData);

  useEffect(() => {
    if (!open) return;

    if (editingPromo) {
      setFormData({
        name: editingPromo.name || "",
        code: editingPromo.code || "",
        description: editingPromo.description || "",
        applies_to: editingPromo.applies_to || "ride.ride",
        discount_type: editingPromo.discount_type || "PERCENTAGE",
        discount_value: editingPromo.discount_value ?? "",
        max_eligible_amount: editingPromo.max_eligible_amount ?? "",
        priority: editingPromo.priority ?? 1,
        is_active: editingPromo.is_active ?? true,
        start_date: editingPromo.start_date
          ? new Date(
              new Date(editingPromo.start_date).getTime() -
                new Date(editingPromo.start_date).getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16)
          : "",
        end_date: editingPromo.end_date
          ? new Date(
              new Date(editingPromo.end_date).getTime() -
                new Date(editingPromo.end_date).getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16)
          : "",
        max_redemptions: editingPromo.max_redemptions ?? 100,
        is_clickable: editingPromo.is_clickable ?? false,
        cta_type: editingPromo.cta_type || "NONE",
        cta_value: editingPromo.cta_value || "",
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [editingPromo, open]);

  const updateField = <K extends keyof CreatePromotionPayload>(
    field: K,
    value: CreatePromotionPayload[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (
    !formData.start_date ||
    !formData.end_date ||
    new Date(formData.end_date) <= new Date(formData.start_date)
  ) {
    return;
  }

  const payload: CreatePromotionPayload = {
    ...formData,
    discount_value: Number(formData.discount_value),
    max_eligible_amount:
      formData.max_eligible_amount !== "" &&
      formData.max_eligible_amount != null
        ? Number(formData.max_eligible_amount)
        : undefined,
    max_redemptions:
      formData.max_redemptions != null
        ? Number(formData.max_redemptions)
        : undefined,
    start_date: new Date(formData.start_date).toISOString(),
    end_date: new Date(formData.end_date).toISOString(),
  };

  onSubmit(payload);
};

  const datesInvalid =
    Boolean(formData.start_date && formData.end_date) &&
    new Date(formData.end_date) <= new Date(formData.start_date);

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
     maxWidth="md"
           fullWidth
           scroll="paper"
           aria-labelledby="view-promotion-title"
           sx={{
             "& .MuiDialog-paper": {
               width: "100%",
               maxHeight: "min(90vh, 900px)",
                m: { xs: 1, sm: 2 },
                // borderRadius: { xs: "16px", sm: "20px" },
                overflowY: "hidden",
                overflowX: "hidden",
               color: PRIMARY,
               backgroundColor: "var(--bg-card, #11141D)",
               backgroundImage:
                 "radial-gradient(ellipse at top right, rgba(255,193,7,0.055), transparent 42%)",
               border: `1px solid ${BORDER}`,
             },
           }}
         >
      {/* Header */}
      <DialogTitle
        sx={{
          px: { xs: 2, sm: 3 },
          pt: 2.75,
          pb: 2.5,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.75 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: "14px",
              color: GOLD,
              background:
                "linear-gradient(135deg, rgba(255,193,7,0.17), rgba(255,193,7,0.04))",
              border: "1px solid rgba(255,193,7,0.2)",
            }}
          >
            <LocalOfferRoundedIcon sx={{ fontSize: 25 }} />
          </Box>

          <Box>
            <Typography
              id="promotion-modal-title"
              sx={{
                fontSize: { xs: 18, sm: 21 },
                fontWeight: 750,
                color: PRIMARY,
                lineHeight: 1.4,
              }}
            >
              {editingPromo ? "Edit Promotion" : "Create New Promotion"}
            </Typography>

            <Typography
              sx={{
                color: MUTED,
                fontSize: 12,
                fontWeight: 400,
                mt: 0.5,
                lineHeight: 1.7,
              }}
            >
              {editingPromo
                ? "Update your promotion details and settings."
                : "Configure a new offer for your riders."}
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          disabled={saving}
          aria-label="Close promotion form"
          size="small"
          sx={{
            flexShrink: 0,
            color: MUTED,
            border: `1px solid ${BORDER}`,
            borderRadius: "10px",
            "&:hover": {
              color: PRIMARY,
              backgroundColor: "rgba(255,255,255,0.06)",
            },
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: BORDER }} />

      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 3,
            overflowY: "auto",
             maxHeight: "min(60vh, 900px)",
          }}
        >
          {/* Basic information */}
          <Box>
            <SectionHeading
              icon={<DescriptionRoundedIcon />}
              title="Basic Information"
              subtitle="Give your promotion a name and recognizable code."
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                label="Promotion Name"
                placeholder="e.g. Weekend Special"
                required
                fullWidth
                size="small"
                sx={fieldSx}
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                // inputProps={{ maxLength: 120 }}
              />

              <TextField
                label="Promo Code"
                placeholder="e.g. WEEKEND20"
                required
                fullWidth
                size="small"
                sx={fieldSx}
                value={formData.code}
                onChange={(e) =>
                  updateField("code", e.target.value.toUpperCase())
                }
                // inputProps={{ maxLength: 50 }}
               slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <ConfirmationNumberRoundedIcon
                                  sx={{ fontSize: 18, color: MUTED }}
                                />
                              </InputAdornment>
                            ),
                          },
                        }}
              />
            </Box>

            <TextField
              label="Description"
              placeholder="Describe the promotion and who it is for..."
              multiline
              rows={3}
              fullWidth
              size="small"
              sx={{ ...fieldSx, mt: 2 }}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </Box>

          {/* Discount configuration */}
          <Box>
            <SectionHeading
              icon={<DiscountRoundedIcon />}
              title="Discount Configuration"
              subtitle="Set the discount type, value, and redemption limits."
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <FormControl fullWidth size="small" sx={selectSx}>
                <Typography
                  component="label"
                  sx={{ color: MUTED, fontSize: 12, mb: 0.75 }}
                >
                  Discount Type
                </Typography>

                <Select
                  value={formData.discount_type}
                  onChange={(e) =>
                    updateField(
                      "discount_type",
                      e.target.value as "FIXED" | "PERCENTAGE"
                    )
                  }
                  inputProps={{ "aria-label": "Discount type" }}
                >
                  <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
                  <MenuItem value="FIXED">Fixed Amount</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label={
                  formData.discount_type === "PERCENTAGE"
                    ? "Discount Value (%)"
                    : "Discount Value"
                }
                type="number"
                required
                fullWidth
                size="small"
                sx={fieldSx}
                value={formData.discount_value}
                onChange={(e) =>
                  updateField("discount_value", e.target.value)
                }
                slotProps={{
                  htmlInput: {
                  min: 0,
                  ...(formData.discount_type === "PERCENTAGE"
                    ? { max: 100, step: "0.01" }
                    : { step: "0.01" }),
                },
                input:{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography sx={{ color: MUTED, fontSize: 12 }}>
                        {formData.discount_type === "PERCENTAGE" ? "%" : "Amount"}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              }
              />

              <TextField
                label="Maximum Eligible Amount"
                placeholder="Leave empty for no limit"
                type="number"
                fullWidth
                size="small"
                sx={fieldSx}
                value={formData.max_eligible_amount}
                onChange={(e) =>
                  updateField("max_eligible_amount", e.target.value)
                }
                slotProps={{
                   htmlInput: { min: 0, step: "0.01" }
                   }}
                helperText="Optional cap on the eligible amount."
              />

              <TextField
                label="Maximum Redemptions"
                type="number"
                fullWidth
                size="small"
                sx={fieldSx}
                value={formData.max_redemptions ?? ""}
                onChange={(e) => {
                 const value = e.target.value;
                updateField(
                  "max_redemptions",
                  value === "" ? undefined : Number(value)
                );
              }}
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
              helperText="Maximum number of uses allowed."
              />
            </Box>
          </Box>

          {/* Schedule */}
          <Box>
            <SectionHeading
              icon={<CalendarMonthRoundedIcon />}
              title="Schedule & Priority"
              subtitle="Choose when the promotion starts and ends."
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                label="Start Date"
                type="datetime-local"
                required
                fullWidth
                size="small"
                sx={fieldSx}
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.start_date}
                onChange={(e) => updateField("start_date", e.target.value)}
              />

              <TextField
                label="End Date"
                type="datetime-local"
                required
                fullWidth
                size="small"
                sx={fieldSx}
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.end_date}
                onChange={(e) => updateField("end_date", e.target.value)}
                error={datesInvalid}
                helperText={
                  datesInvalid ? "End date must be after the start date." : " "
                }
              />

              <TextField
                label="Priority"
                type="number"
                fullWidth
                size="small"
                sx={fieldSx}
                value={formData.priority}
                onChange={(e) =>
                  updateField(
                    "priority",
                    e.target.value === "" ? 1 : Number(e.target.value)
                  )
                }
                slotProps={{
                  htmlInput: {min: 1, step: 1 }
                    }}
                helperText="Higher priority can affect promotion ordering."
              />
            </Box>
          </Box>

          {/* Availability */}
          <Box>
            <SectionHeading
              icon={<SettingsSuggestRoundedIcon />}
              title="Availability & Status"
              subtitle="Control whether the promotion can be used."
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  p: 2,
                  borderRadius: "12px",
                  border: `1px solid ${BORDER}`,
                  backgroundColor: CARD,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ color: GOLD, display: "flex" }}>
                    <ToggleOnRoundedIcon sx={{ fontSize: 23 }} />
                  </Box>

                  <Box>
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 600, color: PRIMARY }}
                    >
                      Promotion Status
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: MUTED, mt: 0.4 }}>
                      Enable or disable this promotion.
                    </Typography>
                  </Box>
                </Box>

                <FormControlLabel
                  sx={{ m: 0 }}
                  label={
                    <Chip
                      size="small"
                      label={formData.is_active ? "Active" : "Inactive"}
                      sx={{
                        height: 25,
                        fontSize: 10,
                        fontWeight: 700,
                        color: formData.is_active ? "#34D399" : MUTED,
                        backgroundColor: formData.is_active
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(255,255,255,0.05)",
                      }}
                    />
                  }
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={(e) =>
                        updateField("is_active", e.target.checked)
                      }
                      sx={{
                        mr: 0.5,
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: GOLD,
                          "& + .MuiSwitch-track": {
                            backgroundColor: GOLD,
                            opacity: 0.55,
                          },
                        },
                      }}
                    />
                  }
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* Footer */}
        <Divider sx={{ borderColor: BORDER }} />

        <DialogActions
          sx={{
            p: { xs: 2, sm: 2.5 },
            px: { xs: 2, sm: 3 },
            gap: 1.25,
            flexWrap: "wrap",
            justifyContent: "space-between",
            backgroundColor: "rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: 11,
              color: MUTED,
            }}
          >
            <CheckCircleRoundedIcon
              sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }}
            />
            {editingPromo ? "Changes will update this promotion." : "Review before saving."}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
            <Button
              onClick={onClose}
              disabled={saving}
              sx={{
                minHeight: 42,
                px: 2,
                borderRadius: "10px",
                color: MUTED,
                fontSize: 12,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  color: PRIMARY,
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving || datesInvalid}
              startIcon={
                saving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveRoundedIcon />
                )
              }
              sx={{
                minHeight: 42,
                minWidth: 145,
                px: 2.25,
                borderRadius: "10px",
                backgroundColor: GOLD,
                color: "#111",
                fontSize: 12,
                fontWeight: 750,
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(255,193,7,0.12)",
                "&:hover": {
                  backgroundColor: "#E6AC00",
                  boxShadow: "0 6px 18px rgba(255,193,7,0.18)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(255,193,7,0.35)",
                  color: "rgba(0,0,0,0.55)",
                },
              }}
            >
              {saving
                ? "Saving..."
                : editingPromo
                  ? "Save Changes"
                  : "Create Promotion"}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}