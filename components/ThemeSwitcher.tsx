// components/ThemeSwitcher.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

// Frutiger Aero es light-first: el tema por defecto es LIGHT.
// La elección del usuario persiste en localStorage ('dark' | 'light').
export const ThemeSwitcher = ({ ariaLabel }: { ariaLabel: string }) => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme: 'dark' | 'light' =
      storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';

    setTheme(initialTheme);
    updateFavicon(initialTheme);
  }, []);

  const updateFavicon = (currentTheme: 'dark' | 'light') => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = currentTheme === 'light' ? '/faviconLight.ico' : '/favicon.ico';
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);

    if (mounted) {
      updateFavicon(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
      transition={{ type: 'spring', stiffness: 350, damping: 15 }}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </motion.button>
  );
};
