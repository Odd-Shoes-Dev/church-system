export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-[var(--font-heading)] text-[var(--color-text)] mb-2">
          Page Not Found
        </h1>
        <p className="text-[var(--color-muted)] mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-[var(--color-background)] text-sm hover:opacity-90 transition-opacity"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
