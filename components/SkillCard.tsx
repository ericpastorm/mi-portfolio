// components/SkillCard.tsx

import type { Skill } from '@/data/skills';

export function SkillCard({ icon: Icon, name, color }: Skill) {
  return (
    <div className="group relative flex items-center justify-center p-4 rounded-xl skill-card transition-all duration-300">
      
      <Icon className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" color={color} />

      <div className="absolute bottom-full mb-2 scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
        <div className="relative rounded-md tooltip-background px-3 py-1.5 text-sm font-medium shadow-lg border">
          {name}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 tooltip-arrow border-b border-r"></div>
        </div>
      </div>

    </div>
  );
}