// components/Desktop.tsx
"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calculator,
  FileImage,
  FolderOpen,
  Mail,
  Monitor,
  Palette,
  User,
  type LucideIcon,
} from "lucide-react";
import { OsWindow, type WindowVisualState } from "./Window";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { BootSplash } from "./BootSplash";
import { WelcomeApp } from "./WelcomeApp";
import { AboutApp } from "./AboutApp";
import { ProjectsApp } from "./ProjectsApp";
import { ProjectDetailApp } from "./ProjectDetailApp";
import { ContactApp } from "./ContactApp";
import { CalculatorApp } from "./internal-apps/calculator/CalculatorApp";
import { SketchpadApp } from "./internal-apps/sketchpad/SketchpadApp";
import { PROJECT_IDS, type ProjectId } from "@/data/projects";
import type { Dictionary } from "@/types";

export type BaseAppId =
  | "welcome"
  | "sketchpadApp"
  | "calculatorApp"
  | "about"
  | "projects"
  | "contact";
export type ProjectWindowId = `project:${ProjectId}`;
export type WindowId = BaseAppId | ProjectWindowId;

interface AppDef {
  icon: LucideIcon;
  desktopTitle: (dict: Dictionary) => string;
  windowTitle: (dict: Dictionary) => string;
  width: number;
  height: number;
}

interface WindowDef {
  icon: LucideIcon;
  title: string;
  width: number;
  height: number;
}

const BASE_APP_DEFS: Record<BaseAppId, AppDef> = {
  welcome: {
    icon: Monitor,
    desktopTitle: (dict) => dict.navigation.home,
    windowTitle: (dict) => dict.navigation.home,
    width: 680,
    height: 620,
  },
  sketchpadApp: {
    icon: Palette,
    desktopTitle: (dict) => dict.internalApps.sketchpad.desktopLabel,
    windowTitle: (dict) => dict.internalApps.sketchpad.windowTitle,
    width: 1040,
    height: 720,
  },
  calculatorApp: {
    icon: Calculator,
    desktopTitle: (dict) => dict.internalApps.calculator.desktopLabel,
    windowTitle: (dict) => dict.internalApps.calculator.windowTitle,
    width: 460,
    height: 700,
  },
  about: {
    icon: User,
    desktopTitle: (dict) => dict.navigation.about,
    windowTitle: (dict) => dict.navigation.about,
    width: 880,
    height: 720,
  },
  projects: {
    icon: FolderOpen,
    desktopTitle: (dict) => dict.navigation.projects,
    windowTitle: (dict) => dict.navigation.projects,
    width: 940,
    height: 680,
  },
  contact: {
    icon: Mail,
    desktopTitle: (dict) => dict.navigation.contact,
    windowTitle: (dict) => dict.navigation.contact,
    width: 820,
    height: 650,
  },
};

const BASE_APP_IDS: BaseAppId[] = [
  "welcome",
  "sketchpadApp",
  "calculatorApp",
  "about",
  "projects",
  "contact",
];
const TASKBAR_H = 48;

const projectWindowId = (projectId: ProjectId): ProjectWindowId => `project:${projectId}`;
const isProjectWindowId = (id: WindowId): id is ProjectWindowId => id.startsWith("project:");
const projectIdFromWindow = (id: ProjectWindowId): ProjectId => id.slice("project:".length) as ProjectId;

const closedWindow = (): WindowVisualState => ({
  open: false,
  minimized: false,
  maximized: false,
  z: 0,
  x: -1,
  y: -1,
});

type WindowMap = Partial<Record<WindowId, WindowVisualState>>;

interface WindowManagerState {
  windows: WindowMap;
  windowIds: WindowId[];
  activeId: WindowId | null;
  nextZ: number;
}

type WindowManagerAction =
  | { type: "open"; id: WindowId; position: { x: number; y: number }; mobile: boolean }
  | { type: "focus"; id: WindowId }
  | { type: "minimize"; id: WindowId }
  | { type: "close"; id: WindowId }
  | { type: "toggleMaximize"; id: WindowId }
  | { type: "move"; id: WindowId; x: number; y: number }
  | { type: "viewport"; width: number; height: number; mobile: boolean };

const initialWindows: WindowMap = {
  welcome: closedWindow(),
  sketchpadApp: closedWindow(),
  calculatorApp: closedWindow(),
  about: closedWindow(),
  projects: closedWindow(),
  contact: closedWindow(),
};

