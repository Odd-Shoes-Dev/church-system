import { requireAuth } from "@/lib/auth/guard";
import { getDatabase } from "@/lib/providers/database";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const user = await requireAuth(["super_admin", "admin", "registrar"]);
  const db = getDatabase();

  const [totalMembers, todayRegistrations, totalServices] = await Promise.all([
    db.queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM members WHERE tenant_id = $1",
      [user.tenantId]
    ),
    db.queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM registrations WHERE tenant_id = $1 AND branch_id = $2 AND registered_at::date = CURRENT_DATE",
      [user.tenantId, user.branchId]
    ),
    db.queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM services WHERE tenant_id = $1 AND branch_id = $2 AND is_active = true",
      [user.tenantId, user.branchId]
    ),
  ]);

  const stats = [
    { label: "Total Members", value: totalMembers?.count ?? "0" },
    { label: "Today's Registrations", value: todayRegistrations?.count ?? "0" },
    { label: "Active Services", value: totalServices?.count ?? "0" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)] mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <p className="text-sm text-[var(--color-muted)]">{s.label}</p>
              <CardTitle className="text-3xl mt-1">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
