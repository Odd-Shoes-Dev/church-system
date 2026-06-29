import { requireAuth } from "@/lib/auth/guard";
import { getDatabase } from "@/lib/providers/database";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SuperAdminOverview() {
  const user = await requireAuth(["super_admin"]);
  const db = getDatabase();
  const tid = user.tenantId;

  const [totalMembers, todayRegs, branches, recentRegistrations] =
    await Promise.all([
      db.queryOne<{ count: string }>(
        "SELECT COUNT(*) as count FROM members WHERE tenant_id = $1",
        [tid]
      ),
      db.queryOne<{ count: string }>(
        "SELECT COUNT(*) as count FROM registrations WHERE tenant_id = $1 AND registered_at::date = CURRENT_DATE",
        [tid]
      ),
      db.query<{
        name: string;
        is_main: boolean;
        member_count: string;
        today_count: string;
      }>(
        `SELECT b.name, b.is_main,
                (SELECT COUNT(*) FROM members m WHERE m.home_branch_id = b.id) as member_count,
                (SELECT COUNT(*) FROM registrations r WHERE r.branch_id = b.id AND r.registered_at::date = CURRENT_DATE) as today_count
         FROM branches b
         WHERE b.tenant_id = $1 AND b.is_active = true
         ORDER BY b.is_main DESC, b.name`,
        [tid]
      ),
      db.query<{
        first_name: string;
        last_name: string;
        service_name: string;
        branch_name: string;
        registered_at: string;
      }>(
        `SELECT m.first_name, m.last_name, s.name as service_name, br.name as branch_name, r.registered_at
         FROM registrations r
         JOIN members m ON m.id = r.member_id
         JOIN services s ON s.id = r.service_id
         JOIN branches br ON br.id = r.branch_id
         WHERE r.tenant_id = $1
         ORDER BY r.registered_at DESC
         LIMIT 10`,
        [tid]
      ),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-[var(--font-heading)] text-[var(--color-text)] mb-6">
        Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <p className="text-sm text-[var(--color-muted)]">Total Members</p>
            <CardTitle className="text-3xl mt-1">
              {totalMembers?.count ?? "0"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-sm text-[var(--color-muted)]">
              Today&apos;s Registrations
            </p>
            <CardTitle className="text-3xl mt-1">
              {todayRegs?.count ?? "0"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <h2 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-4">
        Branches
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {branches.map((b) => (
          <Card key={b.name}>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-[var(--font-heading)] text-[var(--color-text)]">
                {b.name}
              </span>
              {b.is_main && <Badge>Main</Badge>}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted)]">Members</span>
              <span className="text-[var(--color-text)]">{b.member_count}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-[var(--color-muted)]">Today</span>
              <span className="text-[var(--color-text)]">{b.today_count}</span>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-[var(--font-heading)] text-[var(--color-text)] mb-4">
        Recent Registrations
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">
                Name
              </th>
              <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">
                Service
              </th>
              <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">
                Branch
              </th>
              <th className="text-left py-2 px-3 text-[var(--color-muted)] font-medium">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {recentRegistrations.map((r, i) => (
              <tr
                key={i}
                className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]"
              >
                <td className="py-2 px-3 text-[var(--color-text)]">
                  {r.first_name} {r.last_name}
                </td>
                <td className="py-2 px-3 text-[var(--color-text)]">
                  {r.service_name}
                </td>
                <td className="py-2 px-3 text-[var(--color-text)]">
                  {r.branch_name}
                </td>
                <td className="py-2 px-3 text-[var(--color-muted)]">
                  {new Date(r.registered_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {recentRegistrations.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-[var(--color-muted)]"
                >
                  No registrations yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
