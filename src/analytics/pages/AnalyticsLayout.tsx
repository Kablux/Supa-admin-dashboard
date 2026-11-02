import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Chip, CircularProgress, Stack, Tab, Tabs, Typography } from "@mui/material";
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
        <CircularProgress size={28} />
      </Stack>
    );
  }
  if (!me) return <Alert severity="warning">Analytics is not available. The backend on this environment does not have the analytics module yet, or your session has expired.</Alert>;
  if (!me.enabled) return <Alert severity="info">Analytics is installed but switched off on this environment (ANALYTICS_ENABLED=false). Nothing is collected or served until it is enabled.</Alert>;

  const tabs = ANALYTICS_TABS.filter((tab) => me.sections.includes(tab.section));
  const current = location.pathname.replace(/^\/analytics\/?/, "").split("/")[0];
  const activeTab = tabs.find((tab) => tab.path === current) || (current === "records" ? null : tabs[0]);
  if (current === "" && !me.sections.includes("executive") && tabs[0]) return <Navigate to={`/analytics/${tabs[0].path}${location.search}`} replace />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Business intelligence</Typography>
          <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>Ride-hailing performance from live records · Lagos time</Typography>
        </Box>
        <Chip size="small" label={me.role_label || "Analytics"} variant="outlined" sx={{ borderColor: "var(--border)", color: "var(--text-secondary)" }} />
      </Stack>
      <Box sx={{ borderBottom: "1px solid var(--border)", "@media print": { display: "none" } }}>
        <Tabs
          value={activeTab ? activeTab.path : false}
          onChange={(_, path: string) => navigate(`/analytics/${path}${location.search}`)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="inherit"
          slotProps={{ indicator: { style: { background: "var(--accent-gold)" } } }}
          sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontSize: 14, color: "var(--text-secondary)" }, "& .Mui-selected": { color: "var(--text-primary) !important", fontWeight: 600 } }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.path} value={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      <Outlet />
    </Box>
  );
}

export function Forbidden() {
  return <Alert severity="warning">Your analytics role does not include this section.</Alert>;
}
