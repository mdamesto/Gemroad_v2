import { create } from "zustand";

type ThemeMode = "dark" | "light";

interface ThemeStore {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

function applyTheme(mode: ThemeMode) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.colorScheme = mode;
  }
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: "dark",
  toggle: () =>
    set((state) => {
      const next = state.mode === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("gemroad-theme", next);
      } catch {}
      return { mode: next };
    }),
  setMode: (mode) => {
    applyTheme(mode);
    try {
      localStorage.setItem("gemroad-theme", mode);
    } catch {}
    set({ mode });
  },
}));
