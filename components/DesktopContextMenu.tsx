// components/DesktopContextMenu.tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";

export interface DesktopContextMenuItem {
  key: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  separatorBefore?: boolean;
  disabled?: boolean;
}

interface DesktopContextMenuProps {
  x: number;
  y: number;
  items: DesktopContextMenuItem[];
  ariaLabel: string;
  onClose: () => void;
}

const MENU_MARGIN = 8;

export function DesktopContextMenu({ x, y, items, ariaLabel, onClose }: DesktopContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  // Mide el menú y lo reencuadra dentro del viewport antes del primer paint.
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const left = Math.min(
      Math.max(MENU_MARGIN, x),
      Math.max(MENU_MARGIN, viewportWidth - rect.width - MENU_MARGIN),
    );
    const top = Math.min(
      Math.max(MENU_MARGIN, y),
      Math.max(MENU_MARGIN, viewportHeight - rect.height - MENU_MARGIN),
    );
    setPosition({ x: Math.round(left), y: Math.round(top) });
  }, [x, y]);

  // Al abrir, el foco cae en el primer elemento activo.
  useEffect(() => {
    const first = itemRefs.current.find((el) => el && !el.disabled);
    first?.focus();
  }, []);

  const moveFocus = (fromIndex: number, direction: 1 | -1) => {
    const count = items.length;
    for (let step = 1; step <= count; step += 1) {
      const next = (fromIndex + direction * step + count) % count;
      const el = itemRefs.current[next];
      if (el && !el.disabled) {
        el.focus();
        return;
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key === "Tab") {
      onClose();
      return;
    }
    const currentIndex = itemRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(Math.max(0, currentIndex), 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(Math.max(0, currentIndex), -1);
    } else if (event.key === "Home") {
      event.preventDefault();
      itemRefs.current.find((el) => el && !el.disabled)?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      [...itemRefs.current].reverse().find((el) => el && !el.disabled)?.focus();
    }
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={ariaLabel}
      className="desktop-context-menu"
      style={{ left: x, top: y, ...(position ? { left: position.x, top: position.y } : {}) }}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => (
        <div key={item.key} className="desktop-context-item-wrap">
          {item.separatorBefore ? <div className="desktop-context-separator" role="separator" /> : null}
          <button
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            type="button"
            role="menuitem"
            className="desktop-context-item"
            disabled={item.disabled}
            onClick={item.onSelect}
          >
            <span className="desktop-context-item-icon">
              <item.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="desktop-context-item-label">{item.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
