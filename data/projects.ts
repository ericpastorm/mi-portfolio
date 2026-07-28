// data/projects.ts

export type ProjectType = {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  codeUrl?: string;
};

// URLs canónicas de cada proyecto. Los textos (título/descripción/tags)
// viven en dictionaries/*.json y se renderizan desde ahí; este archivo
// sirve de referencia de los enlaces por proyecto.
export const projectLinks: Record<string, { demoUrl?: string; codeUrl?: string }> = {
  basaltworks: {
    demoUrl: "https://basaltworks.com/",
  },
  primehomes: {
    // Herramienta interna — sin demo pública.
  },
  gaelsantano: {
    demoUrl: "https://gaelsantano.com/",
  },
  cydservicios: {
    demoUrl: "https://cydservicios.com/",
  },
  icoreven: {
    demoUrl: "https://icoreven.com/",
  },
  portfolio: {
    demoUrl: "#",
    codeUrl: "https://github.com/ericpastorm/mi-portfolio",
  },
  sketchpad: {
    demoUrl: "https://ericpastorm.github.io/sketchpad/",
    codeUrl: "https://github.com/ericpastorm/sketchpad",
  },
  calculatorx: {
    demoUrl: "https://ericpastorm.github.io/CalculatorX/",
    codeUrl: "https://github.com/ericpastorm/CalculatorX/",
  },
};
