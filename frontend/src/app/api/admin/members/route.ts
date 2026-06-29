import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1");
  const limit = 25;
  const offset = (page - 1) * limit;

  const db = getDatabase();

  let whereClause = "WHERE m.tenant_id = $1";
  const params: unknown[] = [user.tenantId];

  if (search.trim()) {
    params.push(`%${search.trim()}%`);
    whereClause += ` AND (m.first_name ILIKE $${params.length} OR m.last_name ILIKE $${params.length} OR m.phone ILIKE $${params.length} OR m.email ILIKE $${params.length})`;
  }

  const [members, countResult] = await Promise.all([
    db.query(
      `SELECT m.id, m.first_name, m.last_name, m.phone, m.email, m.gender, m.age_group, m.district,
              m.occupation, m.marital_status, m.is_first_time, m.created_at,
              b.name as home_branch_name,
              (SELECT COUNT(*) FROM registrations r WHERE r.member_id = m.id) as visit_count,
              (SELECT MAX(r.registered_at)::text FROM registrations r WHERE r.member_id = m.id) as last_visit
       FROM members m
       JOIN branches b ON b.id = m.home_branch_id
       ${whereClause}
       ORDER BY m.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    ),
    db.queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM members m ${whereClause}`,
      params
    ),
  ]);

  return NextResponse.json({
    members,
    total: parseInt(countResult?.count ?? "0"),
    page,
    limit,
  });
}
