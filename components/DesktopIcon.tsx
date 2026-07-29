// components/DesktopIcon.tsx
"use client";

import type { LucideIcon } from "lucide-react";

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export function DesktopIcon({ icon: Icon, label, selected, onSelect, onOpen }: DesktopIconProps) {
  return (
    <button
      type="button"
      className={`desktop-icon ${selected ? "selected" : ""}`}
      onClick={() => {
        onSelect();
        onOpen();
      }}
      aria-label={label}
      aria-pressed={selected}
    >
      <span className="desktop-icon-tile">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
}
