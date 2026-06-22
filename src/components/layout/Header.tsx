import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import TabletMacOutlinedIcon from "@mui/icons-material/TabletMacOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useThemeMode } from "../../theme/ThemeContext";
import { ROUTE_LABELS } from "../../data/mockData";
import { logoutAdmin } from "../../api/xhrHelper";
import { useAppDispatch } from "../../redux/hooks";

export default function Header() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { mode, toggleMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const pageLabel = ROUTE_LABELS[location.pathname] || "Dashboard";
  const isDark = mode === "dark";

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = async (action: string) => {
    handleMenuClose();

    if (action === "Sign out") {
      await dispatch(logoutAdmin());
    }
  };

  return (
    <Box
      component="header"
      sx={{
        height: 60,
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        px: 3,
        gap: 2,
        position: "sticky",
        top: 0,
        zIndex: 90,
        flexShrink: 0,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Breadcrumb */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}
      >
        <TabletMacOutlinedIcon
          sx={{ fontSize: 15, color: "var(--text-muted)" }}
        />
        <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
          Dashboards
        </Typography>
        <Typography sx={{ fontSize: 12, color: "var(--text-muted)" }}>
          /
        </Typography>
        <Typography
          sx={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}
        >
          {pageLabel}
        </Typography>
      </Box>

      {/* Search */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          px: 1.5,
          py: 0.6,
          width: 300,
          flexShrink: 0,
          transition: "border-color 0.2s, background-color 0.25s",
          "&:focus-within": { borderColor: "var(--accent-gold)" },
        }}
      >
        <SearchIcon sx={{ fontSize: 14, color: "var(--text-muted)" }} />
        <InputBase
          placeholder="Search..."
          sx={{
            flex: 1,
            fontSize: 12.5,
            color: "var(--text-secondary)",
            "& input::placeholder": { color: "var(--text-muted)", opacity: 1 },
          }}
        />
        <Chip
          label="Kablux"
          size="small"
          sx={{
            height: 18,
            fontSize: 10,
            backgroundColor: "var(--border)",
            color: "var(--text-muted)",
            "& .MuiChip-label": { px: 0.75 },
          }}
        />
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* Action icons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
        <Tooltip title="Refresh">
          <IconButton size="small" sx={{ color: "var(--text-muted)" }}>
            <RefreshOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Favourites">
          <IconButton size="small" sx={{ color: "var(--text-muted)" }}>
            <StarBorderIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        {/* ─── Theme toggle ─── */}
        <Tooltip
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <IconButton
            size="small"
            onClick={toggleMode}
            sx={{
              color: "var(--accent-gold)",
              backgroundColor: "var(--accent-gold-glow)",
              border: "1px solid rgba(245,197,24,0.2)",
              width: 30,
              height: 30,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(245,197,24,0.18)",
                transform: "rotate(20deg)",
              },
            }}
          >
            {isDark ? (
              <LightModeOutlinedIcon sx={{ fontSize: 15 }} />
            ) : (
              <DarkModeOutlinedIcon sx={{ fontSize: 15 }} />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton size="small" sx={{ color: "var(--text-muted)", mx: 0.5 }}>
            <Badge
              badgeContent={3}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "var(--accent-gold)",
                  color: "#000",
                  fontSize: 9,
                  minWidth: 14,
                  height: 14,
                },
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 17 }} />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Profile */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          userSelect: "none",
          ml: 1,
          "&:hover": { opacity: 0.82 },
          transition: "opacity 0.15s",
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Avatar
          src="https://i.pravatar.cc/150?img=2"
          sx={{ width: 32, height: 32, border: "2px solid var(--accent-gold)" }}
        />
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            Dami Kablus
          </Typography>
          <Typography
            sx={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1 }}
          >
            Admin
          </Typography>
        </Box>
        <KeyboardArrowDownIcon
          sx={{ fontSize: 14, color: "var(--text-muted)" }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 160,
              borderRadius: "12px",
              bgcolor: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            },
          },
        }}
      >
        {["Profile", "Account Settings", "Sign out"].map((item) => (
          <MenuItem
            key={item}
            onClick={() => handleActionClick(item)}
            sx={{
              fontSize: 13,
              py: 1,
              color: item === "Sign out" ? "error.main" : "text.secondary",
              fontWeight: item === "Sign out" ? 600 : 400,
              "&:hover": {
                backgroundColor:
                  item === "Sign out"
                    ? "rgba(211, 47, 47, 0.04)"
                    : "rgba(0,0,0,0.02)",
              },
            }}
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
