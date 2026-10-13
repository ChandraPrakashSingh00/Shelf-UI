import { Button } from "@shelf-ui/react";
import { useTheme } from "../lib/theme.js";
import { MoonIcon, SunIcon } from "./icons.jsx";

/** Toggle button for the site theme (`aria-pressed` reflects dark mode). */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      className="docs-icon-button"
      aria-label="Dark mode"
      aria-pressed={isDark}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      <span className="docs-icon-button__text" aria-hidden="true">
        Dark mode
      </span>
    </Button>
  );
}
