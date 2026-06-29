import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();
  const sources = await db.query(
    "SELECT id, name, sort_order, is_active FROM referral_sources WHERE tenant_id = $1 AND branch_id = $2 ORDER BY sort_order, name",
    [user.tenantId, user.branchId]
  );

  return NextResponse.json({ sources });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, sortOrder } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const db = getDatabase();
  const rows = await db.query<{ id: string }>(
    "INSERT INTO referral_sources (tenant_id, branch_id, name, sort_order) VALUES ($1, $2, $3, $4) RETURNING id",
    [user.tenantId, user.branchId, name.trim(), sortOrder ?? 0]
  );

  return NextResponse.json({ id: rows[0].id });
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name, sortOrder, isActive } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const db = getDatabase();
  await db.execute(
    "UPDATE referral_sources SET name = COALESCE($1, name), sort_order = COALESCE($2, sort_order), is_active = COALESCE($3, is_active) WHERE id = $4 AND tenant_id = $5 AND branch_id = $6",
    [name?.trim() || null, sortOrder ?? null, isActive ?? null, id, user.tenantId, user.branchId]
  );

  return NextResponse.json({ ok: true });
}
