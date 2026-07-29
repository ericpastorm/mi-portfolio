import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import "./globals.css";

const SITE_URL = "https://ericpastor.dev";

const switzer = localFont({
  src: "./fonts/Switzer-Variable.woff2",
  display: "swap",
  variable: "--font-switzer",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Eric Pastor OS",
  description: "Interactive software portfolio of Eric Pastor, founder of Basalt Works.",
  applicationName: "Eric Pastor OS",
  authors: [{ name: "Eric Pastor", url: SITE_URL }],
  creator: "Eric Pastor",
  publisher: "Eric Pastor",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const lang = requestHeaders.get("x-site-locale") === "en" ? "en" : "es";

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
