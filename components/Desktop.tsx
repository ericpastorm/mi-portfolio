// components/Desktop.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, User, FolderOpen, Mail, type LucideIcon } from "lucide-react";
import { OsWindow, type WindowVisualState } from "./Window";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { BootSplash } from "./BootSplash";
import { WelcomeApp } from "./WelcomeApp";
import { AboutApp } from "./AboutApp";
import { ProjectsApp } from "./ProjectsApp";
import { ContactApp } from "./ContactApp";
import type { Dictionary } from "@/types";

type AppId = "welcome" | "about" | "projects" | "contact";

interface AppDef {
  icon: LucideIcon;
  titleKey: keyof Dictionary["navigation"];
  width: number;
}

const APP_DEFS: Record<AppId, AppDef> = {
  welcome:  { icon: Monitor,    titleKey: "home",     width: 680 },
  about:    { icon: User,       titleKey: "about",    width: 880 },
  projects: { icon: FolderOpen, titleKey: "projects", width: 940 },
  contact:  { icon: Mail,       titleKey: "contact",  width: 820 },
};

const APP_ORDER: AppId[] = ["welcome", "about", "projects", "contact"];

const TASKBAR_H = 48;

const closedWindow = (): WindowVisualState => ({
  open: false,
  minimized: false,
  maximized: false,
  z: 0,
  x: -1, // -1 = aún sin posición asignada
  y: -1,
});

// Sparkles sutiles sobre el wallpaper
const desktopSparkles = [
  { char: "✦", className: "top-[16%] right-[14%] text-2xl", delay: 0.4, duration: 4.2 },
  { char: "✧", className: "bottom-[24%] right-[8%] text-xl", delay: 1.4, duration: 3.8 },
  { char: "✦", className: "top-[58%] left-[6%] text-lg", delay: 0.9, duration: 4.6 },
];

