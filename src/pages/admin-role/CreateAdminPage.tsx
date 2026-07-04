import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AdminRoleForm from "../../components/admin-role/AdminForm";

export default function CreateAdminRolePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      className="fade-in"
      sx={{
        p: { xs: 1, md: 2 },
        display: "flex",
        flexDirection: "column",
        gap: 3.5,
      }}
    >
      {/* ── Top Navigation / Back Button ── */}
      <Box>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate("/admin-role")}
          sx={{
            color: "var(--text-muted)",
            textTransform: "none",
            fontWeight: 500,
            fontSize: 13.5,
            mb: 2,
            p: 0,
            "&:hover": {
              color: "var(--accent-gold, #FFC107)",
              backgroundColor: "transparent",
            },
          }}
        >
          Back
        </Button>
      </Box>
      <Box
        sx={{
          maxWidth: { md: "90%" },
          width: "100%",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          {/* Decorative Shield Icon Badge */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              backgroundColor: isDark
                ? "rgba(245,197,24,0.1)"
                : "rgba(245,197,24,0.15)",
              border: "1px solid rgba(245,197,24,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AdminPanelSettingsIcon
              sx={{ fontSize: 24, color: "var(--accent-gold, #FFC107)" }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: { xs: 18, md: 24 },
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              Create Admin Role
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                color: "var(--text-muted)",
                mt: 0.5,
                lineHeight: 1.4,
              }}
            >
              Onboard a new team member by setting their identity, operational
              scope, and system permissions.
            </Typography>
          </Box>
        </Box>
        {/* ── Form Component ── */}
        <AdminRoleForm onSuccess={() => navigate("/admin-role")} />
      </Box>
    </Box>
  );
}
