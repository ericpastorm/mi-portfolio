// types.ts

import type { ProjectCategory, ProjectId } from "@/data/projects";
import type { CalculatorCopy } from "@/components/internal-apps/calculator/CalculatorApp";
import type { SketchpadCopy } from "@/components/internal-apps/sketchpad/SketchpadApp";

/** Localized copy stored under projects.items in each dictionary. */
export interface ProjectItem {
  title: string;
  description: string;
  tags?: string[];
  demoUrl?: string | null;
  codeUrl?: string | null;
  metric?: string;
}

/** Complete project model consumed by the explorer and detail windows. */
export interface LocalizedProject extends ProjectItem {
  id: ProjectId;
  image: `/projects/${string}`;
  category: ProjectCategory;
  tags: string[];
  demoUrl?: string;
  productUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  codeUrl?: string;
}

/** Localized registration and in-app copy for a built-in desktop utility. */
export interface InternalAppDictionary<TCopy> {
  desktopLabel: string;
  windowTitle: string;
  copy: TCopy;
}

// Ahora, definimos la estructura completa de nuestro diccionario de traducciones
export interface Dictionary {
  metadata?: {
    title: string;
    description: string;
    keywords?: string[];
  };
  navigation: {
    home: string;
    about: string;
    projects: string;
    contact: string;
  };
  hero: {
    availability: string;
    greeting: string;
    description: string;
    changeTheme: string;
  };
  about: {
    title: string;
    description1: string;
    description2: string;
    description3: string;
  };
  skills: {
    [key: string]: string; // Para claves dinámicas como 'frontend', 'backend', etc.
  };
  projects: {
    title: string;
    subtitle: string;
    liveDemo: string;
    productPage: string;
    appStore: string;
    googlePlay: string;
    viewCode: string;
    explorer: {
      back: string;
      forward: string;
      up: string;
      refresh: string;
      address: string;
      objects: string;
      ready: string;
      openProject: string;
      publicStatus: string;
      privateStatus: string;
      screenshot: string;
      thumbnailView: string;
      technologies: string;
      categories: Record<ProjectCategory, string>;
    };
    items: Record<ProjectId, ProjectItem>;
  };
  contact: {
    title: string;
    description: string;
    location: string;
    form: {
      title: string;
      name: string;
      email: string;
      message: string;
      send: string;
    };
  };
  internalApps: {
    sketchpad: InternalAppDictionary<SketchpadCopy>;
    calculator: InternalAppDictionary<CalculatorCopy>;
  };
  footer: {
    designed: string;
    rights: string;
  };
  os: {
    start: string;
    minimize: string;
    maximize: string;
    restore: string;
    close: string;
    taskbar: string;
    clock: string;
    userName: {
      change: string;
      dialogTitle: string;
      dialogDescription: string;
      nameLabel: string;
      placeholder: string;
      save: string;
      cancel: string;
    };
    contextMenu: {
      menuLabel: string;
      changeUserName: string;
      themeToDark: string;
      themeToLight: string;
      resetIconPositions: string;
    };
  };
}
