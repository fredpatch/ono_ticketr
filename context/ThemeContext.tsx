"use client";

import { lookInLocal, StoreInLocal } from "@/common/localeStore";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Check localStorage or system preference on initial load
  useEffect(() => {
    let themeInSession = lookInLocal("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    setTheme(
      themeInSession
        ? (themeInSession as "light" | "dark")
        : prefersDark
        ? "dark"
        : "light"
    );
  }, []);

  // Update `class` on `html` element and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "light" ? "dark" : "light");
    root.classList.add(theme);
    StoreInLocal("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default ThemeContextProvider;
