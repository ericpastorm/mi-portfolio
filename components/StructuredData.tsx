import { getDictionary } from "@/app/dictionaries";

export default async function StructuredData({ lang }: { lang: 'en' | 'es' }) {
  const dict = await getDictionary(lang);
  
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "name": "Eric Pastor",
        "jobTitle": lang === 'es' ? "Desarrollador de Software" : "Software Developer",
        "url": "https://ericpastor.dev",
        "image": "https://ericpastor.dev/favicon.webp",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Tarragona",
          "addressCountry": "ES"
        },
        "sameAs": [
          "https://github.com/ericpastorm",
          "https://www.linkedin.com/in/ericpastor" 
        ]
      },
      {
        "@type": "WebSite",
        "url": "https://ericpastor.dev",
        "name": "Eric Pastor Portfolio",
        "description": dict.metadata?.description,
        "inLanguage": lang
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
