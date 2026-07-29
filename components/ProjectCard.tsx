// components/ProjectCard.tsx

import { SpotlightCard } from "./SpotlightCard";
import { RichText } from "./RichText";
import { ExternalLink, Github } from "lucide-react";
import type { ProjectItem } from "@/types"; // ✨ Usamos también el tipo oficial

type CardLabels = {
  liveDemo: string;
  viewCode: string;
}

export function ProjectCard({ project, labels }: { project: ProjectItem; labels: CardLabels }) {
  const hasLinks = Boolean(project.demoUrl || project.codeUrl);

  return (
    <SpotlightCard title={<RichText text={project.title} />} titleAs="h3" className="h-full">
      <div className="flex flex-col justify-between h-full px-5 pb-5 pt-4">
        <div>
          <p className="text-secondary text-sm md:text-base mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {(project.tags || []).map((tag) => (
              <span key={tag} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {hasLinks && (
          <div className="flex items-center gap-3 flex-wrap">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" className="flex items-center gap-2 px-5 py-2 rounded-full text-sm btn-primary">
                <ExternalLink className="h-4 w-4" />
                {labels.liveDemo}
              </a>
            )}
            {project.codeUrl && (
              <a href={project.codeUrl} target="_blank" className="flex items-center gap-2 px-5 py-2 rounded-full text-sm btn-metal">
                <Github className="h-4 w-4" />
                {labels.viewCode}
              </a>
            )}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
