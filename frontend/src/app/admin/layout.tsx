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
  const [branch, tenant, allBranches] = await Promise.all([
    db.queryOne<{ name: string }>(
      "SELECT name FROM branches WHERE id = $1",
      [user.branchId]
    ),
    db.queryOne<{ name: string }>(
      "SELECT name FROM tenants WHERE id = $1",
      [user.tenantId]
    ),
    user.role === "super_admin"
      ? db.query<{ id: string; name: string }>(
          "SELECT id, name FROM branches WHERE tenant_id = $1 AND is_active = true ORDER BY is_main DESC, name",
          [user.tenantId]
        )
      : Promise.resolve([]),
  ]);

  return (
    <MobileSidebarWrapper
      mobileTitle={tenant?.name ?? "Administration"}
      mobileSubtitle={branch?.name}
      sidebar={
        <Sidebar
          userName={user.name}
          churchName={tenant?.name ?? ""}
          branchName={branch?.name ?? "Unknown Branch"}
          currentBranchId={user.branchId}
          branches={allBranches}
          role={user.role}
          isSuperAdmin={user.role === "super_admin"}
        />
      }
    >
      {children}
    </MobileSidebarWrapper>
  );
}
