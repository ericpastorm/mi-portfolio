// components/DesktopIcon.tsx
"use client";

import { forwardRef, type CSSProperties, type PointerEvent } from "react";
import type { LucideIcon } from "lucide-react";

interface DesktopIconProps {
  iconId: string;
  icon: LucideIcon;
  label: string;
  selected: boolean;
  featured?: boolean;
  dragging?: boolean;
  style?: CSSProperties;
  onActivate: () => void;
  onPointerDown?: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerMove?: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel?: (event: PointerEvent<HTMLButtonElement>) => void;
}

export const DesktopIcon = forwardRef<HTMLButtonElement, DesktopIconProps>(
  function DesktopIcon(
    {
      iconId,
      icon: Icon,
      label,
      selected,
      featured = false,
      dragging = false,
      style,
      onActivate,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        data-icon-id={iconId}
        className={`desktop-icon ${selected ? "selected" : ""} ${
          featured ? "desktop-icon-featured" : ""
        } ${dragging ? "desktop-icon--dragging" : ""}`}
        style={style}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClick={onActivate}
        aria-label={label}
        aria-pressed={selected}
      >
        <span className="desktop-icon-tile">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <span className="desktop-icon-label">{label}</span>
      </button>
    );
  },
);
