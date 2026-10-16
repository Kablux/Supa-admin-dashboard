
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DiscountRoundedIcon from "@mui/icons-material/DiscountRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";

import { Promotion } from "../../types/common.types";

interface ViewPromotionModalProps {
  open: boolean;
  promo: Promotion | null;
  onClose: () => void;
  onEdit?: (promo: Promotion) => void;
}

const GOLD = "var(--accent-gold, #FFC107)";
const MUTED = "var(--text-muted, #8A92A6)";
const PRIMARY = "var(--text-primary, #F5F5F5)";
const SECONDARY = "var(--text-secondary, #C1C7D0)";
const BORDER = "var(--border, rgba(255,255,255,0.08))";
const CARD = "var(--bg-secondary, #161B26)";

const detailItems = (
  promo: Promotion,
  discountDisplay: string,
  formatDate: (date: string | null) => string
) => [
  {
    label: "Discount Value",
    value: discountDisplay,
    icon: <DiscountRoundedIcon />,
    highlight: true,
  },

  {
    label: "Max Eligible Amount",
    value: promo.max_eligible_amount
      ? Number(promo.max_eligible_amount).toLocaleString()
      : "No Max Limit",
    icon: <PaymentsRoundedIcon />,
  },
  {
    label: "Priority Score",
    value: promo.priority ?? "Normal",
    icon: <FlagRoundedIcon />,
  },
  {
    label: "Start Date",
    value: formatDate(promo.start_date),
    icon: <CalendarMonthRoundedIcon />,
  },
  {
    label: "End Date",
    value: formatDate(promo.end_date),
    icon: <EventAvailableRoundedIcon />,
  },
];

