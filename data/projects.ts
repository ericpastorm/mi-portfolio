// data/projects.ts

import type { Dictionary, LocalizedProject } from "@/types";

/** Stable IDs and display order for every project in the portfolio. */
export const PROJECT_IDS = [
  "basaltworks",
  "primehomes",
  "spindone",
  "animalgacha",
  "dungeonquiz",
  "gaelsantano",
  "cydservicios",
  "icoreven",
  "sketchpad",
] as const;

export type ProjectId = (typeof PROJECT_IDS)[number];

export type ProjectCategory =
  | "agency"
  | "automation"
  | "mobileApp"
  | "mobileGame"
  | "client"
  | "personal";

export interface ProjectMetadata {
  id: ProjectId;
  image: `/projects/${string}`;
  category: ProjectCategory;
  demoUrl?: string;
  productUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  codeUrl?: string;
}

/**
 * Non-localized project facts. Localized titles, descriptions, metrics, and
 * tags remain in dictionaries/*.json and are joined by the stable ID.
 */
export const PROJECT_METADATA: Record<ProjectId, ProjectMetadata> = {
  basaltworks: {
    id: "basaltworks",
    image: "/projects/basaltworks.png",
    category: "agency",
    demoUrl: "https://basaltworks.com/",
  },
  primehomes: {
    id: "primehomes",
    image: "/projects/primehomes.webp",
    category: "automation",
  },
  spindone: {
    id: "spindone",
    image: "/projects/spindone.webp",
    category: "mobileApp",
    productUrl: "https://www.basaltworks.com/spindone",
    appStoreUrl: "https://apps.apple.com/app/id6760219447",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.basaltworks.spindone",
  },
  animalgacha: {
    id: "animalgacha",
    image: "/projects/animal-gacha.webp",
    category: "mobileGame",
    productUrl: "https://animalgacha.com/",
    appStoreUrl: "https://apps.apple.com/app/animal-gacha-wildlife-cards/id6770243368",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.basaltworks.animalgacha",
  },
  dungeonquiz: {
    id: "dungeonquiz",
    image: "/projects/dungeonquiz.webp",
    category: "mobileGame",
    productUrl: "https://www.basaltworks.com/dungeon-quiz",
    appStoreUrl: "https://apps.apple.com/app/dungeon-quiz-level-up/id6762605745",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.basaltworks.dungeonquiz",
  },
  gaelsantano: {
    id: "gaelsantano",
    image: "/projects/gaelsantano.webp",
    category: "client",
    demoUrl: "https://gaelsantano.com/",
  },
  cydservicios: {
    id: "cydservicios",
    image: "/projects/cydservicios.webp",
    category: "client",
    demoUrl: "https://cydservicios.com/",
  },
  icoreven: {
    id: "icoreven",
    image: "/projects/icoreven.webp",
    category: "client",
    demoUrl: "https://icoreven.com/",
  },
  sketchpad: {
    id: "sketchpad",
    image: "/projects/sketchpad.webp",
    category: "personal",
    demoUrl: "https://ericpastorm.github.io/sketchpad/",
    codeUrl: "https://github.com/ericpastorm/sketchpad",
  },
};

/** Ordered metadata without relying on object insertion order. */
export const projects = PROJECT_IDS.map((id) => PROJECT_METADATA[id]);

type ProjectLinks = Pick<
  ProjectMetadata,
  "demoUrl" | "productUrl" | "appStoreUrl" | "playStoreUrl" | "codeUrl"
>;

export function hasPublicProjectLink(project: ProjectLinks): boolean {
  return Boolean(
    project.demoUrl
    || project.productUrl
    || project.appStoreUrl
    || project.playStoreUrl
    || project.codeUrl,
  );
}

export function getLocalizedProject(dict: Dictionary, id: ProjectId): LocalizedProject {
  const metadata = PROJECT_METADATA[id];
  const copy = dict.projects.items[id];

  return {
    ...metadata,
    title: copy.title,
    description: copy.description,
    tags: copy.tags ?? [],
    metric: copy.metric,
  };
}

export function getLocalizedProjects(dict: Dictionary): LocalizedProject[] {
  return PROJECT_IDS.map((id) => getLocalizedProject(dict, id));
}
