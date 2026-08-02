// components/Window.tsx
"use client";

import { useEffect, type ReactNode, type RefObject } from "react";
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
  height: number;
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
  onPositionChange: (x: number, y: number) => void;
  bodyClassName?: string;
  children: ReactNode;
}

export function OsWindow({
  title,
  icon: Icon,
  win,
  active,
  width,
  height,
  constraintsRef,
  os,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onPositionChange,
  bodyClassName = "",
  children,
}: OsWindowProps) {
  const controls = useDragControls();
  const x = useMotionValue(win.maximized ? 0 : win.x);
  const y = useMotionValue(win.maximized ? 0 : win.y);
  const isInternalApp = bodyClassName
    .split(/\s+/)
    .includes("win-body-internal-app");
  const isImmediateForeground = win.maximized && isInternalApp;

  useEffect(() => {
    animate(x, win.maximized ? 0 : win.x, { duration: 0.22, ease: "easeOut" });
    animate(y, win.maximized ? 0 : win.y, { duration: 0.22, ease: "easeOut" });
  }, [win.maximized, win.x, win.y, x, y]);

  return (
    <motion.div
      role="dialog"
      aria-label={title}
      aria-hidden={win.minimized}
      inert={win.minimized ? true : undefined}
      initial={
        isImmediateForeground
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.92 }
      }
      animate={{
        opacity: win.minimized ? 0 : 1,
        scale: isImmediateForeground ? 1 : win.minimized ? 0.9 : 1,
      }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.18 }}
      drag={!win.maximized}
      dragListener={false}
      dragControls={controls}
      dragConstraints={constraintsRef}
      dragElastic={0.06}
      dragMomentum={false}
      onDragEnd={() => onPositionChange(x.get(), y.get())}
      onPointerDown={onFocus}
      className={`os-window window-panel ${active ? "os-window-active" : ""} ${
        isInternalApp ? "os-window-internal-app" : ""
      } ${
        win.maximized
          ? "os-window-maximized h-full w-full rounded-none"
          : "max-h-full rounded-xl"
      }`}
      style={{
        x,
        y,
        zIndex: win.z,
        width: win.maximized ? "100%" : `min(${width}px, 96vw)`,
        height: win.maximized ? "100%" : `min(${height}px, 100%)`,
        maxHeight: "100%",
        pointerEvents: win.minimized ? "none" : "auto",
        visibility: win.minimized ? "hidden" : "visible",
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
      <div
        className={`win-body min-h-0 flex-1 ${
          bodyClassName || "overflow-y-auto px-3 pb-4 pt-3 md:px-6 md:pb-5 md:pt-4"
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}
