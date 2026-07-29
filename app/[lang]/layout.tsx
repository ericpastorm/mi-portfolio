// app/[lang]/layout.tsx
import type { Metadata } from "next";
import { getDictionary } from "../dictionaries";

const SITE_URL = "https://ericpastor.dev";
const SITE_NAME = "Eric Pastor OS";

type Locale = "en" | "es";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const activeLocale: Locale = lang === "en" ? "en" : "es";
  const dictionary = await getDictionary(activeLocale);
  const title = dictionary.metadata?.title ?? "Eric Pastor — Software Developer";
  const description = dictionary.metadata?.description
    ?? "Interactive software portfolio of Eric Pastor, founder of Basalt Works.";
  const canonicalPath = `/${activeLocale}`;
  const locale = activeLocale === "es" ? "es_ES" : "en_US";
  const alternateLocale = activeLocale === "es" ? "en_US" : "es_ES";
  const socialImage = {
    url: `${SITE_URL}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: "Eric Pastor OS — Software, Mobile and AI",
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    applicationName: SITE_NAME,
    authors: [{ name: "Eric Pastor", url: SITE_URL }],
    creator: "Eric Pastor",
    publisher: "Eric Pastor",
    category: "Software development",
    keywords: dictionary.metadata?.keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: "/en",
        es: "/es",
        "x-default": "/es",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonicalPath}`,
      title,
      description,
      siteName: SITE_NAME,
      locale,
      alternateLocale: [alternateLocale],
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default function LocaleLayout({ children }: Props) {
  return children;
}
