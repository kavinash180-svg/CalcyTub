// Lightweight theme hook (no dependency). Applies "dark" class to <html>.
import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "calcytub_theme";

function readInitial() {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark"; // dark is default per requirement
}

function apply(theme) {
  const cls = document.documentElement.classList;
  if (theme === "dark") cls.add("dark");
  else cls.remove("dark");
  document.documentElement.setAttribute("data-theme", theme);
}

// Set the theme before React renders to avoid FOUC.
export function initTheme() {
  apply(readInitial());
}

export function useTheme() {
  const [theme, setThemeState] = useState(readInitial);
  useEffect(() => { apply(theme); }, [theme]);
  const setTheme = useCallback((t) => {
    setThemeState(t);
    try { window.localStorage.setItem(STORAGE_KEY, t); } catch {}
  }, []);
  const toggle = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);
  return { theme, setTheme, toggle };
}
