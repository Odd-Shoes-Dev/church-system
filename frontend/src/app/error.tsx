"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)] mb-2">
          Something went wrong
        </h1>
        <p className="text-[var(--color-muted)] mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="inline-block px-4 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-[var(--color-background)] text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