export default function ViewPromotionModal({
  open,
  promo,
  onClose,
  onEdit,
}: ViewPromotionModalProps) {
  if (!promo) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No expiration date";

    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const discountDisplay =
    promo.discount_type === "PERCENTAGE"
      ? `${Number(promo.discount_value)}% OFF`
      : `$${Number(promo.discount_value).toFixed(2)} OFF`;

  const details = detailItems(promo, discountDisplay, formatDate);

  const handleCopyCode = async () => {
    if (!promo.code || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(promo.code);
    } catch (error) {
      console.error("Failed to copy promotion code:", error);
    }
  };

  const metricCardSx = {
    minWidth: 0,
    p: { xs: 1.75, sm: 2.25 },
    borderRadius: "8px",
    backgroundColor: CARD,
    border: `1px solid ${BORDER}`,
    transition: "border-color 180ms ease, transform 180ms ease",
    "&:hover": {
      borderColor: "rgba(255,193,7,0.25)",
      transform: "translateY(-2px)",
    },
  };

  const detailCardSx = {
    minWidth: 0,
    p: 2,
    borderRadius: "12px",
    border: `1px solid ${BORDER}`,
    backgroundColor: "rgba(255,255,255,0.018)",
    transition: "background-color 180ms ease, border-color 180ms ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.035)",
      borderColor: "rgba(255,193,7,0.22)",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="view-promotion-title"
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxHeight: "min(90vh, 900px)",
          m: { xs: 1, sm: 2 },
          borderRadius: { xs: "16px", sm: "20px" },
          overflow: "hidden",
          color: PRIMARY,
          backgroundColor: "var(--bg-card, #11141D)",
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(255,193,7,0.055), transparent 42%)",
          border: `1px solid ${BORDER}`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.75, minWidth: 0 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: "8px",
              color: GOLD,
              background:
                "linear-gradient(135deg, rgba(255,193,7,0.18), rgba(255,193,7,0.05))",
              border: "1px solid rgba(255,193,7,0.22)",
            }}
          >
            <LocalOfferRoundedIcon sx={{ fontSize: 18 }} />
          </Box>

          <Box sx={{ minWidth: 0, pt: 0.25 }}>
            <Typography
              id="view-promotion-title"
              component="h2"
              sx={{
                color: PRIMARY,
                fontSize: { xs: "14px", sm: "18px" },
                fontWeight: 700,
                lineHeight: 1.35,
                overflowWrap: "anywhere",
              }}
            >
              {promo.name}
            </Typography>

            <Typography
              sx={{
                color: MUTED,
                fontSize: "12px",
                mt: 0.5,
                mb: 1.25,
              }}
            >
              Promotion details and performance
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={
                  <ConfirmationNumberRoundedIcon
                    sx={{ fontSize: "14px !important" }}
                  />
                }
                label={promo.code || "Automatic no code"}
                size="small"
                sx={{
                  // height: 27,
                  maxWidth: "100%",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: promo.code ? GOLD : 'var(--text-secondary, #8A92A6)',
                  backgroundColor: "rgba(255,193,7,0.07)",
                  border: "1px solid rgba(255,193,7,0.18)",
                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />

              {promo.code && (
                <Tooltip title="Copy promotion code">
                  <IconButton
                    size="small"
                    aria-label="Copy promotion code"
                    onClick={handleCopyCode}
                    sx={{
                      width: 24,
                      height: 24,
                      color: MUTED,
                      border: `1px solid ${BORDER}`,
                      "&:hover": {
                        color: GOLD,
                        backgroundColor: "rgba(255,193,7,0.08)",
                      },
                    }}
                  >
                    <ContentCopyRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              )}

              <Chip
                icon={
                  promo.is_active ? (
                    <CheckCircleRoundedIcon
                      sx={{ fontSize: "14px !important" }}
                    />
                  ) : (
                    <ScheduleRoundedIcon
                      sx={{ fontSize: "14px !important" }}
                    />
                  )
                }
                label={promo.is_active ? "Active" : "Inactive"}
                size="small"
                sx={{
                  height: 24,
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: promo.status==="active" ? "#34D399" : "#F87171",
                  backgroundColor: promo.is_active
                    ? "rgba(16,185,129,0.09)"
                    : "rgba(239,68,68,0.09)",
                  border: `1px solid ${
                    promo.is_active
                      ? "rgba(16,185,129,0.22)"
                      : "rgba(239,68,68,0.22)"
                  }`,
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Tooltip title="Close">
          <IconButton
            onClick={onClose}
            aria-label="Close promotion details"
            size="small"
            sx={{
              flexShrink: 0,
              color: MUTED,
              border: `1px solid ${BORDER}`,
              borderRadius: "8px",
              "&:hover": {
                color: PRIMARY,
                backgroundColor: "rgba(255,255,255,0.07)",
              },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <Divider sx={{ borderColor: BORDER }} />

      <DialogContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Performance overview */}
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1.5,
            }}
          >
            {/* Redemptions */}
            <Box sx={metricCardSx}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "4px",
                    display: "grid",
                    placeItems: "center",
                    color: "#60A5FA",
                    backgroundColor: "rgba(59,130,246,0.12)",
                  }}
                >
                  <ShowChartRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  REDEMPTIONS
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "18px" },
                  fontWeight: 700,
                  color: PRIMARY,
                  lineHeight: 1.2,
                  overflowWrap: "anywhere",
                }}
              >
                {Number(promo.redemption_count ?? 0).toLocaleString()}
              </Typography>

              <Typography sx={{ fontSize: "12px", color: MUTED, mt: 0.75 }}>
                of {promo.max_redemptions
                  ? Number(promo.max_redemptions).toLocaleString()
                  : "Unlimited"}{" "}
                allowed
              </Typography>
            </Box>

            {/* Unique redeemers */}
            <Box sx={metricCardSx}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "4px",
                    display: "grid",
                    placeItems: "center",
                    color: "#A78BFA",
                    backgroundColor: "rgba(139,92,246,0.12)",
                  }}
                >
                  <GroupsRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Typography
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  UNIQUE REDEEMERS
                </Typography>
              </Box>

               <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "18px" },
                  fontWeight: 700,
                  color: PRIMARY,
                  lineHeight: 1.2,
                  overflowWrap: "anywhere",
                }}
              >
                {Number(promo.unique_redeemer_count ?? 0).toLocaleString()}
              </Typography>

              <Typography sx={{ fontSize: "12px", color: MUTED, mt: 0.75 }}>
                Unique customers
              </Typography>
            </Box>

            {/* Total discount */}
            <Box sx={metricCardSx}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "4px",
                    display: "grid",
                    placeItems: "center",
                    color: GOLD,
                    backgroundColor: "rgba(255,193,7,0.12)",
                  }}
                >
                  <PaymentsRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Typography
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  TOTAL DISCOUNT GIVEN
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "18px" },
                  fontWeight: 700,
                  color: GOLD,
                  lineHeight: 1.2,
                  overflowWrap: "anywhere",
                }}
              >
                ₦
                {Math.abs(
                  Number(promo.total_discount_given || 0)
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>

              <Typography sx={{ fontSize: "12px", color: MUTED, mt: 0.75 }}>
                Total value discounted
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        {promo.description && (
          <Box
            sx={{
              px: 2,
              py: 1.75,
              borderRadius: "8px",
              border: `1px solid ${BORDER}`,
              backgroundColor: "rgba(255,255,255,0.018)",
            }}
          >
            <Typography
              sx={{
                color: MUTED,
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "1px",
                mb: 1,
              }}
            >
              Description
            </Typography>

            <Typography
              sx={{
                color: SECONDARY,
                fontSize: "13px",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {promo.description}
            </Typography>
          </Box>
        )}

        {/* Details */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.75,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "grid",
                placeItems: "center",
                borderRadius: "8px",
                color: GOLD,
                backgroundColor: "rgba(255,193,7,0.09)",
              }}
            >
              <LocalOfferRoundedIcon sx={{ fontSize: 14 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: PRIMARY,
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Promotion configuration
              </Typography>
              <Typography sx={{ color: MUTED, fontSize: "12px", mt: 0.25 }}>
                Rules, eligibility and validity period
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1.5,
            }}
          >
            {details.map((item) => (
              <Box key={item.label} sx={detailCardSx}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                    color: MUTED,
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      placeItems: "center",
                      "& svg": { fontSize: 17 },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: item.highlight ? 400 : 500,
                    color: item.highlight ? GOLD : PRIMARY,
                    // textTransform: item.capitalize ? "capitalize" : "none",
                    // lineHeight: 1.6,
                    overflowWrap: "anywhere",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Audit timestamps */}
        <Box
          sx={{
            px: 2,
            py: 1.75,
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.018)",
            border: `1px solid ${BORDER}`,
          }}
        >
          <Typography
            sx={{
              color: MUTED,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1px",
              mb: 1.5,
            }}
          >
            RECORD HISTORY
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
              <CalendarMonthRoundedIcon
                sx={{ fontSize: 16, color: MUTED, mt: 0.2 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: "11px", color: MUTED, mb: 0.5 }}>
                  Created on
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: SECONDARY,
                    overflowWrap: "anywhere",
                  }}
                >
                  {formatDate(promo.created_at)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
              <AccessTimeRoundedIcon
                sx={{ fontSize: 16, color: MUTED, mt: 0.2 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: "11px", color: MUTED, mb: 0.5 }}>
                  Last updated
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: SECONDARY,
                    overflowWrap: "anywhere",
                  }}
                >
                  {formatDate(promo.updated_at)}
                </Typography>
              </Box>
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
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.08)",
        }}
      >
        {onEdit && (
          <Button
            onClick={() => {
              onClose();
              onEdit(promo);
            }}
            startIcon={<EditRoundedIcon />}
            variant="outlined"
            sx={{
              minHeight: 42,
              px: 2,
              borderRadius: "10px",
              borderColor: BORDER,
              color: PRIMARY,
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                borderColor: GOLD,
                color: GOLD,
                backgroundColor: "rgba(255,193,7,0.05)",
              },
            }}
          >
            Edit Promotion
          </Button>
        )}

        <Button
          onClick={onClose}
          variant="contained"
          startIcon={<CheckCircleRoundedIcon />}
          sx={{
            minHeight: 42,
            px: 2.5,
            borderRadius: "10px",
            backgroundColor: GOLD,
            color: "#111",
            fontSize: "12px",
            fontWeight: 750,
            textTransform: "none",
            boxShadow: "0 4px 14px rgba(255,193,7,0.12)",
            "&:hover": {
              backgroundColor: "#E6AC00",
              boxShadow: "0 6px 18px rgba(255,193,7,0.2)",
            },
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}