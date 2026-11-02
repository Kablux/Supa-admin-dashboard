import { useThemeMode } from "../theme/ThemeContext";

export interface ChartPalette {
  series: string[];
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipBorder: string;
  text: string;
  positive: string;
  negative: string;
  neutral: string;
  heat: (share: number) => string;
}

const DARK: Omit<ChartPalette, "heat"> = {
  series: ["#FEB914", "#42A5F5", "#66BB6A", "#EF5350", "#AB47BC", "#26C6DA", "#FFA726"],
  grid: "#262626",
  axis: "#777777",
  tooltipBg: "#1a1a1a",
  tooltipBorder: "#2a2a2a",
  text: "#f0f0f0",
  positive: "#66BB6A",
  negative: "#EF5350",
  neutral: "#9E9E9E",
};

const LIGHT: Omit<ChartPalette, "heat"> = {
  series: ["#C8920A", "#1976D2", "#388E3C", "#D32F2F", "#7B1FA2", "#00838F", "#EF6C00"],
  grid: "#ececec",
  axis: "#777777",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e4e4e7",
  text: "#1a1a1a",
  positive: "#2E7D32",
  negative: "#C62828",
  neutral: "#757575",
};

export function usePalette(): ChartPalette {
  const { mode } = useThemeMode();
  const base = mode === "dark" ? DARK : LIGHT;
  return {
    ...base,
    heat: (share: number) => {
      const clamped = Math.max(0, Math.min(1, share));
      const alpha = 0.08 + clamped * 0.85;
      return mode === "dark" ? `rgba(254, 185, 20, ${alpha})` : `rgba(200, 146, 10, ${alpha})`;
    },
  };
}
