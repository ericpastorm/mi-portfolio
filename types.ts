// types.ts

// Primero, definimos cómo es un solo proyecto dentro de la lista de "items"
export interface ProjectItem {
  title: string;
  description: string;
  tags?: string[];
  demoUrl?: string | null;
  codeUrl?: string | null;
}

// Ahora, definimos la estructura completa de nuestro diccionario de traducciones
export interface Dictionary {
  navigation: {
    home: string;
    about: string;
    projects: string;
    contact: string;
  };
  hero: {
    availability: string;
    greeting: string;
    description: string;
    changeTheme: string;
  };
  about: {
    title: string;
    description1: string;
    description2: string;
  };
  skills: {
    [key: string]: string; // Para claves dinámicas como 'frontend', 'backend', etc.
  };
  projects: {
    title: string;
    subtitle: string;
    liveDemo: string;
    viewCode: string;
    items: Record<string, ProjectItem>; // Un objeto donde cada clave es un string y el valor es un ProjectItem
  };
  contact: {
    title: string;
    description: string;
    location: string;
    form: {
      title: string;
      name: string;
      email: string;
      message: string;
      send: string;
    };
  };
  footer: {
    designed: string;
    rights: string;
  };
}