import { requireAuth } from "@/lib/auth/guard";

export default async function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-[var(--font-heading)] text-[var(--color-text)]">
          Registration
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-muted)]">
            {user.name}
          </span>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] underline cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}
