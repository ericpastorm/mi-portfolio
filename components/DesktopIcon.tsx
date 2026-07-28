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
      // Un clic selecciona; clic sobre uno ya seleccionado (o doble clic) abre.
      // Así el mismo gesto funciona con ratón y con táctil.
      onClick={() => (selected ? onOpen() : onSelect())}
      onDoubleClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      aria-label={label}
    >
      <span className="desktop-icon-tile">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
}
