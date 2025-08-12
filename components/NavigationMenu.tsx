// components/NavigationMenu.tsx
"use client";

import { motion } from 'framer-motion';
import { Home, User, Briefcase, Mail } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

const navItems = [
  { href: '#home', icon: Home, label: 'Inicio' },
  { href: '#about', icon: User, label: 'Sobre Mí' },
  { href: '#projects', icon: Briefcase, label: 'Proyectos' },
  { href: '#contact', icon: Mail, label: 'Contacto' },
];

export function NavigationMenu({ activeSection }: { activeSection: string }) {
  return (
    <>
      {/* Theme switcher in top right */}
      <motion.div
        className="fixed top-8 right-8 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      >
        <ThemeSwitcher />
      </motion.div>

      {/* Navigation menu at bottom */}
      <motion.nav
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2 rounded-full nav-glass p-2">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/10"
              aria-label={item.label}
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <item.icon
                className={`h-5 w-5 nav-icon ${
                  activeSection === item.href ? 'active' : ''
                }`}
              />
              {activeSection === item.href && (
                <motion.div
                  className="absolute bottom-1 h-1 w-1 rounded-full bg-green-500"
                  layoutId="active-pill"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
        </div>
      </motion.nav>
    </>
  );
}