// components/ProjectsApp.tsx
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  FolderOpen,
  LayoutGrid,
  RefreshCw,
} from "lucide-react";
import {
  getLocalizedProjects,
  hasPublicProjectLink,
  type ProjectId,
} from "@/data/projects";
import { ProjectPreview } from "@/components/ProjectPreview";
import type { Dictionary } from "@/types";

interface ProjectsAppProps {
  dict: Dictionary;
  onOpenProject: (id: ProjectId) => void;
}

export function ProjectsApp({ dict, onOpenProject }: ProjectsAppProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const localizedProjects = getLocalizedProjects(dict);
  const labels = dict.projects.explorer;

  return (
    <section className="project-explorer" aria-label={dict.projects.title}>
      <div className="explorer-toolbar" role="toolbar" aria-label={dict.projects.title}>
        <button type="button" className="explorer-tool" disabled aria-label={labels.back}>
          <ArrowLeft aria-hidden="true" />
          <span>{labels.back}</span>
        </button>
        <button type="button" className="explorer-tool explorer-tool-icon" disabled aria-label={labels.forward}>
          <ArrowRight aria-hidden="true" />
        </button>
        <span className="explorer-separator" aria-hidden="true" />
        <button type="button" className="explorer-tool" disabled aria-label={labels.up}>
          <ArrowUp aria-hidden="true" />
          <span>{labels.up}</span>
        </button>
        <span className="explorer-separator" aria-hidden="true" />
        <button
          type="button"
          className="explorer-tool"
          aria-label={labels.refresh}
          onClick={() => setRefreshKey((value) => value + 1)}
        >
          <RefreshCw aria-hidden="true" />
          <span>{labels.refresh}</span>
        </button>
        <span className="explorer-view-chip" aria-label={labels.thumbnailView}>
          <LayoutGrid aria-hidden="true" />
        </span>
      </div>

      <div className="explorer-address-row">
        <span className="explorer-address-label">{labels.address}</span>
        <div className="explorer-address" role="textbox" aria-readonly="true">
          <FolderOpen aria-hidden="true" />
          <code>C:\Portfolio\Projects</code>
        </div>
      </div>

      <div className="explorer-content">
        <div className="explorer-intro">
          <strong>{dict.projects.title}</strong>
          <span>{dict.projects.subtitle}</span>
        </div>

        <div className="project-file-grid">
          {localizedProjects.map((project) => {
            const extension = project.image.endsWith(".webp") ? "WEBP" : "PNG";
            const status = hasPublicProjectLink(project)
              ? labels.publicStatus
              : labels.privateStatus;

            return (
              <button
                key={project.id}
                type="button"
                className="project-file"
                onClick={() => onOpenProject(project.id)}
                aria-label={`${labels.openProject}: ${project.title}`}
              >
                <ProjectPreview project={project} refreshKey={refreshKey} />
                <span className="project-file-copy">
                  <span className="project-file-name">{project.title}</span>
                  <span className="project-file-meta">
                    {extension} · {status}
                  </span>
                  <span className="project-file-category">
                    {labels.categories[project.category]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="explorer-status" role="status">
        <span>{localizedProjects.length} {labels.objects}</span>
        <span>{labels.ready}</span>
      </div>
    </section>
  );
}