const initialManagerState: WindowManagerState = {
  windows: initialWindows,
  windowIds: [...BASE_APP_IDS],
  activeId: null,
  nextZ: 10,
};

function topVisibleWindow(
  windows: WindowMap,
  windowIds: WindowId[],
  excluded?: WindowId,
): WindowId | null {
  let best: WindowId | null = null;
  let bestZ = -1;

  for (const id of windowIds) {
    if (id === excluded) continue;
    const win = windows[id];
    if (win?.open && !win.minimized && win.z > bestZ) {
      best = id;
      bestZ = win.z;
    }
  }

  return best;
}

function configuredWidth(id: WindowId): number {
  return isProjectWindowId(id) ? 920 : BASE_APP_DEFS[id].width;
}

function windowManagerReducer(
  state: WindowManagerState,
  action: WindowManagerAction,
): WindowManagerState {
  const current = "id" in action ? state.windows[action.id] : undefined;

  switch (action.type) {
    case "open": {
      const previous = current ?? closedWindow();
      const z = state.nextZ + 1;
      const needsPosition = previous.x < 0 || previous.y < 0;
      const windows = {
        ...state.windows,
        [action.id]: {
          ...previous,
          open: true,
          minimized: false,
          maximized: action.mobile ? true : previous.maximized,
          z,
          x: needsPosition ? action.position.x : previous.x,
          y: needsPosition ? action.position.y : previous.y,
        },
      };

      return {
        windows,
        windowIds: state.windowIds.includes(action.id)
          ? state.windowIds
          : [...state.windowIds, action.id],
        activeId: action.id,
        nextZ: z,
      };
    }
    case "focus": {
      if (!current?.open) return state;
      const z = state.nextZ + 1;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...current, minimized: false, z },
        },
        activeId: action.id,
        nextZ: z,
      };
    }
    case "minimize": {
      if (!current?.open) return state;
      const windows = {
        ...state.windows,
        [action.id]: { ...current, minimized: true },
      };
      return {
        ...state,
        windows,
        activeId: state.activeId === action.id
          ? topVisibleWindow(windows, state.windowIds, action.id)
          : state.activeId,
      };
    }
    case "close": {
      if (!current) return state;
      const windows = {
        ...state.windows,
        [action.id]: {
          ...current,
          open: false,
          minimized: false,
          maximized: false,
        },
      };
      return {
        ...state,
        windows,
        activeId: state.activeId === action.id
          ? topVisibleWindow(windows, state.windowIds, action.id)
          : state.activeId,
      };
    }
    case "toggleMaximize":
      if (!current?.open) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...current, maximized: !current.maximized },
        },
      };
    case "move":
      if (!current?.open || current.maximized) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...current, x: action.x, y: action.y },
        },
      };
    case "viewport": {
      const windows = { ...state.windows };
      for (const id of state.windowIds) {
        const win = windows[id];
        if (!win) continue;
        if (action.mobile && win.open) {
          windows[id] = { ...win, maximized: true };
          continue;
        }
        if (win.x < 0 || win.y < 0) continue;
        const renderedWidth = Math.min(configuredWidth(id), action.width * 0.96);
        const maxX = Math.max(0, action.width - renderedWidth);
        const maxY = Math.max(0, action.height - TASKBAR_H - 48);
        windows[id] = {
          ...win,
          x: Math.min(Math.max(0, win.x), maxX),
          y: Math.min(Math.max(0, win.y), maxY),
        };
      }
      return { ...state, windows };
    }
  }
}

function viewportSize() {
  if (typeof window === "undefined") return { width: 1280, height: 800 };
  return {
    width: window.visualViewport?.width ?? window.innerWidth,
    height: window.visualViewport?.height ?? window.innerHeight,
  };
}

function isMobileViewport() {
  if (typeof window === "undefined") return false;
  const viewport = viewportSize();
  return (
    viewport.width < 768 ||
    (viewport.width < 900 && viewport.height < 500)
  );
}

function initialPosition(id: WindowId): { x: number; y: number } {
  const viewport = viewportSize();
  const width = Math.min(configuredWidth(id), viewport.width * 0.96);
  const configuredHeight = isProjectWindowId(id) ? 680 : BASE_APP_DEFS[id].height;
  const height = Math.min(configuredHeight, viewport.height - TASKBAR_H);

  if (id === "welcome") {
    return {
      x: Math.max(8, (viewport.width - width) / 2),
      y: Math.max(8, (viewport.height - TASKBAR_H - height) / 2),
    };
  }

  const index = isProjectWindowId(id)
    ? BASE_APP_IDS.length + PROJECT_IDS.indexOf(projectIdFromWindow(id))
    : BASE_APP_IDS.indexOf(id);

  return {
    x: Math.max(8, Math.min(74 + index * 34, viewport.width - width - 12)),
    y: Math.max(8, Math.min(22 + index * 28, viewport.height - TASKBAR_H - 180)),
  };
}

