// components/Window.tsx
"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { motion, useDragControls, useMotionValue, animate } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface WindowVisualState {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
  x: number;
  y: number;
}

interface OsWindowProps {
  title: string;
  icon: LucideIcon;
  win: WindowVisualState;
  active: boolean;
  width: number;
  constraintsRef: RefObject<HTMLDivElement | null>;
  os: {
    minimize: string;
    maximize: string;
    restore: string;
    close: string;
  };
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  children: ReactNode;
}

export function OsWindow({
  title,
  icon: Icon,
  win,
  active,
  width,
  constraintsRef,
  os,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  children,
}: OsWindowProps) {
  const controls = useDragControls();
  // La posición vive en motion values: framer-motion escribe los deltas del drag aquí,
  // y nosotros podemos animar a 0,0 al maximizar y restaurar después.
  const x = useMotionValue(win.x);
  const y = useMotionValue(win.y);
  const savedPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (win.maximized) {
      savedPos.current = { x: x.get(), y: y.get() };
      animate(x, 0, { duration: 0.22, ease: "easeOut" });
      animate(y, 0, { duration: 0.22, ease: "easeOut" });
    } else if (savedPos.current) {
      const s = savedPos.current;
      animate(x, s.x, { duration: 0.22, ease: "easeOut" });
      animate(y, s.y, { duration: 0.22, ease: "easeOut" });
      savedPos.current = null;
    }
  }, [win.maximized, x, y]);

  return (
    <motion.div
      role="dialog"
      aria-label={title}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: win.minimized ? 0 : 1,
        scale: win.minimized ? 0.9 : 1,
      }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.18 }}
      drag={!win.maximized}
      dragListener={false}
      dragControls={controls}
      dragConstraints={constraintsRef}
      dragElastic={0.06}
      dragMomentum={false}
      onPointerDown={onFocus}
      className={`os-window window-panel ${active ? "os-window-active" : ""} ${
        win.maximized ? "h-full w-full rounded-none" : "max-h-full rounded-xl"
      }`}
      style={{
        x,
        y,
        zIndex: win.z,
        width: win.maximized ? "100%" : `min(${width}px, 96vw)`,
        pointerEvents: win.minimized ? "none" : "auto",
      }}
    >
      {/* Barra de título real: arrastra desde aquí */}
      <div
        className={`title-bar ${active ? "" : "title-bar-inactive"} select-none ${
          win.maximized ? "" : "cursor-grab active:cursor-grabbing touch-none"
        }`}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          if (!win.maximized) controls.start(e);
        }}
        onDoubleClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          onToggleMaximize();
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-4 w-4 shrink-0 text-white/90" aria-hidden="true" />
          <span className="title-bar-caption">{title}</span>
        </div>
        <div className="title-bar-controls">
          <button
            type="button"
            className="tb-btn"
            aria-label={os.minimize}
            onClick={() => { onFocus(); onMinimize(); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            _
          </button>
          <button
            type="button"
            className="tb-btn"
            aria-label={win.maximized ? os.restore : os.maximize}
            onClick={() => { onFocus(); onToggleMaximize(); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {win.maximized ? "▣" : "□"}
          </button>
          <button
            type="button"
            className="tb-btn tb-btn-close"
            aria-label={os.close}
            onClick={onClose}
            onPointerDown={(e) => e.stopPropagation()}
          >
            ×
          </button>
        </div>
      </div>

      {/* Cuerpo con scroll interno */}
      <div className="win-body flex-1 overflow-y-auto px-4 pb-5 pt-4 md:px-6">
        {children}
      </div>
    </motion.div>
  );
}
