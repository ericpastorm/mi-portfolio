// components/AboutApp.tsx
"use client";

import { skillsData } from '@/data/skills';
import { SkillCard } from '@/components/SkillCard';
import { RichText } from '@/components/RichText';
import type { Dictionary } from "@/types";

export function AboutApp({ dict }: { dict: Dictionary }) {
  const totalSkills = skillsData.reduce((n, c) => n + c.skills.length, 0);

  return (
    <div className="about-app">
      <div className="about-copy max-w-3xl space-y-3 text-sm leading-relaxed text-muted md:space-y-5 md:text-lg">
        <p>{dict.about.description1}</p>
        <p><RichText text={dict.about.description2} /></p>
        <p>{dict.about.description3}</p>
      </div>

      {/* Panel inset de skills */}
      <div className="about-skills inset-panel mt-5 p-3 md:mt-8 md:p-6">
        <div className="mb-4 flex items-center justify-between md:mb-6" aria-hidden="true">
          <span className="text-[0.62rem] font-bold tracking-[0.22em] text-subtle uppercase">dir://skills</span>
          <span className="text-[0.62rem] font-bold tracking-[0.22em] text-subtle uppercase">{totalSkills} items</span>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 md:gap-y-9">
          {skillsData.map((category) => (
            <div key={category.titleKey}>
              <h3 className="led-chip mb-3 md:mb-5">{dict.skills[category.titleKey]}</h3>
              <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5 md:grid-cols-6 md:gap-3">
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