// Sparkles sutiles sobre el wallpaper
const desktopSparkles = [
  { char: "✦", className: "top-[16%] right-[14%] text-2xl", delay: 0.4, duration: 4.2 },
  { char: "✧", className: "bottom-[24%] right-[8%] text-xl", delay: 1.4, duration: 3.8 },
  { char: "✦", className: "top-[58%] left-[6%] text-lg", delay: 0.9, duration: 4.6 },
];

export function Desktop({ dict }: { dict: Dictionary }) {
  const [mounted, setMounted] = useState(false);
  const [booted, setBooted] = useState(false);
  const [manager, dispatch] = useReducer(windowManagerReducer, initialManagerState);
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<BaseAppId | null>(null);

  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const welcomeOpenedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateViewport = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewport = viewportSize();
        dispatch({
          type: "viewport",
          width: viewport.width,
          height: viewport.height,
          mobile: isMobileViewport(),
        });
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    setStartOpen(false);
    dispatch({
      type: "open",
      id,
      position: initialPosition(id),
      mobile: isMobileViewport(),
    });
  }, []);

  const openStartMenuApp = useCallback((id: string) => {
    setStartOpen(false);
    openWindow(id as BaseAppId);
  }, [openWindow]);

  const openProject = useCallback((id: ProjectId) => {
    openWindow(projectWindowId(id));
  }, [openWindow]);

  // Auto-abrir la ventana de bienvenida tras el boot
  useEffect(() => {
    if (booted && !welcomeOpenedRef.current) {
      welcomeOpenedRef.current = true;
      openWindow("welcome");
    }
  }, [booted, openWindow]);

  const closeWindow = useCallback((id: WindowId) => {
    dispatch({ type: "close", id });
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    dispatch({ type: "focus", id });
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    dispatch({ type: "minimize", id });
  }, []);

  const toggleMaximizeWindow = useCallback((id: WindowId) => {
    dispatch({ type: "toggleMaximize", id });
  }, []);

  const persistWindowPosition = useCallback((id: WindowId, x: number, y: number) => {
    const viewport = viewportSize();
    const width = Math.min(configuredWidth(id), viewport.width * 0.96);
    const maxX = Math.max(0, viewport.width - width);
    const maxY = Math.max(0, viewport.height - TASKBAR_H - 48);
    dispatch({
      type: "move",
      id,
      x: Math.round(Math.min(Math.max(0, x), maxX)),
      y: Math.round(Math.min(Math.max(0, y), maxY)),
    });
  }, []);

  // Clic en taskbar: enfocar/restaurar, o minimizar si ya está activa.
  const handleTaskClick = useCallback((id: WindowId) => {
    const win = manager.windows[id];
    if (!win) return;
    if (manager.activeId === id && !win.minimized) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  }, [manager.windows, manager.activeId, minimizeWindow, focusWindow]);

  // Escape cierra primero Inicio; después, la ventana activa.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (startOpen) {
        setStartOpen(false);
      } else if (manager.activeId) {
        closeWindow(manager.activeId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startOpen, manager.activeId, closeWindow]);

  const finishBoot = useCallback(() => setBooted(true), []);

  const baseAppTitle = (id: BaseAppId) => BASE_APP_DEFS[id].desktopTitle(dict);

  const windowDefinition = (id: WindowId): WindowDef => {
    if (isProjectWindowId(id)) {
      const projectId = projectIdFromWindow(id);
      return {
        icon: FileImage,
        title: dict.projects.items[projectId].title,
        width: 920,
        height: 680,
      };
    }

    const definition = BASE_APP_DEFS[id];
    return {
      icon: definition.icon,
      title: definition.windowTitle(dict),
      width: definition.width,
      height: definition.height,
    };
  };

  const renderWindowBody = (id: WindowId, win: WindowVisualState) => {
    if (isProjectWindowId(id)) {
      return <ProjectDetailApp dict={dict} projectId={projectIdFromWindow(id)} />;
    }

    switch (id) {
      case "welcome":
        return <WelcomeApp dict={dict} maximized={win.maximized} />;
      case "sketchpadApp":
        return <SketchpadApp copy={dict.internalApps.sketchpad.copy} />;
      case "calculatorApp":
        return (
          <CalculatorApp
            copy={dict.internalApps.calculator.copy}
            active={manager.activeId === id && win.open && !win.minimized}
            maximized={win.maximized}
          />
        );
      case "about":
        return <AboutApp dict={dict} />;
      case "projects":
        return <ProjectsApp dict={dict} onOpenProject={openProject} />;
      case "contact":
        return <ContactApp dict={dict} />;
    }
  };

  const taskbarApps = manager.windowIds.flatMap((id) => {
    const win = manager.windows[id];
    if (!win) return [];
    const definition = windowDefinition(id);
    return [{
      id,
      title: definition.title,
      icon: definition.icon,
      open: win.open,
      minimized: win.minimized,
    }];
  });

  return (
    <main className="os-desktop">
      {/* Wallpaper Bliss + velo nocturno */}
      <div className="os-wallpaper hero-field" aria-hidden="true">
        <div className="hero-field-night" />
      </div>

      {/* Burbujas de cromo + sparkles */}
      <div aria-hidden="true" className="bubble-deco hidden h-32 w-32 right-[6%] top-[10%] md:block" />
      <div aria-hidden="true" className="bubble-deco hidden h-16 w-16 right-[22%] bottom-[18%] md:block" />
      {desktopSparkles.map((sparkle, index) => (
        <motion.span
          key={index}
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

      {/* Los límites de arrastre incluyen la zona bajo la taskbar. */}
      <div ref={dragBoundsRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Área de escritorio utilizable, siempre por encima de la taskbar. */}
      <div
        className="desktop-workspace"
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) setSelectedIcon(null);
        }}
      >
        {mounted && booted && (
          <>
            <div className="desktop-icons">
              {BASE_APP_IDS.map((id) => (
                <DesktopIcon
                  key={id}
                  icon={BASE_APP_DEFS[id].icon}
                  label={baseAppTitle(id)}
                  selected={selectedIcon === id}
                  featured={id === "sketchpadApp" || id === "calculatorApp"}
                  onSelect={() => setSelectedIcon(id)}
                  onOpen={() => openWindow(id)}
                />
              ))}
            </div>

            <AnimatePresence>
              {manager.windowIds.map((id) => {
                const win = manager.windows[id];
                if (!win?.open) return null;
                const definition = windowDefinition(id);
                const bodyClassName = id === "projects"
                  ? "win-body-explorer"
                  : isProjectWindowId(id)
                    ? "win-body-project overflow-y-auto"
                    : id === "sketchpadApp"
                      ? "win-body-internal-app win-body-sketchpad"
                      : id === "calculatorApp"
                        ? "win-body-internal-app win-body-calculator"
                        : "";

                return (
                  <OsWindow
                    key={id}
                    title={definition.title}
                    icon={definition.icon}
                    win={win}
                    active={manager.activeId === id && !win.minimized}
                    width={definition.width}
                    height={definition.height}
                    constraintsRef={dragBoundsRef}
                    os={dict.os}
                    bodyClassName={bodyClassName}
                    onFocus={() => focusWindow(id)}
                    onClose={() => closeWindow(id)}
                    onMinimize={() => minimizeWindow(id)}
                    onToggleMaximize={() => toggleMaximizeWindow(id)}
                    onPositionChange={(x, y) => persistWindowPosition(id, x, y)}
                  >
                    {renderWindowBody(id, win)}
                  </OsWindow>
                );
              })}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Inicio solo muestra aplicaciones base; los proyectos viven en taskbar. */}
      {startOpen && (
        <StartMenu
          apps={BASE_APP_IDS.map((id) => ({
            id,
            title: baseAppTitle(id),
            icon: BASE_APP_DEFS[id].icon,
          }))}
          onOpenApp={openStartMenuApp}
          onClose={() => setStartOpen(false)}
        />
      )}

      <Taskbar
        apps={taskbarApps}
        activeId={manager.activeId}
        startOpen={startOpen}
        startLabel={dict.os.start}
        taskbarLabel={dict.os.taskbar}
        clockLabel={dict.os.clock}
        themeSwitcherLabel={dict.hero.changeTheme}
        onStartToggle={() => setStartOpen((value) => !value)}
        onTaskClick={(id) => handleTaskClick(id as WindowId)}
      />

      <AnimatePresence>
        {!booted && <BootSplash onDone={finishBoot} />}
      </AnimatePresence>
    </main>
  );
}
