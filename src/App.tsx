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
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import AddNewRider from "./pages/AddNewRider";

function ThemedApp() {
  const { mode } = useThemeMode();
  const muiTheme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
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
      <Route path="/riders/new" element={<AddNewRider />} />
      <Route path="drivers" element={<DriversPage />} />
      <Route path="trips" element={<TripsPage />} />
      <Route path="cooperate" element={<CooperatePage />} />
      <Route path="fleet" element={<FleetPage />} />
      <Route path="premium" element={<PremiumPage />} />
      <Route path="inspection" element={<InspectionPage />} />
      <Route path="transactions" element={<TransactionsPage />} />
      <Route path="admin-roles" element={<AdminRolesPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="sos" element={<SOSPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="feedback" element={<FeedbackPage />} />
      <Route path="dispute" element={<DisputePage />} />
      <Route path="help" element={<HelpPage />} />
    </Route>
  </Routes>
</BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeModeProvider>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        // theme="dark"
      />

      <ThemedApp />
    </ThemeModeProvider>
  );
}
