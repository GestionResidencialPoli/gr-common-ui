"use client";

import { useState, type ReactNode } from "react";

export function ErrorToast({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="gr-feedback gr-feedback--error" role="alert">
      <span className="gr-feedback-message">{children}</span>
      <button
        type="button"
        className="gr-feedback-close"
        aria-label="Cerrar aviso"
        onClick={() => setOpen(false)}
      >
        ×
      </button>
    </div>
  );
}
