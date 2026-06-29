import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const date = request.nextUrl.searchParams.get("date");
  const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1");
  const limit = 25;
  const offset = (page - 1) * limit;

  const db = getDatabase();

  let whereClause = "WHERE r.tenant_id = $1 AND r.branch_id = $2";
  const params: unknown[] = [user.tenantId, user.branchId];

  if (date) {
    params.push(date);
    whereClause += ` AND r.registered_at::date = $${params.length}`;
  }

  const [registrations, countResult] = await Promise.all([
    db.query(
      `SELECT r.id, r.registered_at,
              m.first_name, m.last_name, m.phone,
              s.name as service_name,
              e.name as event_name,
              u.name as registered_by_name
       FROM registrations r
       JOIN members m ON m.id = r.member_id
       JOIN services s ON s.id = r.service_id
       LEFT JOIN events e ON e.id = r.event_id
       JOIN users u ON u.id = r.registered_by
       ${whereClause}
       ORDER BY r.registered_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    ),
    db.queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM registrations r ${whereClause}`,
      params
    ),
  ]);

  return NextResponse.json({
    registrations,
    total: parseInt(countResult?.count ?? "0"),
    page,
    limit,
  });
}
