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

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedTheme = localStorage.getItem(THEME_KEY);

  return storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
    ? storedTheme
    : "system";
}

export default function useTheme() {
  const [theme, setThemeState] =
    useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const handleChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
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