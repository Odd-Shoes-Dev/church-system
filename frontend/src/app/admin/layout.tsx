import { requireAuth } from "@/lib/auth/guard";
import { getDatabase } from "@/lib/providers/database";
import { Sidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth(["super_admin", "admin", "registrar"]);

  const db = getDatabase();
  const branch = await db.queryOne<{ name: string }>(
    "SELECT name FROM branches WHERE id = $1",
    [user.branchId]
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar
        userName={user.name}
        branchName={branch?.name ?? "Unknown Branch"}
        role={user.role}
      />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
