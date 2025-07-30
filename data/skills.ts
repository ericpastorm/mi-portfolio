// data/skills.ts

import {
  SiJavascript, SiTypescript, SiReact, SiHtml5, SiCss3, SiSass, SiTailwindcss,
  SiNodedotjs, SiExpress, SiNextdotjs, SiPython, SiMongodb, SiFirebase,
  SiGit, SiGithub, SiPostman, SiVercel, SiFigma
} from 'react-icons/si';

export type Skill = {
  name: string;
  icon: React.ComponentType<{ className?: string, color?: string }>;
  color?: string;
};

export type SkillCategory = {
  title: string;
  skills: Skill[];
};

export const skillsData: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss3, color: "#1572B6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8" },
      { name: "Sass", icon: SiSass, color: "#CC6699" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express", icon: SiExpress, color: "#000000" }, 
      { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
    ],
  },
  {
    title: "Bases de Datos",
    skills: [
        { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
        { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
    ],
  },
  {
    title: "Herramientas y Diseño",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#181717" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "Vercel", icon: SiVercel, color: "#000000" },
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
    ],
  },
];