export function Desktop({ dict }: { dict: Dictionary }) {
  const [mounted, setMounted] = useState(false);
  const [booted, setBooted] = useState(false);
  const [wins, setWins] = useState<Record<AppId, WindowVisualState>>({
    welcome: closedWindow(),
    about: closedWindow(),
    projects: closedWindow(),
    contact: closedWindow(),
  });
  const [activeId, setActiveId] = useState<AppId | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);

  const desktopRef = useRef<HTMLDivElement>(null);
  const zRef = useRef(10); // contador de z-index (evita estado obsoleto)
  const welcomeOpenedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobileNow = () =>
    typeof window !== "undefined" && window.innerWidth < 768;

  const initialPos = (id: AppId): { x: number; y: number } => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(APP_DEFS[id].width, vw * 0.96);
    if (id === "welcome") {
      // Centrada, dejando hueco para la taskbar
      return {
        x: Math.max(8, (vw - w) / 2),
        y: Math.max(10, (vh - TASKBAR_H - 520) / 2),
      };
    }
    const i = APP_ORDER.indexOf(id);
    return {
      x: Math.max(8, Math.min(110 + i * 42, vw - w - 16)),
      y: Math.max(8, Math.min(30 + i * 34, vh - TASKBAR_H - 280)),
    };
  };

  const openApp = useCallback((id: AppId) => {
    setStartOpen(false);
    const z = ++zRef.current;
    setWins((prev) => {
      const w = prev[id];
      const needsPos = w.x < 0 || w.y < 0;
      const pos = needsPos && typeof window !== "undefined" ? initialPos(id) : { x: w.x, y: w.y };
      return {
        ...prev,
        [id]: {
          ...w,
          open: true,
          minimized: false,
          maximized: isMobileNow() ? true : w.maximized,
          z,
          x: pos.x,
          y: pos.y,
        },
      };
    });
    setActiveId(id);
  }, []);

  // Auto-abrir la ventana de bienvenida tras el boot
  useEffect(() => {
    if (booted && !welcomeOpenedRef.current) {
      welcomeOpenedRef.current = true;
      openApp("welcome");
    }
  }, [booted, openApp]);

  const closeApp = useCallback((id: AppId) => {
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], open: false, minimized: false, maximized: false } }));
    setActiveId((currentActive) => {
      if (currentActive !== id) return currentActive;
      // Pasar el foco a la ventana abierta más alta
      let best: AppId | null = null;
      let bestZ = -1;
      for (const otherId of APP_ORDER) {
        if (otherId === id) continue;
        const w = wins[otherId];
        if (w.open && !w.minimized && w.z > bestZ) {
          best = otherId;
          bestZ = w.z;
        }
      }
      return best;
    });
  }, [wins]);

  const focusApp = useCallback((id: AppId) => {
    const z = ++zRef.current;
    setWins((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: false, z },
    }));
    setActiveId(id);
  }, []);

  const minimizeApp = useCallback((id: AppId) => {
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], minimized: true } }));
    setActiveId((currentActive) => {
      if (currentActive !== id) return currentActive;
      let best: AppId | null = null;
      let bestZ = -1;
      for (const otherId of APP_ORDER) {
        if (otherId === id) continue;
        const w = wins[otherId];
        if (w.open && !w.minimized && w.z > bestZ) {
          best = otherId;
          bestZ = w.z;
        }
      }
      return best;
    });
  }, [wins]);

  const toggleMaximizeApp = useCallback((id: AppId) => {
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], maximized: !prev[id].maximized } }));
  }, []);

  // Clic en un botón de la taskbar: enfocar/restaurar, o minimizar si ya está activa
  const handleTaskClick = useCallback((id: AppId) => {
    const w = wins[id];
    if (activeId === id && !w.minimized) {
      minimizeApp(id);
    } else {
      focusApp(id);
    }
  }, [wins, activeId, minimizeApp, focusApp]);

  // Escape: cierra el menú de inicio o la ventana activa
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (startOpen) {
        setStartOpen(false);
      } else if (activeId) {
        closeApp(activeId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startOpen, activeId, closeApp]);

  const finishBoot = useCallback(() => setBooted(true), []);

  const appTitle = (id: AppId) => dict.navigation[APP_DEFS[id].titleKey];

  const renderAppBody = (id: AppId) => {
    switch (id) {
      case "welcome":  return <WelcomeApp dict={dict} />;
      case "about":    return <AboutApp dict={dict} />;
      case "projects": return <ProjectsApp dict={dict} />;
      case "contact":  return <ContactApp dict={dict} />;
    }
  };

  return (
    <main className="os-desktop">
      {/* Wallpaper Bliss + velo nocturno */}
      <div className="os-wallpaper hero-field" aria-hidden="true">
        <div className="hero-field-night" />
      </div>

      {/* Burbujas de cromo + sparkles */}
      <div aria-hidden="true" className="bubble-deco hidden md:block h-32 w-32 right-[6%] top-[10%]" />
      <div aria-hidden="true" className="bubble-deco hidden md:block h-16 w-16 right-[22%] bottom-[18%]" />
      {desktopSparkles.map((sparkle, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={`flare pointer-events-none absolute select-none z-10 ${sparkle.className}`}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 12, 0],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {sparkle.char}
        </motion.span>
      ))}

      {/* Área de escritorio (por encima de la taskbar) */}
      <div
        ref={desktopRef}
        className="absolute inset-x-0 top-0 bottom-12"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setSelectedIcon(null);
        }}
      >
        {mounted && booted && (
          <>
            <div className="desktop-icons">
              {APP_ORDER.map((id) => (
                <DesktopIcon
                  key={id}
                  icon={APP_DEFS[id].icon}
                  label={appTitle(id)}
                  selected={selectedIcon === id}
                  onSelect={() => setSelectedIcon(id)}
                  onOpen={() => openApp(id)}
                />
              ))}
            </div>

            <AnimatePresence>
              {APP_ORDER.map((id) => {
                const w = wins[id];
                if (!w.open) return null;
                return (
                  <OsWindow
                    key={id}
                    title={appTitle(id)}
                    icon={APP_DEFS[id].icon}
                    win={w}
                    active={activeId === id && !w.minimized}
                    width={APP_DEFS[id].width}
                    constraintsRef={desktopRef}
                    os={dict.os}
                    onFocus={() => focusApp(id)}
                    onClose={() => closeApp(id)}
                    onMinimize={() => minimizeApp(id)}
                    onToggleMaximize={() => toggleMaximizeApp(id)}
                  >
                    {renderAppBody(id)}
                  </OsWindow>
                );
              })}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Menú de inicio */}
      <AnimatePresence>
        {startOpen && (
          <StartMenu
            apps={APP_ORDER.map((id) => ({
              id,
              title: appTitle(id),
              icon: APP_DEFS[id].icon,
            }))}
            onOpenApp={(id) => openApp(id as AppId)}
            onClose={() => setStartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Taskbar siempre presente */}
      <Taskbar
        apps={APP_ORDER.map((id) => ({
          id,
          title: appTitle(id),
          icon: APP_DEFS[id].icon,
          open: wins[id].open,
          minimized: wins[id].minimized,
        }))}
        activeId={activeId}
        startOpen={startOpen}
        startLabel={dict.os.start}
        themeSwitcherLabel={dict.hero.changeTheme}
        onStartToggle={() => setStartOpen((v) => !v)}
        onTaskClick={(id) => handleTaskClick(id as AppId)}
      />

      {/* Boot splash por encima de todo */}
      <AnimatePresence>
        {!booted && <BootSplash onDone={finishBoot} />}
      </AnimatePresence>
    </main>
  );
}
