// components/SpotlightCard.tsx

"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Si se pasa, el panel se corona con una barra de título estilo software */
  title?: string;
  /** Nivel semántico del caption de la barra de título */
  titleAs?: "h2" | "h3";
  /** Aplica la textura de gotas de agua (Frutiger Aero) al panel */
  texture?: boolean;
}

export function SpotlightCard({ children, className = "", title, titleAs: TitleTag = "h2", texture = false }: SpotlightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 80, damping: 16 }}
      className={`window-panel ${texture ? "texture-droplets" : ""} ${className}`}
    >
      {title && (
        <div className="title-bar">
          <TitleTag className="title-bar-caption">{title}</TitleTag>
          <div className="title-bar-controls" aria-hidden="true">
            <span className="tb-btn">_</span>
            <span className="tb-btn">□</span>
            <span className="tb-btn">×</span>
          </div>
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
