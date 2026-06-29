import { requireAuth } from "@/lib/auth/guard";
import { getDatabase } from "@/lib/providers/database";
import { SuperAdminSidebar } from "@/components/super-admin/sidebar";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth(["super_admin"]);

  const db = getDatabase();
  const tenant = await db.queryOne<{ name: string }>(
    "SELECT name FROM tenants WHERE id = $1",
    [user.tenantId]
  );

  return (
    <div className="flex min-h-screen">
      <SuperAdminSidebar
        userName={user.name}
        tenantName={tenant?.name ?? "Unknown Church"}
      />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
