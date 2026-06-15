import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";
import Header from "./Header";

const PATH_TO_ID: Record<string, string> = {
  "/": "dashboard",
  "/riders": "rider",
  "/drivers": "driver",
  "/trips": "trip",
  "/cooperate": "cooperate",
  "/fleet": "fleet",
  "/premium": "premium",
  "/inspection": "inspection",
  "/transactions": "transaction",
  "/admin-roles": "admin_role",
  "/notifications": "notification",
  "/sos": "sos",
  "/settings": "setting",
  "/feedback": "feedback",
  "/dispute": "dispute",
  "/help": "help",
};

export default function DashboardLayout() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(
    PATH_TO_ID[location.pathname] || "dashboard",
  );

  useEffect(() => {
    const id = PATH_TO_ID[location.pathname];
    if (id) setActiveNav(id);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        transition: "background-color 0.25s ease",
      }}
    >
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <Box
        component="main"
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0,
          backgroundColor: "var(--bg-primary)",
          transition: "background-color 0.25s ease",
        }}
      >
        <Header />
        <Box
          sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: "auto" }}
          component="main"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
