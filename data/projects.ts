// data/projects.ts

import type { Dictionary, LocalizedProject } from "@/types";

/** Stable IDs and display order for every project in the portfolio. */
export const PROJECT_IDS = [
  "basaltworks",
  "primehomes",
  "gaelsantano",
  "cydservicios",
  "icoreven",
  "portfolio",
  "sketchpad",
  "calculatorx",
] as const;

export type ProjectId = (typeof PROJECT_IDS)[number];

export type ProjectCategory = "agency" | "automation" | "client" | "personal";

export interface ProjectMetadata {
  id: ProjectId;
  image: `/projects/${string}`;
  category: ProjectCategory;
  demoUrl?: string;
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
  portfolio: {
    id: "portfolio",
    image: "/projects/portfolio.webp",
    category: "personal",
    demoUrl: "#",
    codeUrl: "https://github.com/ericpastorm/mi-portfolio",
  },
  sketchpad: {
    id: "sketchpad",
    image: "/projects/sketchpad.webp",
    category: "personal",
    demoUrl: "https://ericpastorm.github.io/sketchpad/",
    codeUrl: "https://github.com/ericpastorm/sketchpad",
  },
  calculatorx: {
    id: "calculatorx",
    image: "/projects/calculatorx.webp",
    category: "personal",
    demoUrl: "https://ericpastorm.github.io/CalculatorX/",
    codeUrl: "https://github.com/ericpastorm/CalculatorX/",
  },
};

/** Ordered metadata without relying on object insertion order. */
export const projects = PROJECT_IDS.map((id) => PROJECT_METADATA[id]);

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
