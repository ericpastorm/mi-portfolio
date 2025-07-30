// components/SpotlightCard.tsx

"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    containerRef.current.style.setProperty("--mouse-x", `${e.clientX - left}px`);
    containerRef.current.style.setProperty("--mouse-y", `${e.clientY - top}px`);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`relative p-6 md:p-8 rounded-2xl border bg-zinc-900/70 backdrop-blur-sm overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover/spotlight:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgb(var(--accent) / 0.15), transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}