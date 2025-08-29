// app/dictionaries.ts
import 'server-only';
 
// Definimos los tipos para asegurarnos de que solo usamos 'en' o 'es'.
type Locale = 'en' | 'es';

const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  es: () => import('../dictionaries/es.json').then((module) => module.default),
};
 
export const getDictionary = async (locale: Locale) => dictionaries[locale]();