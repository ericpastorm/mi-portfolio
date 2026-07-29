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

  // Obtenemos el idioma actual ('lang') desde el pathname.
  const lang = pathname.split('/')[1];

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${lang}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsOpen(false);
  };

  if (!mounted) {
    return null;
  }

  const currentLanguage = languages.find(l => l.code === lang);

  // Tray icon: el menú se abre hacia ARRIBA (la taskbar está abajo)
  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="tray-btn"
        aria-label="Change language"
        aria-expanded={isOpen}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 350, damping: 15 }}
      >
        <Languages className="h-3.5 w-3.5" />
        <span className="language-current">
          {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
        </span>
      </motion.button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[92]" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="window-panel absolute bottom-full mb-2 right-0 z-[95] w-44 rounded-xl overflow-hidden"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[rgb(var(--accent))]/10 transition-colors ${
                  language.code === lang ? 'bg-[rgb(var(--accent))]/10' : ''
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm text-primary font-medium">{language.name}</span>
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};
