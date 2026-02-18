"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeInitializer() {
  const setMode = useThemeStore((s) => s.setMode);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gemroad-theme");
      if (stored === "light" || stored === "dark") {
        setMode(stored);
      }
    } catch {}
  }, [setMode]);

  return null;
}
