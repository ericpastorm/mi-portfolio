// app/[lang]/layout.tsx
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import localFont from "next/font/local";

const switzer = localFont({
  src: '../fonts/Switzer-Variable.woff2',
  display: 'swap',
  variable: '--font-switzer',
});

export const metadata: Metadata = {
  title: "Eric Pastor - Portfolio",
  description: "Mi portfolio",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

// 👇 CORRECCIÓN AQUÍ: Recibimos `params` completo
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