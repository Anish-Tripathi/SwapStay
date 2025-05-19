import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    changeTheme?: (theme: string) => void;
  }
}

interface ThemeContextType {
  theme: string;
  changeTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const location = useLocation();

  const applyTheme = (newTheme: string) => {
    const html = document.documentElement;

    html.classList.remove("light", "dark");

    if (newTheme === "dark") {
      html.classList.add("dark");
    } else if (newTheme === "light") {
      html.classList.add("light");
    } else if (newTheme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      html.classList.add(prefersDark ? "dark" : "light");
    }

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    if (savedTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const html = document.documentElement;
        html.classList.remove("light", "dark");
        html.classList.add(e.matches ? "dark" : "light");
      };

      // Add listener for system theme changes
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        applyTheme(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location.pathname]); // Re-run when route changes

  // Also add window.changeTheme for backward compatibility
  useEffect(() => {
    window.changeTheme = applyTheme;
    return () => {
      window.changeTheme = undefined;
    };
  }, []);

  const themeContextValue: ThemeContextType = {
    theme,
    changeTheme: applyTheme,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
