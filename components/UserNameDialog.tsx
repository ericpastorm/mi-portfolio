// components/UserNameDialog.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { UserRoundPen, X } from "lucide-react";
import type { RenameDialogCopy } from "@/types";

interface UserNameDialogProps {
  initialName: string;
  copy: RenameDialogCopy;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function UserNameDialog({ initialName, copy, onSave, onCancel }: UserNameDialogProps) {
  const [value, setValue] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const submit = () => onSave(value);

  return (
    <div
      className="os-dialog-overlay"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        className="os-dialog window-panel rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-label={copy.dialogTitle}
        onKeyDown={(event) => {
          if (event.key === "Escape") onCancel();
        }}
      >
        <div className="os-dialog-titlebar">
          <span className="os-dialog-titlebar-icon">
            <UserRoundPen className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="os-dialog-title">{copy.dialogTitle}</span>
          <button
            type="button"
            className="os-dialog-close"
            onClick={onCancel}
            aria-label={copy.cancel}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <div className="os-dialog-body">
          <p className="os-dialog-description">{copy.dialogDescription}</p>
          <label className="os-dialog-label" htmlFor="os-user-name-input">
            {copy.nameLabel}
          </label>
          <input
            id="os-user-name-input"
            ref={inputRef}
            type="text"
            className="os-dialog-input form-input rounded-lg px-3 py-2 w-full"
            value={value}
            maxLength={40}
            placeholder={copy.placeholder}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
          />
          <div className="os-dialog-actions">
            <button type="button" className="os-dialog-btn os-dialog-btn-primary" onClick={submit}>
              {copy.save}
            </button>
            <button type="button" className="os-dialog-btn" onClick={onCancel}>
              {copy.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
