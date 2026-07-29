// components/SkillCard.tsx

import type { Skill } from '@/data/skills';

export function SkillCard({ icon: Icon, name, color }: Skill) {
  return (
    <div className="skill-card group relative flex min-h-13 items-center justify-center p-2.5 md:p-4">

      <Icon className="h-8 w-8 transition-transform duration-200 group-hover:scale-110" color={color} />

      <div className="absolute bottom-full mb-2 scale-90 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 z-20">
        <div className="relative rounded-md tooltip-background px-3 py-1.5 text-sm font-medium border">
          {name}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 tooltip-arrow border-b border-r"></div>
        </div>
      </div>

    </div>
  );
}
