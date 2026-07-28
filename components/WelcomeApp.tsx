// components/WelcomeApp.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import type { Dictionary } from "@/types";

const iconContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.4 },
  },
};

const iconVariants: Variants = {
  hidden: { y: 24, opacity: 0, scale: 0.8 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

export function WelcomeApp({ dict }: { dict: Dictionary }) {
  const renderWithAccent = (text: string) => {
    return text.split(/(<accent>.*?<\/accent>)/).map((part, index) => {
      if (part.startsWith('<accent>') && part.endsWith('</accent>')) {
        const content = part.replace(/<\/?accent>/g, '');
        return (
          <span key={index} className="chrome-accent">
            {content}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div>
      {/* Pantalla LCD */}
      <div className="lcd px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm md:text-base flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full status-dot-ping opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 status-dot"></span>
            </span>
            <span className="truncate uppercase">{dict.hero.availability}</span>
            <span className="lcd-cursor" aria-hidden="true">▮</span>
          </div>
          <div className="text-[0.62rem] md:text-xs opacity-80 mt-1.5 tracking-wider">
            TGN·ES · 41.1°N 1.1°E · 320KBPS 48KHZ · CH.01
          </div>
        </div>
        <div className="eq shrink-0" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span />
        </div>
      </div>

      {/* Titular cromado */}
      <h1 className="font-display chrome-text text-3xl sm:text-4xl md:text-5xl font-bold text-center mt-7 pb-3 leading-tight">
        {dict.hero.greeting}
      </h1>
      <p className="text-center text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
        {renderWithAccent(dict.hero.description)}
      </p>

      {/* Botones transport: sociales */}
      <motion.div
        className="mt-8 flex items-center justify-center gap-6"
        variants={iconContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.a
          href="https://github.com/ericpastorm"
          target="_blank"
          aria-label="GitHub"
          className="btn-transport flex h-14 w-14 items-center justify-center"
          variants={iconVariants}
        >
          <Github className="h-6 w-6" />
        </motion.a>
        <motion.a
          href="https://linkedin.com/in/eric-pastor-moreno"
          target="_blank"
          aria-label="LinkedIn"
          className="btn-transport flex h-14 w-14 items-center justify-center"
          variants={iconVariants}
        >
          <Linkedin className="h-6 w-6" />
        </motion.a>
        <motion.a
          href="mailto:hello@ericpastor.dev"
          aria-label="Email"
          className="btn-transport flex h-14 w-14 items-center justify-center"
          variants={iconVariants}
        >
          <Mail className="h-6 w-6" />
        </motion.a>
      </motion.div>

      {/* Sliders decorativos + botones de utilidad */}
      <div className="mt-8 flex items-center justify-between gap-5" aria-hidden="true">
        <div className="flex-1 max-w-[130px]">
          <div className="text-[0.58rem] font-bold text-subtle tracking-[0.2em] mb-1.5">VOL</div>
          <div className="slider"><div className="slider-thumb" style={{ left: '62%' }} /></div>
        </div>
        <div className="flex gap-2">
          <span className="project-tag">PL</span>
          <span className="project-tag">ML</span>
          <span className="project-tag">EQ</span>
        </div>
        <div className="flex-1 max-w-[130px]">
          <div className="text-[0.58rem] font-bold text-subtle tracking-[0.2em] mb-1.5 text-right">BAL</div>
          <div className="slider"><div className="slider-thumb" style={{ left: '38%' }} /></div>
        </div>
      </div>
    </div>
  );
}
