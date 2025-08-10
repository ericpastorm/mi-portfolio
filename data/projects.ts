// data/projects.ts

export type ProjectType = {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  codeUrl?: string;
};

export const projectsData: ProjectType[] = [
  {
    title: "Mi Portfolio Personal",
    description: "Una web personal para mostrar mis habilidades y proyectos, construida con las últimas tecnologías del ecosistema de React.",
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    demoUrl: "#", 
    codeUrl: "https://github.com/ericpastorm/mi-portfolio", 
  },
  {
    title: "Sketchpad",
    description: "Un bloc de dibujo online para dar rienda suelta a tu creatividad. Dibuja, colorea y exporta tus creaciones.",
    tags: ["React", "Tailwind CSS", "Vite"],
    demoUrl: "https://ericpastorm.github.io/sketchpad/",
    codeUrl: "https://github.com/ericpastorm/sketchpad",
  },
  {
    title: "CalculatorX",
    description: "Una calculadora web moderna y completa con un modo examen interactivo donde practicar matemáticas.",
    tags: ["Vite", "Tailwind CSS", "JavaScript"],
    demoUrl: "https://github.com/ericpastorm/CalculatorX",
    codeUrl: "https://ericpastorm.github.io/CalculatorX/",
  },
  {
    title: "Clon de Spotify",
    description: "Un proyecto para practicar el consumo de APIs y la gestión de estado global en una aplicación de música.",
    tags: ["React", "Spotify API", "Zustand"],
    codeUrl: "#",
  },
];