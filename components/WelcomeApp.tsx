// components/WelcomeApp.tsx
"use client";

import { useId, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { RichText } from "./RichText";
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

interface PlayerSliderProps {
  id: string;
  label: string;
  ariaLabel: string;
  min: number;
  max: number;
  value: number;
  valueText: string;
  ariaValueText: string;
  centered?: boolean;
  onChange: (value: number) => void;
}

function PlayerSlider({
  id,
  label,
  ariaLabel,
  min,
  max,
  value,
  valueText,
  ariaValueText,
  centered = false,
  onChange,
}: PlayerSliderProps) {
  const progress = ((value - min) / (max - min)) * 100;
  const fillStart = centered ? Math.min(50, progress) : 0;
  const fillWidth = centered ? Math.abs(progress - 50) : progress;

  return (
    <div className="player-slider">
      <div className="player-slider-heading">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="slider-readout">
          {valueText}
        </output>
      </div>
      <div className="y2k-range-shell">
        <div className="y2k-range-track" aria-hidden="true">
          <span
            className="y2k-range-fill"
            style={{ left: `${fillStart}%`, width: `${fillWidth}%` }}
          />
          {centered && <span className="y2k-range-center" />}
        </div>
        <input
          id={id}
          className="y2k-range"
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          aria-label={ariaLabel}
          aria-valuetext={ariaValueText}
          onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        />
      </div>
    </div>
  );
}

export function WelcomeApp({ dict, maximized = false }: { dict: Dictionary; maximized?: boolean }) {
  const volumeId = useId();
  const balanceId = useId();
  const [volume, setVolume] = useState(62);
  const [balance, setBalance] = useState(0);

  const balanceValueText = balance > 0 ? `+${balance}` : `${balance}`;
  const balanceAriaText = balance === 0
    ? "Centered"
    : `${Math.abs(balance)} ${balance < 0 ? "left" : "right"}`;

  return (
    <div
      className={`welcome-app ${maximized ? "welcome-app-maximized" : "welcome-app-restored"}`}
      data-maximized={maximized}
    >
      <div className="welcome-shell">
        {/* Pantalla LCD */}
        <div className="lcd welcome-lcd">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="status-dot-ping absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                <span className="status-dot relative inline-flex h-2 w-2 rounded-full" />
              </span>
              <span className="truncate uppercase">{dict.hero.availability}</span>
              <span className="lcd-cursor" aria-hidden="true">▮</span>
            </div>
            <div className="mt-1.5 text-[0.62rem] tracking-wider opacity-80 md:text-xs">
              TGN·ES · 41.1°N 1.1°E · 320KBPS 48KHZ · CH.01
            </div>
          </div>
          <div className="eq shrink-0" aria-hidden="true">
            <span /><span /><span /><span /><span /><span /><span />
          </div>
        </div>

        <div className="welcome-main">
          <div className="welcome-copy">
            <h1 className="welcome-heading font-display chrome-text">
              {dict.hero.greeting}
            </h1>
            <p className="welcome-description text-muted">
              <RichText text={dict.hero.description} />
            </p>
          </div>

          {/* Botones transport: sociales */}
          <motion.div
            className="welcome-socials"
            variants={iconContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="welcome-panel-label" aria-hidden="true">NET://LINKS</span>
            <motion.a
              href="https://github.com/ericpastorm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="btn-transport flex h-12 w-12 items-center justify-center md:h-14 md:w-14"
              variants={iconVariants}
            >
              <Github className="h-6 w-6" />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/eric-pastor-moreno"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="btn-transport flex h-12 w-12 items-center justify-center md:h-14 md:w-14"
              variants={iconVariants}
            >
              <Linkedin className="h-6 w-6" />
            </motion.a>
            <motion.a
              href="mailto:hello@ericpastor.dev"
              aria-label="Email"
              className="btn-transport flex h-12 w-12 items-center justify-center md:h-14 md:w-14"
              variants={iconVariants}
            >
              <Mail className="h-6 w-6" />
            </motion.a>
          </motion.div>
        </div>

        {/* Controles del reproductor */}
        <div className="welcome-deck">
          <PlayerSlider
            id={volumeId}
            label="VOL"
            ariaLabel="Volume"
            min={0}
            max={100}
            value={volume}
            valueText={`${volume}%`}
            ariaValueText={`${volume} percent`}
            onChange={setVolume}
          />
          <div className="welcome-modes" aria-hidden="true">
            <span className="project-tag">PL</span>
            <span className="project-tag">ML</span>
            <span className="project-tag">EQ</span>
          </div>
          <PlayerSlider
            id={balanceId}
            label="BAL"
            ariaLabel="Stereo balance"
            min={-50}
            max={50}
            value={balance}
            valueText={balanceValueText}
            ariaValueText={balanceAriaText}
            centered
            onChange={setBalance}
          />
        </div>
      </div>
    </div>
  );
}
