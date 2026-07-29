import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eric Pastor OS — Interactive Software Portfolio",
    short_name: "Eric Pastor OS",
    description: "Interactive Y2K desktop portfolio for Eric Pastor's web, mobile and AI work.",
    start_url: "/es",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#d8f0fb",
    theme_color: "#1d4ed8",
    categories: ["portfolio", "technology", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
