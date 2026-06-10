import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeModeProvider, useThemeMode } from "./theme/ThemeContext";
import { darkTheme, lightTheme } from "./theme/index";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import RidersPage from "./pages/RidersPage";
import DriversPage from "./pages/DriversPage";
import TripsPage from "./pages/TripsPage";
import CooperatePage from "./pages/CooperatePage";
import FleetPage from "./pages/FleetPage";
import PremiumPage from "./pages/PremiumPage";
import InspectionPage from "./pages/InspectionPage";
import TransactionsPage from "./pages/TransactionsPage";
import AdminRolesPage from "./pages/AdminRolesPage";
import NotificationsPage from "./pages/NotificationsPage";
import SOSPage from "./pages/SOSPage";
import SettingsPage from "./pages/SettingsPage";
import FeedbackPage from "./pages/FeedbackPage";
import DisputePage from "./pages/DisputePage";
import HelpPage from "./pages/HelpPage";

function ThemedApp() {
  const { mode } = useThemeMode();
  const muiTheme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/riders" element={<RidersPage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/cooperate" element={<CooperatePage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/inspection" element={<InspectionPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/admin-roles" element={<AdminRolesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/sos" element={<SOSPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/dispute" element={<DisputePage />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeModeProvider>
      <ThemedApp />
    </ThemeModeProvider>
  );
}
