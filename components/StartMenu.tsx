// components/StartMenu.tsx
"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface StartMenuApp {
  id: string;
  title: string;
  icon: LucideIcon;
}

interface StartMenuProps {
  apps: StartMenuApp[];
  onOpenApp: (id: string) => void;
  onClose: () => void;
}

export function StartMenu({ apps, onOpenApp, onClose }: StartMenuProps) {
  return (
    <>
      {/* Backdrop para cerrar al hacer clic fuera */}
      <div className="fixed inset-0 z-[85]" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="start-menu window-panel rounded-xl"
        role="menu"
        aria-label="Start menu"
      >
        <div className="start-menu-header">
          <span className="start-menu-avatar" aria-hidden="true">EP</span>
          <span className="start-menu-name">Eric Pastor</span>
        </div>
        <div className="start-menu-items">
          {apps.map((app) => (
            <button
              key={app.id}
              type="button"
              role="menuitem"
              className="start-item"
              onClick={() => onOpenApp(app.id)}
            >
              <span className="start-item-icon">
                <app.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-primary">{app.title}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
