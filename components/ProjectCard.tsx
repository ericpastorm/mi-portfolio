// components/ProjectCard.tsx

import type { ProjectType } from "@/data/projects";
import { SpotlightCard } from "./SpotlightCard";
import { ExternalLink, Github } from "lucide-react";

export function ProjectCard({ project }: { project: ProjectType }) {
  return (
    <SpotlightCard className="group/spotlight h-full border-[rgb(var(--accent))]/30">
      <div className="flex flex-col justify-between h-full p-6">
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">{project.title}</h3>
          <p className="text-secondary mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs font-medium project-tag rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-lg text-black font-bold bg-[rgb(30,244,174)] hover:bg-[rgb(30,244,174)]/90 transition-colors">
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
          {project.codeUrl && (
            <a href={project.codeUrl} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-lg panel-background transition-colors">
              <Github className="h-4 w-4" />
              View Code
            </a>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}