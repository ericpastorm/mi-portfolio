// components/NavigationMenu.tsx
"use client";

import { motion } from 'framer-motion';
import { Home, User, Briefcase, Mail } from 'lucide-react';
// 1. Eliminamos la importación de 'next-intl'.
import { ThemeSwitcher } from './ThemeSwitcher';

const navItems = [
  { href: '#home', icon: Home, labelKey: 'home' },
  { href: '#about', icon: User, labelKey: 'about' },
  { href: '#projects', icon: Briefcase, labelKey: 'projects' },
  { href: '#contact', icon: Mail, labelKey: 'contact' },
];

// 2. Definimos el tipo para nuestras traducciones.
type NavTranslations = {
  home: string;
  about: string;
  projects: string;
  contact: string;
};

// 3. Añadimos `translations` a los props del componente.
export function NavigationMenu({ 
  activeSection,
  translations,
  themeSwitcherLabel
}: { 
  activeSection: string;
  translations: NavTranslations; 
  themeSwitcherLabel: string;
}) {
  // 4. Eliminamos la línea `const t = useTranslations();`.

  return (
    <>
      {/* Theme switcher no cambia */}
      <motion.div
        className="fixed top-8 right-8 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      >
        <ThemeSwitcher ariaLabel={themeSwitcherLabel} />
      </motion.div>

      {/* Menú de navegación */}
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
              // 5. Usamos el objeto `translations` que recibimos por props.
              // item.labelKey es 'home', 'about', etc., así que encaja perfectamente.
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/10"
              aria-label={translations[item.labelKey as keyof NavTranslations]}
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