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
    tags: ["React Native", "Tailwind CSS", "Vite"],
    demoUrl: "https://ericpastorm.github.io/sketchpad/",
    codeUrl: "https://github.com/ericpastorm/sketchpad",
  },
  {
    title: "E-commerce de Ropa",
    description: "Plataforma de comercio electrónico completa con carrito de compras, pasarela de pago y panel de administración de productos.",
    tags: ["WooCommerce", "PHP", "JavaScript"],
  },
  {
    title: "Clon de Spotify",
    description: "Un proyecto para practicar el consumo de APIs y la gestión de estado global en una aplicación de música.",
    tags: ["React", "Spotify API", "Zustand"],
    codeUrl: "#",
  },
];