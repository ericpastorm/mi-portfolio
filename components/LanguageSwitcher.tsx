// components/LanguageSwitcher.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export const LanguageSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // --- INICIO DE LOS CAMBIOS ---

  // 1. Eliminamos el hook `useLocale` de 'next-intl'.

  // 2. Obtenemos el idioma actual ('lang') desde el pathname.
  // Por ejemplo, si pathname es "/es/proyectos", .split('/')[1] nos dará "es".
  const lang = pathname.split('/')[1];

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = (newLocale: string) => {
    // 3. Usamos `lang` en lugar de `locale` para construir la nueva ruta.
    const pathWithoutLocale = pathname.replace(`/${lang}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsOpen(false);
  };

  if (!mounted) {
    return null;
  }

  // 4. Usamos `lang` para encontrar el idioma actual a mostrar.
  const currentLanguage = languages.find(l => l.code === lang);

  // --- FIN DE LOS CAMBIOS ---

  return (
    <motion.div
      className="fixed top-8 left-8 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
    >
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 h-11 px-4 nav-glass"
          aria-label="Change language"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
        >
          <Languages className="h-4 w-4 nav-icon" />
          <span className="text-sm nav-icon font-bold tracking-wide">
            {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
          </span>
        </motion.button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-full mt-2 left-0 window-panel rounded-xl overflow-hidden"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[rgb(var(--accent))]/10 transition-colors ${
                  // 5. Y finalmente, aquí también usamos `lang`.
                  language.code === lang ? 'bg-[rgb(var(--accent))]/10' : ''
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm text-primary font-medium">{language.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};