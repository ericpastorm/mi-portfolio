// components/Desktop.tsx
"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calculator,
  FileImage,
  FolderOpen,
  Mail,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Sun,
  User,
  UserRoundPen,
  type LucideIcon,
} from "lucide-react";
import { OsWindow, type WindowVisualState } from "./Window";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { DesktopContextMenu, type DesktopContextMenuItem } from "./DesktopContextMenu";
import { UserNameDialog } from "./UserNameDialog";
import { THEME_CHANGE_EVENT, applyTheme } from "./ThemeSwitcher";
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
import {
  DEFAULT_USER_NAME,
  ICON_DRAG_THRESHOLD,
  MARQUEE_THRESHOLD,
  clearIconPositions,
  clearUserName,
  loadIconPositions,
  loadUserName,
  saveIconPositions,
  saveUserName,
  userInitials,
  type DesktopIconPositions,
} from "@/lib/desktopPersistence";

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
  const [selectedIcons, setSelectedIcons] = useState<BaseAppId[]>([]);
  const [iconPositions, setIconPositions] = useState<DesktopIconPositions | null>(null);
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [initials, setInitials] = useState(userInitials(DEFAULT_USER_NAME));
  const [renameOpen, setRenameOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [marquee, setMarquee] = useState<{
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  } | null>(null);
  const [draggingIcon, setDraggingIcon] = useState<BaseAppId | null>(null);

  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const welcomeOpenedRef = useRef(false);
  const iconRefs = useRef<Partial<Record<BaseAppId, HTMLButtonElement | null>>>({});
  const iconPositionsRef = useRef<DesktopIconPositions | null>(null);
  const dragStateRef = useRef<{
    id: BaseAppId;
    pointerId: number;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef<BaseAppId | null>(null);
  const marqueeStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    iconRects: {
      id: BaseAppId;
      left: number;
      top: number;
      right: number;
      bottom: number;
    }[];
  } | null>(null);

  // Mantiene el ref de posiciones sincronizado con el estado (los gestos
  // leen iconPositionsRef para no depender del último render).
  useEffect(() => {
    iconPositionsRef.current = iconPositions;
  }, [iconPositions]);

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

  // Sincroniza el tema del menú contextual con el switch de la taskbar.
  useEffect(() => {
    const syncDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    syncDark();
    window.addEventListener(THEME_CHANGE_EVENT, syncDark);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, syncDark);
  }, []);

  // Nombre de usuario persistido.
  useEffect(() => {
    const stored = loadUserName();
    setUserName(stored);
    setInitials(userInitials(stored));
  }, []);

  // Posiciones de iconos persistidas: se restauran antes del primer render
  // de iconos, así la primera visita con datos guardados ya sale en modo libre.
  useEffect(() => {
    const stored = loadIconPositions();
    if (stored) {
      iconPositionsRef.current = stored;
      setIconPositions(stored);
    }
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

  /* ============ ICONOS EN POSICIÓN LIBRE ============ */

  const isIconSelected = (id: BaseAppId) => selectedIcons.includes(id);

  /** Tamaño real del icono (desktop 86px; móvil, ancho de celda). */
  const iconElementSize = (id: BaseAppId) => {
    const el = iconRefs.current[id];
    return { width: el?.offsetWidth ?? 86, height: el?.offsetHeight ?? 78 };
  };

  /** Mantiene el icono dentro del workspace (nunca bajo la taskbar). */
  const clampIconPoint = useCallback((x: number, y: number, width: number, height: number) => {
    const workspace = workspaceRef.current;
    if (!workspace) return { x: Math.round(x), y: Math.round(y) };
    const rect = workspace.getBoundingClientRect();
    return {
      x: Math.round(Math.min(Math.max(0, x), Math.max(0, rect.width - width))),
      y: Math.round(Math.min(Math.max(0, y), Math.max(0, rect.height - height))),
    };
  }, []);

  /** Rect del icono relativo al workspace, medido en vivo desde el DOM. */
  const measureIconRect = useCallback((id: BaseAppId) => {
    const el = iconRefs.current[id];
    const workspace = workspaceRef.current;
    if (!el || !workspace) return null;
    const wsRect = workspace.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left - wsRect.left,
      top: rect.top - wsRect.top,
      right: rect.left - wsRect.left + rect.width,
      bottom: rect.top - wsRect.top + rect.height,
    };
  }, []);

  const persistIconPositions = useCallback(() => {
    if (iconPositionsRef.current) saveIconPositions(iconPositionsRef.current);
  }, []);

  const resetIconPositions = useCallback(() => {
    clearIconPositions();
    iconPositionsRef.current = null;
    setIconPositions(null);
    setSelectedIcons([]);
  }, []);

  // Arrastre de iconos con captura de puntero: umbral de 5px para no
  // interferir con el clic que abre la aplicación.
  const handleIconPointerDown = useCallback(
    (id: BaseAppId, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;
      const el = iconRefs.current[id];
      const workspace = workspaceRef.current;
      if (!el || !workspace) return;
      const wsRect = workspace.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      dragStateRef.current = {
        id,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: rect.left - wsRect.left,
        startTop: rect.top - wsRect.top,
        moved: false,
      };
      setSelectedIcons([id]);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const handleIconPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragStateRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.max(Math.abs(dx), Math.abs(dy)) < ICON_DRAG_THRESHOLD) return;

      const workspace = workspaceRef.current;
      if (!workspace) return;
      const size = iconElementSize(drag.id);

      if (!drag.moved) {
        drag.moved = true;
        setDraggingIcon(drag.id);
        // El cambio de flujo a libre es sin salto: el icono queda donde estaba.
        const positions = { ...(iconPositionsRef.current ?? {}) };
        positions[drag.id] = clampIconPoint(drag.startLeft, drag.startTop, size.width, size.height);
        iconPositionsRef.current = positions;
        setIconPositions(positions);
      }

      const positions = { ...(iconPositionsRef.current ?? {}) };
      positions[drag.id] = clampIconPoint(
        drag.startLeft + dx,
        drag.startTop + dy,
        size.width,
        size.height,
      );
      iconPositionsRef.current = positions;
      setIconPositions(positions);
    },
    [clampIconPoint],
  );

  const endIconDrag = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragStateRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      dragStateRef.current = null;
      setDraggingIcon(null);
      if (drag.moved) {
        // El clic tras un arrastre no debe abrir la aplicación.
        suppressClickRef.current = drag.id;
        persistIconPositions();
      }
    },
    [persistIconPositions],
  );

  const cancelIconDrag = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragStateRef.current = null;
    setDraggingIcon(null);
  }, []);

  /* ============ SELECCIÓN MÚLTIPLE (MARQUEE) ============ */

  const intersectsRect = (
    a: { x0: number; y0: number; x1: number; y1: number },
    b: { left: number; top: number; right: number; bottom: number },
  ) => a.x0 <= b.right && a.x1 >= b.left && a.y0 <= b.bottom && a.y1 >= b.top;

  const handleWorkspacePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      // Solo botón primario y solo sobre el lienzo del escritorio: nunca
      // desde iconos, ventanas, Inicio o el menú contextual.
      if (event.button !== 0) return;
      if (
        target.closest(".desktop-icon") ||
        target.closest(".os-window") ||
        target.closest(".start-menu") ||
        target.closest(".desktop-context-menu")
      ) {
        return;
      }
      const workspace = workspaceRef.current;
      if (!workspace) return;
      const wsRect = workspace.getBoundingClientRect();

      // Un clic en vacío limpia la selección.
      setContextMenu(null);
      setSelectedIcons([]);

      const rects = BASE_APP_IDS.map((id) => {
        const rect = measureIconRect(id);
        return rect ? { id, ...rect } : null;
      }).filter(
        (rect): rect is { id: BaseAppId; left: number; top: number; right: number; bottom: number } =>
          rect !== null,
      );

      marqueeStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX - wsRect.left,
        startY: event.clientY - wsRect.top,
        iconRects: rects,
      };
      workspace.setPointerCapture(event.pointerId);
    },
    [measureIconRect],
  );

  const handleWorkspacePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const marqueeState = marqueeStateRef.current;
    if (!marqueeState || event.pointerId !== marqueeState.pointerId) return;
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const wsRect = workspace.getBoundingClientRect();
    const x = event.clientX - wsRect.left;
    const y = event.clientY - wsRect.top;
    const dx = x - marqueeState.startX;
    const dy = y - marqueeState.startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < MARQUEE_THRESHOLD) return;

    const rect = {
      x0: Math.min(marqueeState.startX, x),
      y0: Math.min(marqueeState.startY, y),
      x1: Math.max(marqueeState.startX, x),
      y1: Math.max(marqueeState.startY, y),
    };
    setMarquee(rect);
    const selection = marqueeState.iconRects
      .filter((icon) => intersectsRect(rect, icon))
      .map((icon) => icon.id);
    setSelectedIcons(selection);
  }, []);

  const endMarquee = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const marqueeState = marqueeStateRef.current;
    if (!marqueeState || event.pointerId !== marqueeState.pointerId) return;
    marqueeStateRef.current = null;
    setMarquee(null);
  }, []);

  // Reencuadra los iconos libres cuando cambia el viewport.
  useEffect(() => {
    const onResize = () => {
      if (!iconPositionsRef.current) return;
      const workspace = workspaceRef.current;
      if (!workspace) return;
      const clamped: DesktopIconPositions = {};
      let changed = false;
      for (const [id, position] of Object.entries(iconPositionsRef.current)) {
        const size = iconElementSize(id as BaseAppId);
        const next = clampIconPoint(position.x, position.y, size.width, size.height);
        clamped[id] = next;
        if (next.x !== position.x || next.y !== position.y) changed = true;
      }
      iconPositionsRef.current = clamped;
      if (changed) {
        setIconPositions(clamped);
        saveIconPositions(clamped);
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [clampIconPoint]);

  /* ============ MENÚ CONTEXTUAL DEL ESCRITORIO ============ */

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  // Cierra con clic/contextmenu fuera, scroll o pérdida de foco de ventana.
  useEffect(() => {
    if (!contextMenu) return;
    const close = (event: PointerEvent | MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".desktop-context-menu")) return;
      setContextMenu(null);
    };
    const closeOnScroll = () => setContextMenu(null);
    window.addEventListener("pointerdown", close, true);
    window.addEventListener("contextmenu", close, true);
    window.addEventListener("scroll", closeOnScroll, true);
    window.addEventListener("blur", closeOnScroll);
    return () => {
      window.removeEventListener("pointerdown", close, true);
      window.removeEventListener("contextmenu", close, true);
      window.removeEventListener("scroll", closeOnScroll, true);
      window.removeEventListener("blur", closeOnScroll);
    };
  }, [contextMenu]);

  const handleWorkspaceContextMenu = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    // Solo en el lienzo del escritorio: nunca dentro de ventanas, Inicio,
    // el propio menú o campos de texto.
    if (
      target.closest(".os-window") ||
      target.closest(".start-menu") ||
      target.closest(".desktop-context-menu") ||
      target.closest("input, textarea, select, [contenteditable='true']")
    ) {
      return;
    }
    event.preventDefault();
    const iconTarget = target.closest<HTMLElement>("[data-icon-id]");
    const iconId = iconTarget?.dataset.iconId as BaseAppId | undefined;
    if (iconId) {
      setSelectedIcons((prev) => (prev.includes(iconId) ? prev : [...prev, iconId]));
    }
    setContextMenu({ x: event.clientX, y: event.clientY });
  }, []);

  /* ============ NOMBRE DE USUARIO ============ */

  const handleSaveUserName = useCallback((name: string) => {
    const normalized = name.trim();
    if (normalized.length === 0 || normalized === DEFAULT_USER_NAME) {
      clearUserName();
      setUserName(DEFAULT_USER_NAME);
      setInitials(userInitials(DEFAULT_USER_NAME));
    } else {
      saveUserName(normalized);
      setUserName(normalized);
      setInitials(userInitials(normalized));
    }
    setRenameOpen(false);
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

  // Escape cierra por niveles: diálogo de nombre → menú contextual → Inicio →
  // selección de iconos → ventana activa.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (renameOpen) {
        setRenameOpen(false);
      } else if (contextMenu) {
        setContextMenu(null);
      } else if (startOpen) {
        setStartOpen(false);
      } else if (selectedIcons.length > 0) {
        setSelectedIcons([]);
      } else if (manager.activeId) {
        closeWindow(manager.activeId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [renameOpen, contextMenu, startOpen, selectedIcons, manager.activeId, closeWindow]);

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

  const contextMenuItems: DesktopContextMenuItem[] = [
    {
      key: "rename-user",
      label: dict.os.contextMenu.changeUserName,
      icon: UserRoundPen,
      onSelect: () => {
        setContextMenu(null);
        setRenameOpen(true);
      },
    },
    {
      key: "toggle-theme",
      label: isDark ? dict.os.contextMenu.themeToLight : dict.os.contextMenu.themeToDark,
      icon: isDark ? Sun : Moon,
      onSelect: () => {
        setContextMenu(null);
        applyTheme(isDark ? "light" : "dark");
      },
    },
    {
      key: "reset-icons",
      label: dict.os.contextMenu.resetIconPositions,
      icon: RotateCcw,
      separatorBefore: true,
      onSelect: () => {
        setContextMenu(null);
        resetIconPositions();
      },
    },
    {
      key: "open-sketchpad",
      label: dict.internalApps.sketchpad.desktopLabel,
      icon: Palette,
      separatorBefore: true,
      onSelect: () => {
        setContextMenu(null);
        openWindow("sketchpadApp");
      },
    },
    {
      key: "open-calculator",
      label: dict.internalApps.calculator.desktopLabel,
      icon: Calculator,
      onSelect: () => {
        setContextMenu(null);
        openWindow("calculatorApp");
      },
    },
  ];

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
        ref={workspaceRef}
        className="desktop-workspace"
        onPointerDown={handleWorkspacePointerDown}
        onPointerMove={handleWorkspacePointerMove}
        onPointerUp={endMarquee}
        onPointerCancel={endMarquee}
        onContextMenu={handleWorkspaceContextMenu}
      >
        {mounted && booted && (
          <>
            <div className={`desktop-icons${iconPositions ? " desktop-icons--free" : ""}`}>
              {BASE_APP_IDS.map((id) => {
                const position = iconPositions?.[id];
                return (
                  <DesktopIcon
                    key={id}
                    ref={(el) => {
                      iconRefs.current[id] = el;
                    }}
                    iconId={id}
                    icon={BASE_APP_DEFS[id].icon}
                    label={baseAppTitle(id)}
                    selected={isIconSelected(id)}
                    featured={id === "sketchpadApp" || id === "calculatorApp"}
                    dragging={draggingIcon === id}
                    style={position ? { left: position.x, top: position.y } : undefined}
                    onActivate={() => {
                      // Tras un arrastre real, el clic de cierre no abre la app.
                      if (suppressClickRef.current === id) {
                        suppressClickRef.current = null;
                        return;
                      }
                      setSelectedIcons([id]);
                      openWindow(id);
                    }}
                    onPointerDown={(event) => handleIconPointerDown(id, event)}
                    onPointerMove={(event) => handleIconPointerMove(event)}
                    onPointerUp={(event) => endIconDrag(event)}
                    onPointerCancel={(event) => cancelIconDrag(event)}
                  />
                );
              })}
            </div>

            {marquee && (
              <div
                className="desktop-marquee"
                aria-hidden="true"
                style={{
                  left: marquee.x0,
                  top: marquee.y0,
                  width: marquee.x1 - marquee.x0,
                  height: marquee.y1 - marquee.y0,
                }}
              />
            )}

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
          userName={userName}
          initials={initials}
          renameLabel={dict.os.userName.change}
          onOpenApp={openStartMenuApp}
          onRename={() => {
            setStartOpen(false);
            setRenameOpen(true);
          }}
          onClose={() => setStartOpen(false)}
        />
      )}

      {contextMenu && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          ariaLabel={dict.os.contextMenu.menuLabel}
          onClose={closeContextMenu}
        />
      )}

      {renameOpen && (
        <UserNameDialog
          initialName={userName}
          copy={dict.os.userName}
          onSave={handleSaveUserName}
          onCancel={() => setRenameOpen(false)}
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
