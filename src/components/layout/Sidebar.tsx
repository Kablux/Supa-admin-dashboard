import { useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { navSections } from "../../data/mockData";
import logoImg from "../../assets/Kablux-logo.svg";
import UpgradeBox from "./Upgrade";
import type { NavItem } from "../../types/common.types";

export const SIDEBAR_WIDTH = 220;

interface SidebarProps {
  activeNav: string;

  setActiveNav: React.Dispatch<
    React.SetStateAction<string>
  >;
}

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const navigate = useNavigate();

  const handleNav = (item:NavItem) => {
    setActiveNav(item.id);
    navigate(item.path);
  };

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        minHeight: "100vh",
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        overflowY: "auto",
        overflowX: "hidden",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Logo */}

      <Box
        sx={{
          height: 72,
          maxWidth: 286,
          display: "flex",
          alignItems: "center",
          px: 3,
          py: 2,
          backgroundColor: "var(--bg-secondary)",
        }}
        className="sticky top-0 left-0 backdrop-blur-sm z-10 w-full"
      >
        <Box
          component="img"
          src={logoImg}
          alt="Kablux Logo"
          sx={{
            height: 32,
            width: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      <Divider sx={{ borderColor: "var(--border-subtle)", mx: 2 }} />

      {/* Nav sections */}
      <Box sx={{ flex: 1, px: 1.5, py: 1.5 }}>
        {navSections.map((section, si) => (
          <Box key={si}>
            {section.title && (
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  color: "var(--text-muted)",
                  px: 1.5,
                  pt: 1.5,
                  pb: 0.5,
                  textTransform: "uppercase",
                }}
              >
                {section.title}
              </Typography>
            )}
            <List dense disablePadding>
              {section.items.map((item) => {
                const isActive = activeNav === item.id;
                const Icon = item.icon;
                return (
                  <ListItemButton
                    key={item.id}
                    selected={isActive}
                    onClick={() => handleNav(item)}
                    sx={{
                      py: 0.9,
                      px: 1.5,
                      mb: 0.25,
                      gap: 0,
                      borderRadius: 2,
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 34,
                        color: isActive ? "#0d0d0d" : "inherit",
                      }}
                    >
                      <Icon size={20} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: { xs: 14, sm: 16 },
                            fontWeight: isActive ? 600 : 400,
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
            {/* Subtle divider after sections that have titles */}
            {section.title && si < navSections.length - 1 && (
              <Divider
                sx={{ borderColor: "var(--border-subtle)", mt: 0.5, mb: 0 }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Upgrade CTA */}
      <UpgradeBox />
    </Box>
  );
}
