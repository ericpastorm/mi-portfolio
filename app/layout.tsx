// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const switzer = localFont({
  src: './fonts/Switzer-Variable.woff2',
  display: 'swap',
  variable: '--font-switzer',
});

export const metadata: Metadata = {
  title: "Eric Pastor - Portfolio",
  description: "Mi portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" suppressHydrationWarning className={switzer.variable}> 
      <body>
        {children}
      </body>
    </html>
  );
}