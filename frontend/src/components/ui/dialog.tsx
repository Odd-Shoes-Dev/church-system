"use client";

import { useEffect, useRef } from "react";
import { clsx } from "clsx";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={clsx(
        "rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] p-6 backdrop:bg-black/40 max-w-lg w-full",
        className
      )}
    >
      {title && (
        <h2 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-4">
          {title}
        </h2>
      )}
      {children}
    </dialog>
  );
}
