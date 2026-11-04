import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useAnalyticsMe } from "../api";
import "../print.css";

export const ANALYTICS_TABS = [
  { path: "", label: "Executive", section: "executive" },
  { path: "riders", label: "Riders", section: "riders" },
  { path: "drivers", label: "Drivers", section: "drivers" },
  { path: "trips", label: "Trips", section: "trips" },
  { path: "finance", label: "Finance", section: "finance" },
  { path: "geography", label: "Geography", section: "geography" },
  { path: "operations", label: "Operations", section: "operations" },
  { path: "reports", label: "Reports", section: "reports" },
  { path: "access", label: "Access", section: "access" },
];

export default function AnalyticsLayout() {
  const { me, loading } = useAnalyticsMe();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Stack sx={{ alignItems: "center", py: 10 }}>
        <CircularProgress size={28} sx={{ color: "#FFBE18" }} />
      </Stack>
    );
  }

  if (!me)
    return (
      <Alert severity="warning">
        Analytics is not available. The backend on this environment does not
        have the analytics module yet, or your session has expired.
      </Alert>
    );

  if (!me.enabled)
    return (
      <Alert severity="info">
        Analytics is installed but switched off on this environment
        (ANALYTICS_ENABLED=false). Nothing is collected or served until it is
        enabled.
      </Alert>
    );

  const tabs = ANALYTICS_TABS.filter((tab) =>
    me.sections.includes(tab.section)
  );

  const current = location.pathname
    .replace(/^\/analytics\/?/, "")
    .split("/")[0];

  const activeTab =
    tabs.find((tab) => tab.path === current) ||
    (current === "records" ? null : tabs[0]);

  if (
    current === "" &&
    !me.sections.includes("executive") &&
    tabs[0]
  ) {
    return (
      <Navigate
        to={`/analytics/${tabs[0].path}${location.search}`}
        replace
      />
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
      }}
    >
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 21, sm: 25 },
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            Business Intelligence
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 12,
              color: "var(--text-muted, #8A92A6)",
            }}
          >
            Ride-hailing performance from live records · Lagos time
          </Typography>
        </Box>

        {/* Role Chip */}
        <Chip
          size="small"
          label={me.role_label || "Analytics"}
          variant="outlined"
          sx={{
            height: 30,
            px: 0.8,
            borderRadius: "8px",
            border: "1px solid rgba(255, 190, 24, 0.35)",
            backgroundColor: "rgba(255, 190, 24, 0.09)",
            color: "var(--accent-gold, #FFC107)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.02em",
            "& .MuiChip-label": {
              px: 1,
            },
          }}
        />
      </Stack>

      {/* Navigation Tabs */}
      <Box
        sx={{
          borderBottom: "1px solid var(--border)",
          "@media print": {
            display: "none",
          },
        }}
      >
        <Tabs
          value={activeTab ? activeTab.path : false}
          onChange={(_, path: string) =>
            navigate(`/analytics/${path}${location.search}`)
          }
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          textColor="inherit"
          slotProps={{
            indicator: {
              style: {
                background: "var(--accent-gold, #FFC107)",
                height: 2,
                borderRadius: "3px 3px 0 0",
              },
            },
          }}
          sx={{
            minHeight: 44,
            "& .MuiTab-root": {
              minHeight: 44,
              px: 2,
              textTransform: "none",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-muted, #8A92A6)",
              transition: "all 0.2s ease",
              "&:hover": {
                color: "var(--accent-gold, #FFC107)",
                // backgroundColor: "rgba(255, 190, 24, 0.04)",
              },
            },
            "& .Mui-selected": {
              color: "var(--accent-gold, #FFC107) !important",
              fontWeight: 700,
            },
            "& .MuiTabs-scrollButtons": {
              color: "var(--accent-gold, #FFC107)",
              "&.Mui-disabled": {
                opacity: 0.25,
              },
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.path}
              value={tab.path}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Box>

      <Outlet />
    </Box>
  );
}

export function Forbidden() {
  return (
    <Alert severity="warning">
      Your analytics role does not include this section.
    </Alert>
  );
}