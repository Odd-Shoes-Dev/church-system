import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getDatabase } from "@/lib/providers/database";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.user || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { branchId } = await request.json();
  if (!branchId) {
    return NextResponse.json({ error: "branchId required" }, { status: 400 });
  }

  const db = getDatabase();
  const branch = await db.queryOne<{ id: string }>(
    "SELECT id FROM branches WHERE id = $1 AND tenant_id = $2 AND is_active = true",
    [branchId, session.user.tenantId]
  );

  if (!branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 });
  }

  session.user = { ...session.user, branchId };
  await session.save();

  return NextResponse.json({ ok: true });
}
