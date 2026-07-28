// components/HomePageClient.tsx
"use client";

import { Desktop } from "@/components/Desktop";
import type { Dictionary } from "@/types";

export function HomePageClient({ dict }: { dict: Dictionary }) {
  return <Desktop dict={dict} />;
}
