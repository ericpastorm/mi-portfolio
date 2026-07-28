// components/ProjectsApp.tsx
"use client";

import { ProjectCarousel } from "@/components/ProjectCarousel";
import type { Dictionary } from "@/types";

export function ProjectsApp({ dict }: { dict: Dictionary }) {
  const projectsArray = Object.values(dict.projects.items).map((project) => ({
    ...project,
    tags: project.tags ?? [],
    demoUrl: project.demoUrl ?? undefined,
    codeUrl: project.codeUrl ?? undefined,
  }));
  const projectLabels = {
    liveDemo: dict.projects.liveDemo,
    viewCode: dict.projects.viewCode,
  };

  return (
    <div>
      <p className="text-base md:text-lg text-secondary mb-8">
        {dict.projects.subtitle}
      </p>
      <ProjectCarousel projects={projectsArray} labels={projectLabels} />
    </div>
  );
}
