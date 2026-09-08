"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./primitives";

export function Dialog({
  open,
  title,
  closeLabel,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="gr-dialog"
      aria-labelledby={titleId}
      onCancel={onClose}
      onClose={onClose}
    >
      <h2 id={titleId}>{title}</h2>
      {children}
      <Button variant="secondary" onClick={onClose}>
        {closeLabel}
      </Button>
    </dialog>
  );
}
