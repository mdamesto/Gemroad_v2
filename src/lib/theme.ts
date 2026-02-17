export const theme = {
  colors: {
    bg: "#0A0A0F",
    bgCard: "#12121A",
    bgHover: "#1A1A25",
    border: "#2A2A35",
    text: "#E5E5E5",
    textMuted: "#8888AA",
    primary: "#E63946",
    primaryHover: "#C62D38",
    accent: "#F4A261",
    accentHover: "#E08C4A",
    success: "#2A9D8F",
    warning: "#E9C46A",
    danger: "#E63946",
    gem: "#F4A261",
    common: "#9CA3AF",
    uncommon: "#34D399",
    rare: "#60A5FA",
    epic: "#A78BFA",
    legendary: "#FBBF24",
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 25px rgba(0, 0, 0, 0.5)",
    glow: (color: string) => `0 0 20px ${color}40, 0 0 40px ${color}20`,
  },
};

export type Theme = typeof theme;
