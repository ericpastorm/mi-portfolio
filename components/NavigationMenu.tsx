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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 100; // Espacio extra en la parte superior
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

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
        <div className="flex items-center gap-2 nav-glass p-2">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              // 5. Usamos el objeto `translations` que recibimos por props.
              // item.labelKey es 'home', 'about', etc., así que encaja perfectamente.
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-[rgb(var(--accent))]/10 active:translate-y-px"
              aria-label={translations[item.labelKey as keyof NavTranslations]}
              whileHover={{ y: -3, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
            >
              <item.icon
                className={`h-5 w-5 nav-icon ${
                  activeSection === item.href ? 'active' : ''
                }`}
              />
              {activeSection === item.href && (
                <motion.div
                  className="absolute bottom-0.5 carousel-dot-active"
                  style={{ width: 6, height: 6, borderRadius: 2 }}
                  layoutId="active-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                />
              )}
            </motion.a>
          ))}
        </div>
      </motion.nav>
    </>
  );
}