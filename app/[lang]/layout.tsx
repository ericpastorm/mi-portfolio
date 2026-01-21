// app/[lang]/layout.tsx
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import localFont from "next/font/local";
import { getDictionary } from "../dictionaries";

const switzer = localFont({
  src: '../fonts/Switzer-Variable.woff2',
  display: 'swap',
  variable: '--font-switzer',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getDictionary(lang as 'en' | 'es');
  
  // Use metadata from dictionaries if available, otherwise fallback to defaults
  const title = t.metadata?.title || "Eric Pastor | Software Developer";
  const description = t.metadata?.description || "Portfolio of Eric Pastor, a multiplatform software developer.";
  
  return {
    title,
    description,
    metadataBase: new URL('https://ericpastor.dev'),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'es': '/es',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://ericpastor.dev/${lang}`,
      siteName: 'Eric Pastor Portfolio',
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    keywords: t.metadata?.keywords,
  };
}

export default async function RootLayout({ 
  children, 
  params 
}: Props) {
  const { lang } = await params; // Resolve the promise to access `lang`

  return (
    <html lang={lang} suppressHydrationWarning className={switzer.variable}> 
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}