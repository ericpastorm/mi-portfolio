// components/Taskbar.tsx
"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";

export interface TaskbarApp {
  id: string;
  title: string;
  icon: LucideIcon;
  open: boolean;
  minimized: boolean;
}

interface TaskbarProps {
  apps: TaskbarApp[];
  activeId: string | null;
  startOpen: boolean;
  startLabel: string;
  themeSwitcherLabel: string;
  onStartToggle: () => void;
  onTaskClick: (id: string) => void;
}

function TrayClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const text = now
    ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    : "--:--:--";

  return (
    <span className="led-chip tray-clock" aria-label="Clock">
      {text}
    </span>
  );
}

export function Taskbar({
  apps,
  activeId,
  startOpen,
  startLabel,
  themeSwitcherLabel,
  onStartToggle,
  onTaskClick,
}: TaskbarProps) {
  const openApps = apps.filter((a) => a.open);

  return (
    <div className="taskbar">
      <button
        type="button"
        className={`start-btn ${startOpen ? "open" : ""}`}
        onClick={onStartToggle}
        aria-expanded={startOpen}
      >
        <span aria-hidden="true">✦</span>
        {startLabel}
      </button>

      <div className="task-buttons">
        {openApps.map((app) => (
          <button
            key={app.id}
            type="button"
            className={`task-btn ${activeId === app.id && !app.minimized ? "active" : ""}`}
            onClick={() => onTaskClick(app.id)}
          >
            <app.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{app.title}</span>
          </button>
        ))}
      </div>

      <div className="tray">
        <TrayClock />
        <LanguageSwitcher />
        <ThemeSwitcher ariaLabel={themeSwitcherLabel} />
      </div>
    </div>
  );
}
