import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type ThemeMode = "dark" | "light";
type ThemeVars = Record<string, string>;
const DARK_VARS: ThemeVars = {
  "--bg-primary": "#0d0d0d",
  "--bg-secondary": "#141414",
  "--bg-card": "#1a1a1a",
  "--bg-card-hover": "#202020",
  "--border": "#2a2a2a",
  "--border-subtle": "#1e1e1e",
  "--text-primary": "#f0f0f0",
  "--text-secondary": "#888888",
  "--text-muted": "#555555",
  "--accent-gold": "#FEB914",
  "--accent-gold-dim": "#c99d10",
  "--accent-gold-glow": "rgba(245,197,24,0.15)",
  "--success": "#4CAF50",
  "--danger": "#D32F2F",
  "--danger-hover": "#FF0000",
  "--info": "#42A5F5",
};

const LIGHT_VARS: ThemeVars = {
  "--bg-primary": "#f4f5f7",
  "--bg-secondary": "#ffffff",
  "--bg-card": "#ffffff",
  "--bg-card-hover": "#f9f9fb",
  "--border": "#e4e4e7",
  "--border-subtle": "#efefef",
  "--text-primary": "#1a1a1a",
  "--text-secondary": "#555555",
  "--text-muted": "#aaaaaa",
  "--accent-gold": "#d4a914",
  "--accent-gold-dim": "#b8900f",
  "--accent-gold-glow": "rgba(212,169,20,0.12)",
  "--success": "#388E3C",
  "--danger": "#FF0000",
  "--danger-hover": "#D32F2F",
  "--info": "#1976D2",
};
interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeCtx = createContext<ThemeContextType>({
  mode: "dark",
  toggleMode: () => {},
});

export const useThemeMode = () => useContext(ThemeCtx);

interface ThemeModeProviderProps {
  children: ReactNode;
}

function applyVars(vars: ThemeVars) {
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const stored = () => {
    try {
      return localStorage.getItem("supa-theme") || "dark";
    } catch {
      return "dark";
    }
  };

  const [mode, setMode] = useState<ThemeMode>(stored() as ThemeMode);

  const toggleMode = useCallback(() => {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("supa-theme", next);
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    applyVars(mode === "dark" ? DARK_VARS : LIGHT_VARS);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  // Apply on first paint (before any render)
  useEffect(() => {
    applyVars(mode === "dark" ? DARK_VARS : LIGHT_VARS);
  }, []); // eslint-disable-line

  return (
    <ThemeCtx.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeCtx.Provider>
  );
}
