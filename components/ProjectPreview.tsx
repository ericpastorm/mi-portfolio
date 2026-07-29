"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import type { LocalizedProject } from "@/types";

interface ProjectPreviewProps {
  project: LocalizedProject;
  className?: string;
  refreshKey?: number;
}

export function ProjectPreview({ project, className = "", refreshKey = 0 }: ProjectPreviewProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [project.image, refreshKey]);

  const initials = project.title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span className={`project-preview project-preview-${project.id} ${className}`}>
      {!failed && (
        <img
          key={`${project.image}-${refreshKey}`}
          src={project.image}
          alt={`${project.title} project preview`}
          className="project-preview-image"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
      <span className="project-preview-fallback" aria-hidden="true">
        <span className="project-preview-orb" />
        <ImageOff className="project-preview-fallback-icon" aria-hidden="true" />
        <span className="project-preview-initials">{initials}</span>
        <span className="project-preview-grid" />
      </span>
    </span>
  );
}
