"use client";

import { useState } from "react";
import { clsx } from "clsx";

interface MobileSidebarWrapperProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function MobileSidebarWrapper({
  sidebar,
  children,
}: MobileSidebarWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 lg:static lg:z-auto transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div onClick={() => setOpen(false)}>{sidebar}</div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden border-b border-[var(--color-border)] px-4 py-3 flex items-center">
          <button
            onClick={() => setOpen(true)}
            className="text-[var(--color-text)] cursor-pointer p-1"
            aria-label="Open menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="ml-3 text-sm font-[var(--font-heading)] text-[var(--color-text)]">
            Menu
          </span>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
