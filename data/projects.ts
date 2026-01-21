// data/projects.ts

export type ProjectType = {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  codeUrl?: string;
};

// Function to get projects data with translations
export const getProjectsData = (t: any): ProjectType[] => [
  {
    title: t('projects.items.basaltworks.title'),
    description: t('projects.items.basaltworks.description'),
    tags: ["React", "Next.js", "Tailwind CSS"],
    demoUrl: "https://basaltworks.com/",
  },
  {
    title: t('projects.items.gaelxdesigns.title'),
    description: t('projects.items.gaelxdesigns.description'),
    tags: ["Next.js", "Tailwind CSS", "Sanity"],
    demoUrl: "https://gaelxdesigns.com/",
  },
  {
    title: t('projects.items.cydservicios.title'),
    description: t('projects.items.cydservicios.description'),
    tags: ["Astro", "Tailwind CSS"],
    demoUrl: "https://cydservicios.com/",
  },
  {
    title: t('projects.items.icoreven.title'),
    description: t('projects.items.icoreven.description'),
    tags: ["Wordpress", "Elementor", "SEO", "Copywriting"],
    demoUrl: "https://icoreven.com/", 
  },
  {
    title: t('projects.items.portfolio.title'),
    description: t('projects.items.portfolio.description'),
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    demoUrl: "#", 
    codeUrl: "https://github.com/ericpastorm/mi-portfolio", 
  },
  {
    title: t('projects.items.sketchpad.title'),
    description: t('projects.items.sketchpad.description'),
    tags: ["React", "Tailwind CSS", "Vite"],
    demoUrl: "https://ericpastorm.github.io/sketchpad/",
    codeUrl: "https://github.com/ericpastorm/sketchpad",
  },
  {
    title: t('projects.items.calculatorx.title'),
    description: t('projects.items.calculatorx.description'),
    tags: ["Vite", "Tailwind CSS", "JavaScript"],
    demoUrl: "https://github.com/ericpastorm/CalculatorX",
    codeUrl: "https://ericpastorm.github.io/CalculatorX/",
  },
];