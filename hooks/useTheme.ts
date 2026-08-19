"use client";

import { useEffect, useState } from "react";

export type Theme = "system" | "light" | "dark";

const THEME_KEY = "repo-pilot-theme";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  const resolvedTheme =
    theme === "system" ? getSystemTheme() : theme;

  root.classList.toggle("dark", resolvedTheme === "dark");
}

export default function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);

    const initialTheme: Theme =
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
        ? storedTheme
        : "system";

    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === "system") {
      applyTheme("system");

      const mediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      const handleChange = () => {
        applyTheme("system");
      };

      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(THEME_KEY, newTheme);
    setThemeState(newTheme);
  };

  return {
    theme,
    setTheme,
  };
}