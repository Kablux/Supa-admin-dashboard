import { createTheme } from "@mui/material/styles";

const sharedTypography = {
  fontFamily: "'Roboto', sans-serif",
  h1: { fontFamily: "'Roboto', sans-serif", fontWeight: 700 },
  h2: { fontFamily: "'Roboto', sans-serif", fontWeight: 700 },
  h3: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
  h4: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
  h5: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
  h6: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
};

const sharedShape = { borderRadius: 12 };

const sharedComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 500,
        borderRadius: 8,
      },
      containedPrimary: {
        backgroundColor: "#FEB914",
        color: "#0d0d0d",
        "&:hover": { backgroundColor: "#d4a914" },
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        marginBottom: 2,
        "&.Mui-selected": {
          backgroundColor: "#FEB914",
          color: "#0d0d0d",
          "& .MuiListItemIcon-root": { color: "#0d0d0d" },
          "& .MuiListItemText-primary": { color: "#0d0d0d", fontWeight: 600 },
          "&:hover": { backgroundColor: "#d4a914" },
        },
        "&:hover": { backgroundColor: "rgba(245,197,24,0.08)" },
      },
    },
  },
  MuiChip: {
    styleOverrides: { root: { fontFamily: "'Roboto', sans-serif" } },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        "&:hover": { backgroundColor: "rgba(245,197,24,0.08)" },
      },
    },
  },
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FEB914", contrastText: "#0d0d0d" },
    secondary: { main: "#888888" },
    background: { default: "#0d0d0d", paper: "#1a1a1a" },
    text: { primary: "#f0f0f0", secondary: "#888888" },
    divider: "#2a2a2a",
    success: { main: "#4CAF50" },
    error: { main: "#EF5350" },
    info: { main: "#42A5F5" },
  },
  typography: sharedTypography,
  shape: sharedShape,
  components: {
    ...sharedComponents,
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#0d0d0d" } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1a1a",
          backgroundImage: "none",
          border: "1px solid #2a2a2a",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 36, color: "#666" } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#2a2a2a" } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#2a2a2a",
          border: "1px solid #3a3a3a",
          fontFamily: "'Roboto', sans-serif",
          fontSize: 12,
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#d4a914", contrastText: "#fff" },
    secondary: { main: "#666666" },
    background: { default: "#f4f5f7", paper: "#ffffff" },
    text: { primary: "#1a1a1a", secondary: "#555555" },
    divider: "#e4e4e7",
    success: { main: "#388E3C" },
    error: { main: "#D32F2F" },
    info: { main: "#1976D2" },
  },
  typography: sharedTypography,
  shape: sharedShape,
  components: {
    ...sharedComponents,
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#f4f5f7" } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          backgroundImage: "none",
          border: "1px solid #e4e4e7",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 36, color: "#aaa" } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#e4e4e7" } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1a1a1a",
          border: "1px solid #333",
          fontFamily: "'Roboto', sans-serif",
          fontSize: 12,
        },
      },
    },
  },
});
