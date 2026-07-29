import { getDictionary } from "@/app/dictionaries";

const SITE_URL = "https://ericpastor.dev";
const PERSON_ID = `${SITE_URL}/#eric-pastor`;
const BASALT_WORKS_ID = "https://www.basaltworks.com/#organization";

export default async function StructuredData({ lang }: { lang: "en" | "es" }) {
  const dictionary = await getDictionary(lang);
  const inLanguage = lang === "es" ? "es-ES" : "en-US";
  const websiteName = lang === "es"
    ? "Eric Pastor OS — Portfolio interactivo de software"
    : "Eric Pastor OS — Interactive Software Portfolio";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Eric Pastor",
        jobTitle: lang === "es" ? "Desarrollador de software" : "Software Developer",
        url: SITE_URL,
        image: `${SITE_URL}/icons/icon-512.png`,
        homeLocation: {
          "@type": "Place",
          name: "Tarragona, Spain",
        },
        worksFor: { "@id": BASALT_WORKS_ID },
        knowsAbout: [
          "Web development",
          "Mobile app development",
          "React Native",
          "Expo",
          "AI agents",
          "AI automation",
          "Internal business tools",
          "Next.js",
          "TypeScript",
        ],
        sameAs: [
          "https://github.com/ericpastorm",
          "https://www.linkedin.com/in/eric-pastor-moreno",
        ],
      },
      {
        "@type": "Organization",
        "@id": BASALT_WORKS_ID,
        name: "Basalt Works",
        url: "https://www.basaltworks.com/",
        founder: { "@id": PERSON_ID },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: websiteName,
        description: dictionary.metadata?.description,
        inLanguage,
        creator: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        isAccessibleForFree: true,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
