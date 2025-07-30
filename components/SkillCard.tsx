// components/SkillCard.tsx

import type { Skill } from '@/data/skills';

export function SkillCard({ icon: Icon, name, color }: Skill) {
  return (
    <div className="group relative flex items-center justify-center p-4 rounded-xl bg-white/5 transition-all duration-300 hover:bg-white/10">
      
      <Icon className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" color={color} />

      <div className="absolute bottom-full mb-2 scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
        <div className="relative rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white shadow-lg border border-zinc-800">
          {name}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 border-b border-r border-zinc-800"></div>
        </div>
      </div>

    </div>
  );
}