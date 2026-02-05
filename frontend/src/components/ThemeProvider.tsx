"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "codepath-ui-theme",
}: ThemeProviderProps) {
  // ✅ Safe default for SSR
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // ✅ Load theme from localStorage on client only
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) setTheme(stored);
    setMounted(true);
  }, [storageKey]);

  // ✅ Apply theme + persist
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    root.classList.add(resolved);
    localStorage.setItem(storageKey, theme);
  }, [theme, mounted, storageKey]);

  const value: ThemeProviderState = {
    theme,
    setTheme,
  };

  // Prevent hydration mismatch flash
  if (!mounted) return null;

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
