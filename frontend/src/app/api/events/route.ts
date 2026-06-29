import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();
  const events = await db.query(
    "SELECT id, name FROM events WHERE tenant_id = $1 AND branch_id = $2 AND is_active = true ORDER BY name",
    [user.tenantId, user.branchId]
  );

  return NextResponse.json({ events });
}
