import { requireAuth } from "@/lib/auth/guard";
import { getDatabase } from "@/lib/providers/database";
import { SignOutButton } from "@/components/ui/sign-out-button";

export default async function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  const db = getDatabase();
  const [tenant, branch] = await Promise.all([
    db.queryOne<{ name: string; logo_url: string | null }>(
      "SELECT name, logo_url FROM tenants WHERE id = $1",
      [user.tenantId]
    ),
    db.queryOne<{ name: string }>(
      "SELECT name FROM branches WHERE id = $1",
      [user.branchId]
    ),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-border)] px-3 sm:px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {tenant?.logo_url && (
            <img
              src={tenant.logo_url}
              alt={`${tenant.name} logo`}
              className="h-7 sm:h-8 w-auto object-contain shrink-0"
            />
          )}
          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg font-[var(--font-heading)] text-[var(--color-text)] truncate leading-tight">
              {tenant?.name ?? "Registration"}
            </h1>
            {branch?.name && (
              <span className="text-xs text-[var(--color-muted)] truncate">
                {branch.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-xs sm:text-sm text-[var(--color-muted)] hidden sm:inline">
            {user.name}
          </span>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 flex items-start sm:items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}
