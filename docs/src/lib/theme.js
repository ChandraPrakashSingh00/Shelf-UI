import { useCallback, useEffect, useState } from "react";

// Keep in sync with the inline script in docs/index.html.
const STORAGE_KEY = "cps-docs-theme";

function readSavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.cpsTheme = theme;
}

/**
 * The docs theme, stored on `<html data-cps-theme>`. Follows the operating
 * system until the reader picks a theme, which is then remembered.
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() =>
    document.documentElement.dataset.cpsTheme === "dark" ? "dark" : "light",
  );

  const setTheme = useCallback((next) => {
    applyTheme(next);
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies.
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;

    const handleChange = (event) => {
      if (readSavedTheme()) return;
      const next = event.matches ? "dark" : "light";
      applyTheme(next);
      setThemeState(next);
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return { theme, setTheme };
}
