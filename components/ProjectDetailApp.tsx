"use client";

import { ArrowUpRight, Github, Radio, Sparkles } from "lucide-react";
import { getLocalizedProject, type ProjectId } from "@/data/projects";
import { ProjectPreview } from "@/components/ProjectPreview";
import { RichText } from "@/components/RichText";
import type { Dictionary } from "@/types";

export function ProjectDetailApp({ dict, projectId }: { dict: Dictionary; projectId: ProjectId }) {
  const project = getLocalizedProject(dict, projectId);
  const explorer = dict.projects.explorer;

  return (
    <article className="project-detail">
      <div className="project-detail-visual">
        <ProjectPreview project={project} className="project-detail-preview" />
        <div className="project-detail-visual-meta">
          <span><Radio aria-hidden="true" />{project.demoUrl ? explorer.publicStatus : explorer.privateStatus}</span>
          <span>{project.image.split(".").pop()?.toUpperCase()} {explorer.screenshot}</span>
        </div>
      </div>

      <div className="project-detail-copy">
        <div className="project-detail-kicker">
          <span>{explorer.categories[project.category]}</span>
          <span className="project-detail-index">{String(projectId).toUpperCase()}</span>
        </div>

        <h2 className="project-detail-title font-display">
          <RichText text={project.title} />
        </h2>
        <p className="project-detail-description">{project.description}</p>

        {project.metric && (
          <div className="project-detail-metric">
            <Sparkles aria-hidden="true" />
            <strong>{project.metric}</strong>
          </div>
        )}

        <ul className="project-detail-tags" aria-label={explorer.technologies}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>

        {(project.demoUrl || project.codeUrl) && (
          <div className="project-detail-actions">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target={project.demoUrl === "#" ? undefined : "_blank"}
                rel={project.demoUrl === "#" ? undefined : "noopener noreferrer"}
                className="project-action project-action-primary"
              >
                {dict.projects.liveDemo}
                <ArrowUpRight aria-hidden="true" />
              </a>
            )}
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action project-action-secondary"
              >
                <Github aria-hidden="true" />
                {dict.projects.viewCode}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
