import { requireAuth } from "@/lib/auth/guard";
import { getDatabase } from "@/lib/providers/database";
import { SuperAdminSidebar } from "@/components/super-admin/sidebar";
import { MobileSidebarWrapper } from "@/components/layout/mobile-sidebar-wrapper";

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
    <MobileSidebarWrapper
      mobileTitle={tenant?.name ?? "Church Overview"}
      sidebar={
        <SuperAdminSidebar
          userName={user.name}
          tenantName={tenant?.name ?? "Unknown Church"}
        />
      }
    >
      {children}
    </MobileSidebarWrapper>
  );
}
