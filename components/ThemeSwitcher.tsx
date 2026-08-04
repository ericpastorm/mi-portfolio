// components/ThemeSwitcher.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export type AeroTheme = "dark" | "light";

/** Evento de cambio de tema: lo dispara applyTheme y lo escuchan los
 *  componentes que necesitan saber el tema actual (p. ej. el menú contextual). */
export const THEME_CHANGE_EVENT = "portfolio:theme-change";

const updateFavicon = (currentTheme: AeroTheme) => {
  const iconUrl = currentTheme === "light" ? "/icons/favicon-light.ico" : "/favicon.ico";
  const favicons = document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]');
  favicons.forEach((favicon) => {
    if (favicon.type === "image/x-icon" || favicon.href.endsWith(".ico")) {
      favicon.href = iconUrl;
    }
  });
};

export function readStoredTheme(): AeroTheme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  return stored === "dark" || stored === "light" ? stored : "light";
}

/** Aplica el tema (clase en <html>, persistencia y favicon) y avisa al resto
 *  de la aplicación mediante THEME_CHANGE_EVENT. */
export function applyTheme(theme: AeroTheme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem("theme", theme);
  } catch {
    // noop
  }
  updateFavicon(theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

// Frutiger Aero es light-first: el tema por defecto es LIGHT.
// La elección del usuario persiste en localStorage ('dark' | 'light').
export const ThemeSwitcher = ({ ariaLabel }: { ariaLabel: string }) => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<AeroTheme>("light");

  useEffect(() => {
    setMounted(true);
    const initialTheme = readStoredTheme();
    setTheme(initialTheme);
    updateFavicon(initialTheme);
  }, []);

  // Sincroniza el botón si el tema cambia desde otro sitio (menú contextual).
  useEffect(() => {
    const sync = () => setTheme(readStoredTheme());
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);

  const toggleTheme = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="tray-btn"
      aria-label={ariaLabel}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </motion.button>
  );
};
