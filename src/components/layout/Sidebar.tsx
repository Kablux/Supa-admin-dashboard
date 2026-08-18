import { useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { navSections } from "../../data/data";
import logoImg from "../../assets/Kablux-logo.svg";
import type { NavItem } from "../../types/common.types";

export const SIDEBAR_WIDTH = 220;
export const COLLAPSED_WIDTH = 72;

interface SidebarProps {
  activeNav: string;
  setActiveNav: React.Dispatch<React.SetStateAction<string>>;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  activeNav,
  setActiveNav,
  isCollapsed,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const effectiveCollapsed = isCollapsed && !isMobile;

  const handleNav = (item: NavItem) => {
    setActiveNav(item.id);
    navigate(item.path);
    if (isMobile) {
      onMobileClose(); 
    }
  };

  const drawerContent = (
    <Box
      sx={{
        width: isMobile ? SIDEBAR_WIDTH : effectiveCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Logo Area */}
      <Box
        sx={{
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: effectiveCollapsed ? "center" : "flex-start",
          px: effectiveCollapsed ? 0 : 3,
          py: 2,
        }}
        className="sticky top-0 left-0 backdrop-blur-sm z-10 w-full"
      >
        <Box
          component="img"
          src={logoImg}
          alt="Kablux Logo"
          sx={{
            height: 32,
            width: effectiveCollapsed ? 0 : "auto",
            opacity: effectiveCollapsed ? 0 : 1,
            objectFit: "contain",
            transition: "opacity 0.2s ease, width 0.3s ease",
          }}
        />
        
      </Box>

      <Divider sx={{ borderColor: "var(--border-subtle)", mx: effectiveCollapsed ? 1 : 2 }} />

      {/* Nav Sections */}
      <Box sx={{ flex: 1, px: effectiveCollapsed ? 1 : 1.5, py: 1.5, overflowY: "auto", overflowX: "hidden" }}>
        {navSections.map((section, si) => (
          <Box key={si}>
            {/* Section Title */}
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
                  opacity: effectiveCollapsed ? 0 : 1,
                  height: effectiveCollapsed ? 0 : "auto",
                  visibility: effectiveCollapsed ? "hidden" : "visible",
                  transition: "opacity 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {section.title}
              </Typography>
            )}
            
            {section.title && effectiveCollapsed && <Box sx={{ mt: 2 }} />}

            <List dense disablePadding>
              {section.items.map((item) => {
                const isActive = activeNav === item.id;
                const Icon = item.icon;
                return (
                  <ListItemButton
                    key={item.id}
                    selected={isActive}
                    onClick={() => handleNav(item)}
                    title={effectiveCollapsed ? item.label : ""}
                    sx={{
                      py: 1,
                      px: effectiveCollapsed ? 0 : 1.5,
                      mb: 0.5,
                      borderRadius: 2,
                      justifyContent: effectiveCollapsed ? "center" : "flex-start",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "auto",
                        mr: effectiveCollapsed ? 0 : 1.5, 
                        color: isActive ? "#0d0d0d" : "inherit",
                        transition: "margin 0.3s ease",
                      }}
                    >
                      <Icon size={20} />
                    </ListItemIcon>
                    
                    {!effectiveCollapsed && (
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: { xs: 14, sm: 15 },
                              fontWeight: isActive ? 600 : 400,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.label}
                          </Typography>
                        }
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
            
            {section.title && si < navSections.length - 1 && (
              <Divider
                sx={{ borderColor: "var(--border-subtle)", mt: 0.5, mb: 0 }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box component="nav">
      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: SIDEBAR_WIDTH,
            backgroundColor: "var(--bg-secondary)",
            borderRight: "1px solid var(--border)",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: effectiveCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
            backgroundColor: "var(--bg-secondary)",
            borderRight: "1px solid var(--border)",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowX: "hidden",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}