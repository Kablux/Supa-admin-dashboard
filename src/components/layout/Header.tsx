import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import TabletMacOutlinedIcon from "@mui/icons-material/TabletMacOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useThemeMode } from "../../theme/ThemeContext";
import { ROUTE_LABELS } from "../../data/data";
import { logoutAdmin } from "../../api/xhrHelper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

interface HeaderProps {
  onToggleMobile: () => void;
  onToggleCollapse: () => void;
}

export default function Header({ onToggleMobile, onToggleCollapse }: HeaderProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { mode, toggleMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const pageLabel =
    ROUTE_LABELS[location.pathname] ||
    (location.pathname.startsWith("/analytics") ? "Analytics" : "Dashboard");
  const isDark = mode === "dark";

  const { user } = useAppSelector((state) => state.auth);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = async (action: string) => {
    handleMenuClose();

    if (action === "Sign out") {
      await dispatch(logoutAdmin());
    }
  };

  const userRole = user?.role || "Admin";
  const userEmail = user?.email || "";

  return (
    <Box
      component="header"
      sx={{
        height: 60,
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        px: { xs: 1.25, sm: 2, md: 3 },
        gap: { xs: 0.75, sm: 2 },
        position: "sticky",
        top: 0,
        zIndex: 90,
        flexShrink: 0,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Sidebar Toggle Buttons */}
      <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        {/* Mobile Toggle */}
        <IconButton
          onClick={onToggleMobile}
          size="small"
          aria-label="Open navigation menu"
          sx={{
            display: { xs: "inline-flex", md: "none" },
            color: "var(--text-muted)",
            p: 0.5,
          }}
        >
          <MenuIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {/* Desktop Collapse Toggle */}
        <IconButton
          onClick={onToggleCollapse}
          size="small"
          aria-label="Toggle sidebar collapse"
          sx={{
            display: { xs: "none", md: "inline-flex" },
            color: "var(--text-muted)",
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Breadcrumb */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        <TabletMacOutlinedIcon
          sx={{
            fontSize: 15,
            color: "var(--text-muted)",
            display: { xs: "none", sm: "block" },
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontSize: 12,
            color: "var(--text-muted)",
            display: { xs: "none", md: "block" },
            whiteSpace: "nowrap",
          }}
        >
          Dashboards
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            color: "var(--text-muted)",
            display: { xs: "none", md: "block" },
          }}
        >
          /
        </Typography>
        <Typography
          noWrap
          sx={{
            fontSize: { xs: 12.5, sm: 12 },
            fontWeight: 600,
            color: "var(--text-primary)",
            maxWidth: { xs: 88, sm: 180, md: "none" },
          }}
        >
          {pageLabel}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minWidth: 4 }} />

      {/* Action icons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.25, sm: 0.5 },
          flexShrink: 0,
        }}
      >
        <Tooltip title="Refresh">
          <IconButton
            size="small"
            sx={{
              color: "var(--text-muted)",
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            <RefreshOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Favourites">
          <IconButton
            size="small"
            sx={{
              color: "var(--text-muted)",
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            <StarBorderIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton
            size="small"
            onClick={toggleMode}
            sx={{
              color: "var(--accent-gold)",
              backgroundColor: "var(--accent-gold-glow)",
              border: "1px solid rgba(245,197,24,0.2)",
              width: { xs: 28, sm: 30 },
              height: { xs: 28, sm: 30 },
              mx: { xs: 0.25, sm: 0.75 },
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
          <IconButton
            size="small"
            sx={{
              color: "var(--text-muted)",
              p: { xs: 0.5, sm: 0.75 },
            }}
          >
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
      <Tooltip title={userEmail || "Admin Profile"}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.65, sm: 1 },
            cursor: "pointer",
            userSelect: "none",
            ml: { xs: 0.25, sm: 0.5 },
            minWidth: 0,
            maxWidth: { xs: 122, sm: 220, md: 250 },
            flexShrink: 0,
            "&:hover": { opacity: 0.82 },
            transition: "opacity 0.15s",
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Avatar
            src="https://i.pravatar.cc/150?img=2"
            sx={{
              width: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              border: "2px solid var(--accent-gold)",
              flexShrink: 0,
            }}
          />
          <Box sx={{ textAlign: "left", minWidth: 0, flex: 1 }}>
            <Typography
              noWrap
              sx={{
                fontSize: { xs: 11, sm: 12 },
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                textTransform: "capitalize",
              }}
            >
              {userRole}
            </Typography>
            {userEmail && (
              <Typography
                noWrap
                sx={{
                  fontSize: { xs: 9.5, sm: 10 },
                  mt: 0.25,
                  color: "var(--text-secondary)",
                  lineHeight: 1.1,
                }}
              >
                {userEmail}
              </Typography>
            )}
          </Box>
          <KeyboardArrowDownIcon
            sx={{
              fontSize: 14,
              color: "var(--text-muted)",
              display: { xs: "none", sm: "block" },
              flexShrink: 0,
            }}
          />
        </Box>
      </Tooltip>

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
              minWidth: 180,
              maxWidth: "calc(100vw - 24px)",
              borderRadius: "12px",
              bgcolor: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            },
          },
        }}
      >
        {userEmail && (
          <Box sx={{ px: 2, py: 1.25, borderBottom: "1px solid var(--border)" }}>
            <Typography sx={{ fontSize: 11, color: "var(--text-muted)" }}>
              Signed in as
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-primary)",
                wordBreak: "break-all",
              }}
            >
              {userEmail}
            </Typography>
          </Box>
        )}

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