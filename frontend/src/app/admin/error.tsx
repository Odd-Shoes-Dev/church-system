"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-[var(--font-heading)] text-[var(--color-text)] mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          {error.message || "An error occurred loading this page."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-[var(--color-background)] text-sm hover:opacity-90 cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
