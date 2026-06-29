import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const phone = request.nextUrl.searchParams.get("phone");
  if (!phone) {
    return NextResponse.json({ members: [] });
  }

  const db = getDatabase();
  const members = await db.query(
    `SELECT m.id, m.first_name, m.last_name, b.name as home_branch_name,
       (SELECT MAX(r.registered_at)::text FROM registrations r WHERE r.member_id = m.id) as last_visit
     FROM members m
     JOIN branches b ON b.id = m.home_branch_id
     WHERE m.tenant_id = $1 AND m.phone = $2
     ORDER BY m.first_name, m.last_name`,
    [user.tenantId, phone]
  );

  return NextResponse.json({ members });
}
