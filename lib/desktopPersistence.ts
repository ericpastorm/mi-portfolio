// lib/desktopPersistence.ts
// Persistencia del escritorio: posiciones libres de los iconos y nombre de
// usuario. Claves versionadas siguiendo la convención `portfolio:sketchpad:v1`.

export const DESKTOP_ICONS_KEY = "portfolio:desktop-icons:v1";
export const USER_NAME_KEY = "portfolio:user-name:v1";

export const DEFAULT_USER_NAME = "Eric Pastor";

/** Umbral de arrastre de iconos (px): por debajo, el gesto es un clic. */
export const ICON_DRAG_THRESHOLD = 5;
/** Umbral para iniciar la selección por marquee (px). */
export const MARQUEE_THRESHOLD = 4;

export interface DesktopIconPosition {
  x: number;
  y: number;
}

export type DesktopIconPositions = Record<string, DesktopIconPosition>;

interface IconPositionsPayload {
  version: 1;
  positions: DesktopIconPositions;
}

interface UserNamePayload {
  version: 1;
  name: string;
}

export function loadIconPositions(): DesktopIconPositions | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DESKTOP_ICONS_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as Partial<IconPositionsPayload>;
    if (payload?.version !== 1 || !payload.positions) return null;
    const positions: DesktopIconPositions = {};
    for (const [id, value] of Object.entries(payload.positions)) {
      if (value && typeof value.x === "number" && typeof value.y === "number") {
        positions[id] = { x: value.x, y: value.y };
      }
    }
    return Object.keys(positions).length > 0 ? positions : null;
  } catch {
    return null;
  }
}

export function saveIconPositions(positions: DesktopIconPositions): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      DESKTOP_ICONS_KEY,
      JSON.stringify({ version: 1, positions } satisfies IconPositionsPayload),
    );
  } catch {
    // Almacenamiento no disponible (modo privado, etc.): se ignora.
  }
}

export function clearIconPositions(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DESKTOP_ICONS_KEY);
  } catch {
    // noop
  }
}

export function loadUserName(): string {
  if (typeof window === "undefined") return DEFAULT_USER_NAME;
  try {
    const raw = window.localStorage.getItem(USER_NAME_KEY);
    if (!raw) return DEFAULT_USER_NAME;
    const payload = JSON.parse(raw) as Partial<UserNamePayload>;
    if (payload?.version !== 1 || typeof payload.name !== "string") {
      return DEFAULT_USER_NAME;
    }
    const name = payload.name.trim();
    return name.length > 0 ? name : DEFAULT_USER_NAME;
  } catch {
    return DEFAULT_USER_NAME;
  }
}

export function saveUserName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      USER_NAME_KEY,
      JSON.stringify({ version: 1, name: name.trim() } satisfies UserNamePayload),
    );
  } catch {
    // noop
  }
}

export function clearUserName(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(USER_NAME_KEY);
  } catch {
    // noop
  }
}

/** Iniciales derivadas del nombre (primeras letras de la primera y última palabra). */
export function userInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "EP";
  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : "";
  const initials = (first + last).toUpperCase();
  return initials || "EP";
}
