export const theme = {
  colors: {
    bg: "#020617",
    bgCard: "#0f172a",
    bgHover: "#1e293b",
    border: "#1e293b",
    text: "#E5E7EB",
    textMuted: "#94A3B8",
    primary: "#38BDF8",
    primaryHover: "#0EA5E9",
    accent: "#DBB45D",
    accentHover: "#C9A24B",
    success: "#2A9D8F",
    warning: "#E9C46A",
    danger: "#EF4444",
    gem: "#DBB45D",
    common: "#9CA3AF",
    uncommon: "#34D399",
    rare: "#60A5FA",
    epic: "#A78BFA",
    legendary: "#FBBF24",
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "var(--font-cinzel), 'Cinzel', serif",
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
