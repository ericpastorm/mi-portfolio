// data/skills.ts

import {
  SiJavascript, SiTypescript, SiReact, SiHtml5, SiCss3, SiSass, SiTailwindcss,
  SiNodedotjs, SiNextdotjs, SiPython, SiMongodb, SiFirebase,
  SiGit, SiGithub, SiVercel, SiFigma, SiBootstrap, SiDocker, SiVite, SiDjango, SiPostgresql, SiSupabase, SiAdobeillustrator
} from 'react-icons/si';

export type Skill = {
  name: string;
  icon: React.ComponentType<{ className?: string, color?: string }>;
  color?: string;
};

export type SkillCategory = {
  titleKey: string; // Changed from 'title' to 'titleKey' for i18n
  skills: Skill[];
};

export const skillsData: SkillCategory[] = [
  {
    titleKey: "frontend",
    skills: [
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss3, color: "#1572B6" },
      { name: "Sass", icon: SiSass, color: "#CC6699" },
      { name: "Bootstrap", icon: SiBootstrap, color: "#563D7C" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
    ],
  },
  {
    titleKey: "backend",
    skills: [
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3a79c1" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
      { name: "Vite", icon: SiVite, color: "#fcd14f" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Django", icon: SiDjango, color: "#224e44" },
    ],
  },
  {
    titleKey: "databases",
    skills: [
        { name: "Postgresql", icon: SiPostgresql, color: "#37618f" },
        { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
        { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
        { name: "Supabase", icon: SiSupabase, color: "#61ca93" },
    ],
  },
  {
    titleKey: "toolsAndDesign",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#181717" },
      { name: "Vercel", icon: SiVercel, color: "#000000" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
      { name: "Illustrator", icon: SiAdobeillustrator, color: "#f79f35" },
    ],
  },
];