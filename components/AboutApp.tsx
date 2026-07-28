// components/AboutApp.tsx
"use client";

import { skillsData } from '@/data/skills';
import { SkillCard } from '@/components/SkillCard';
import type { Dictionary } from "@/types";

export function AboutApp({ dict }: { dict: Dictionary }) {
  const totalSkills = skillsData.reduce((n, c) => n + c.skills.length, 0);

  const renderWithAccent = (text: string) => {
    return text.split(/(<accent>.*?<\/accent>)/).map((part, index) => {
      if (part.startsWith('<accent>') && part.endsWith('</accent>')) {
        const content = part.replace(/<\/?accent>/g, '');
        return (
          <span key={index} className="chrome-accent">
            {content}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div>
      <div className="text-base md:text-lg text-muted leading-relaxed space-y-5 max-w-3xl">
        <p>{dict.about.description1}</p>
        <p>{renderWithAccent(dict.about.description2)}</p>
        <p>{dict.about.description3}</p>
      </div>

      {/* Panel inset de skills */}
      <div className="inset-panel mt-8 p-5 md:p-6">
        <div className="flex items-center justify-between mb-6" aria-hidden="true">
          <span className="text-[0.62rem] font-bold tracking-[0.22em] text-subtle uppercase">dir://skills</span>
          <span className="text-[0.62rem] font-bold tracking-[0.22em] text-subtle uppercase">{totalSkills} items</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-9">
          {skillsData.map((category) => (
            <div key={category.titleKey}>
              <h3 className="led-chip mb-5">{dict.skills[category.titleKey]}</h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {category.skills.map((skill) => (
                  <SkillCard
                    key={skill.name}
                    name={skill.name}
                    icon={skill.icon}
                    color={skill.color}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
