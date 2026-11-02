import { lazy, Suspense, type ReactElement } from "react";
import { Route } from "react-router-dom";
import { CircularProgress, Stack } from "@mui/material";
import { useAnalyticsMe } from "./api";

// Analytics pages are code-split so the rest of the dashboard ships without them.
const AnalyticsLayout = lazy(() => import("./pages/AnalyticsLayout"));
const ExecutivePage = lazy(() => import("./pages/ExecutivePage"));
const RidersAnalyticsPage = lazy(() => import("./pages/RidersAnalyticsPage"));
const DriversAnalyticsPage = lazy(() => import("./pages/DriversAnalyticsPage"));
const TripsAnalyticsPage = lazy(() => import("./pages/TripsAnalyticsPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const GeographyPage = lazy(() => import("./pages/GeographyPage"));
const OperationsPage = lazy(() => import("./pages/OperationsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const ReportView = lazy(() => import("./pages/ReportsPage").then((module) => ({ default: module.ReportView })));
const AccessPage = lazy(() => import("./pages/AccessPage"));
const RecordsPage = lazy(() => import("./pages/RecordsPage"));

function Spinner() {
  return (
    <Stack sx={{ alignItems: "center", py: 8 }}>
      <CircularProgress size={26} />
    </Stack>
  );
}

function Guard({ section, children }: { section?: string; children: ReactElement }) {
  const { me } = useAnalyticsMe();
  if (!me) return null;
  if (section && !me.sections.includes(section)) return <Stack sx={{ py: 2, color: "var(--text-secondary)" }}>Your analytics role does not include this section.</Stack>;
  return <Suspense fallback={<Spinner />}>{children}</Suspense>;
}

export const analyticsRoutes = (
  <Route
    path="analytics"
    element={
      <Suspense fallback={<Spinner />}>
        <AnalyticsLayout />
      </Suspense>
    }
  >
    <Route index element={<Guard section="executive"><ExecutivePage /></Guard>} />
    <Route path="riders" element={<Guard section="riders"><RidersAnalyticsPage /></Guard>} />
    <Route path="drivers" element={<Guard section="drivers"><DriversAnalyticsPage /></Guard>} />
    <Route path="trips" element={<Guard section="trips"><TripsAnalyticsPage /></Guard>} />
    <Route path="finance" element={<Guard section="finance"><FinancePage /></Guard>} />
    <Route path="geography" element={<Guard section="geography"><GeographyPage /></Guard>} />
    <Route path="operations" element={<Guard section="operations"><OperationsPage /></Guard>} />
    <Route path="reports" element={<Guard><ReportsPage /></Guard>} />
    <Route path="reports/:key" element={<Guard><ReportView /></Guard>} />
    <Route path="access" element={<Guard section="access"><AccessPage /></Guard>} />
    <Route path="records/:kind" element={<Guard><RecordsPage /></Guard>} />
  </Route>
);
