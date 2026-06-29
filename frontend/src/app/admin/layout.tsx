import { requireAuth } from "@/lib/auth/guard";
import { getDatabase } from "@/lib/providers/database";
import { Sidebar } from "@/components/admin/sidebar";
import { MobileSidebarWrapper } from "@/components/layout/mobile-sidebar-wrapper";

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
    <MobileSidebarWrapper
      sidebar={
        <Sidebar
          userName={user.name}
          branchName={branch?.name ?? "Unknown Branch"}
          role={user.role}
        />
      }
    >
      {children}
    </MobileSidebarWrapper>
  );
}
