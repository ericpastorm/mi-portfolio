// components/BootSplash.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface BootSplashProps {
  onDone: () => void;
}

export function BootSplash({ onDone }: BootSplashProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2600);
    const skip = () => onDone();
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", skip);
    };
  }, [onDone]);

  return (
    <motion.div
      className="boot-screen"
      onClick={onDone}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="status"
      aria-label="Loading"
    >
      <div className="boot-inner">
        <div className="boot-bios" aria-hidden="true">
          PORTFOLIO BIOS v3.0 — CHECKING MEMORY … OK
          <br />
          DETECTING DISPLAY … AERO-GLASS OK · LOADING ERICPASTOR.EXE
        </div>

        <div className="boot-brand chrome-text">Eric Pastor OS</div>

        <div className="boot-track" aria-hidden="true">
          <div className="boot-blocks">
            <span /><span /><span />
          </div>
        </div>

        <div className="boot-skip" aria-hidden="true">
          PRESS ANY KEY TO SKIP
        </div>
      </div>
    </motion.div>
  );
}
