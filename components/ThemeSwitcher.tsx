"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setMounted(true); 
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme: 'dark' | 'light';
    if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
      initialTheme = storedTheme;
    } else if (systemPrefersDark) {
      initialTheme = 'dark';
    } else {
      initialTheme = 'light';
    }
    
    setTheme(initialTheme);
    
    // Set initial favicon
    updateFavicon(initialTheme);
  }, []);

  const updateFavicon = (currentTheme: 'dark' | 'light') => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      if (currentTheme === 'light') {
        favicon.href = '/faviconLight.ico';
      } else {
        favicon.href = '/favicon.ico';
      }
    }
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
    
    // Update favicon when theme changes
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
      className="flex h-10 w-10 items-center justify-center rounded-full nav-glass transition-all duration-300 hover:bg-white/10"
      aria-label="Cambiar tema"
      whileHover={{ y: -5, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 nav-icon" />
      ) : (
        <Moon className="h-5 w-5 nav-icon" />
      )}
    </motion.button>
  );
};