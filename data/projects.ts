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
    title: "ICOREVEN",
    description: "Desarrollo de una web corporativa con un enfoque dual: atraer inversores para su modelo de negocio y captar clientes para sus servicios de reforma, todo optimizado con SEO y copywriting.",
    tags: ["Wordpress", "Elementor", "SEO", "Copywriting"],
    demoUrl: "https://icoreven.com/", 
  },
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
];