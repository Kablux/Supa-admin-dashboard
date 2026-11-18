import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, CircularProgress } from "@mui/material";
import { Toaster } from "react-hot-toast";

import { ThemeModeProvider, useThemeMode } from "./theme/ThemeContext";
import { darkTheme, lightTheme } from "./theme/index";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SessionTimeoutManager from "./components/auth/SessionTimeoutManager";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { analyticsRoutes } from "./analytics/routes";

// Lazy-loaded route pages
const RidersPage = lazy(() => import("./pages/RidersPage"));
const DriversPage = lazy(() => import("./pages/DriversPage"));
const TripsPage = lazy(() => import("./pages/TripsPage"));
const FleetPage = lazy(() => import("./pages/FleetPage"));
const PremiumPage = lazy(() => import("./pages/PremiumPage"));
const InspectionPage = lazy(() => import("./pages/InspectionPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const AdminRolesPage = lazy(() => import("./pages/admin-role/AdminRolesPage"));
const CreateAdminRolePage = lazy(() => import("./pages/admin-role/CreateAdminPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const SOSPage = lazy(() => import("./pages/SOSPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const DisputePage = lazy(() => import("./pages/DisputePage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const CorporatePage = lazy(() => import("./pages/CorporatePage"));
const RideRequestPage = lazy(() => import("./pages/RideRequest"));
const ReferralsPage = lazy(() => import("./pages/ReferralsPage"));
const CourierPage = lazy(() => import("./pages/CourierPage"));
const BannersPage = lazy(() => import("./pages/BannerPage"));
const CampaignPage = lazy(() => import("./pages/CampaignPage"));

function PageLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        width: "100%",
      }}
    >
      <CircularProgress size={28} sx={{ color: "var(--accent-gold, #FEB914)" }} />
    </Box>
  );
}

function ThemedApp() {
  const { mode } = useThemeMode();
  const muiTheme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <SessionTimeoutManager />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="riders" element={<RidersPage />} />
              <Route path="drivers" element={<DriversPage />} />
              <Route path="promo-banner" element={<BannersPage />} />
              <Route path="campaign" element={<CampaignPage />} />
              <Route path="courier" element={<CourierPage />} />
              <Route path="trips" element={<TripsPage />} />
              <Route path="ride-request" element={<RideRequestPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
              <Route path="corporate" element={<CorporatePage />} />
              <Route path="fleet" element={<FleetPage />} />
              <Route path="premium" element={<PremiumPage />} />
              <Route path="inspection" element={<InspectionPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="admin-role">
                <Route index element={<AdminRolesPage />} />
                <Route path="create" element={<CreateAdminRolePage />} />
              </Route>
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="sos" element={<SOSPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
              <Route path="dispute" element={<DisputePage />} />
              <Route path="help" element={<HelpPage />} />
              {analyticsRoutes}
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeModeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            border: "1px solid #010e14",
            padding: "8px",
            color: "#010e14",
            fontSize: "14px",
            width: "100%",
            maxWidth: "fit-content",
          },
        }}
      />
      <ThemedApp />
    </ThemeModeProvider>
  );
}