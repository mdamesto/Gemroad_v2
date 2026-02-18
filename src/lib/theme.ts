/**
 * Extract the RGB tuple from a `rgb(var(--c-xxx))` string.
 * Returns the inner `var(--c-xxx)` part, or falls back to hex→rgba conversion.
 */
function extractVar(color: string): string | null {
  const m = color.match(/^rgb\((var\(--[^)]+\))\)$/);
  return m ? m[1] : null;
}

/**
 * Create a color with alpha from a theme color or hex.
 *
 * Usage:
 *   alpha(theme.colors.primary, 0.12)  → "rgba(var(--c-primary), 0.12)"
 *   alpha("#38BDF8", 0.12)             → "rgba(56, 189, 248, 0.12)"
 */
export function alpha(color: string, opacity: number): string {
  const v = extractVar(color);
  if (v) {
    return `rgba(${v}, ${opacity})`;
  }
  // Hex fallback
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const theme = {
  colors: {
    bg: "rgb(var(--c-bg))",
    bgCard: "rgb(var(--c-bg-card))",
    bgHover: "rgb(var(--c-bg-hover))",
    border: "rgb(var(--c-border))",
    text: "rgb(var(--c-text))",
    textMuted: "rgb(var(--c-text-muted))",
    primary: "rgb(var(--c-primary))",
    primaryHover: "rgb(var(--c-primary-hover))",
    accent: "rgb(var(--c-accent))",
    accentHover: "rgb(var(--c-accent-hover))",
    success: "rgb(var(--c-success))",
    warning: "rgb(var(--c-warning))",
    danger: "rgb(var(--c-danger))",
    gem: "rgb(var(--c-gem))",
    // Rarity colors stay fixed hex
    common: "#9CA3AF",
    uncommon: "#34D399",
    rare: "#60A5FA",
    epic: "#A78BFA",
    legendary: "#FBBF24",
    glassBg: "rgba(var(--c-glass-bg), var(--glass-bg-alpha))",
    glassBorder: "rgba(var(--c-primary), 0.15)",
  },
  gradients: {
    primary: "linear-gradient(135deg, rgb(var(--c-primary)), rgb(var(--c-primary-hover)))",
    accent: "linear-gradient(135deg, rgb(var(--c-accent)), #F59E0B)",
    legendary: "linear-gradient(135deg, #FBBF24, #F59E0B, #EAB308)",
    epic: "linear-gradient(135deg, #A78BFA, #8B5CF6)",
    rare: "linear-gradient(135deg, #60A5FA, #3B82F6)",
    mesh: "radial-gradient(ellipse at 20% 50%, rgba(var(--c-primary), 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(167, 139, 250, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(var(--c-accent), 0.05) 0%, transparent 50%)",
    separator: "linear-gradient(90deg, transparent, rgba(var(--c-primary), 0.3), rgba(var(--c-accent), 0.3), transparent)",
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
    sm: "0 1px 3px rgba(var(--shadow-base), 0.3)",
    md: "0 4px 6px rgba(var(--shadow-base), 0.4)",
    lg: "0 10px 25px rgba(var(--shadow-base), 0.5)",
    glow: (color: string) => {
      const v = extractVar(color);
      if (v) {
        return `0 0 20px rgba(${v}, 0.25), 0 0 40px rgba(${v}, 0.12)`;
      }
      return `0 0 20px ${color}40, 0 0 40px ${color}20`;
    },
    glowStrong: (color: string) => {
      const v = extractVar(color);
      if (v) {
        return `0 0 15px rgba(${v}, 0.31), 0 0 30px rgba(${v}, 0.19), 0 0 60px rgba(${v}, 0.08)`;
      }
      return `0 0 15px ${color}50, 0 0 30px ${color}30, 0 0 60px ${color}15`;
    },
  },
};

export type Theme = typeof theme;
