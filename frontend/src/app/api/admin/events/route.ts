import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();
  const events = await db.query(
    "SELECT id, name, start_date, end_date, is_active FROM events WHERE tenant_id = $1 AND branch_id = $2 ORDER BY name",
    [user.tenantId, user.branchId]
  );

  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, startDate, endDate } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const db = getDatabase();
  const rows = await db.query<{ id: string }>(
    "INSERT INTO events (tenant_id, branch_id, name, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [user.tenantId, user.branchId, name.trim(), startDate || null, endDate || null]
  );

  return NextResponse.json({ id: rows[0].id });
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name, startDate, endDate, isActive } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const db = getDatabase();
  await db.execute(
    "UPDATE events SET name = COALESCE($1, name), start_date = $2, end_date = $3, is_active = COALESCE($4, is_active) WHERE id = $5 AND tenant_id = $6 AND branch_id = $7",
    [name?.trim() || null, startDate || null, endDate || null, isActive ?? null, id, user.tenantId, user.branchId]
  );

  return NextResponse.json({ ok: true });
}
