import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();
  const branches = await db.query(
    `SELECT b.id, b.name, b.location, b.country_code, b.is_main, b.is_active, b.created_at,
            (SELECT COUNT(*) FROM members m WHERE m.home_branch_id = b.id) as member_count,
            (SELECT COUNT(*) FROM users u WHERE u.branch_id = b.id AND u.role = 'admin') as admin_count
     FROM branches b
     WHERE b.tenant_id = $1
     ORDER BY b.is_main DESC, b.name`,
    [user.tenantId]
  );

  return NextResponse.json({ branches });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, location, countryCode } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const db = getDatabase();
  try {
    const rows = await db.query<{ id: string }>(
      "INSERT INTO branches (tenant_id, name, location, country_code) VALUES ($1, $2, $3, $4) RETURNING id",
      [user.tenantId, name.trim(), location?.trim() || null, countryCode?.trim() || "+256"]
    );
    return NextResponse.json({ id: rows[0].id });
  } catch {
    return NextResponse.json(
      { error: "A branch with this name already exists" },
      { status: 409 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name, location, countryCode, isActive, setAsMain } =
    await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const db = getDatabase();

  if (setAsMain) {
    await db.execute(
      "UPDATE branches SET is_main = false WHERE tenant_id = $1",
      [user.tenantId]
    );
    await db.execute(
      "UPDATE branches SET is_main = true WHERE id = $1 AND tenant_id = $2",
      [id, user.tenantId]
    );
    return NextResponse.json({ ok: true });
  }

  await db.execute(
    `UPDATE branches SET
       name = COALESCE($1, name),
       location = COALESCE($2, location),
       country_code = COALESCE($3, country_code),
       is_active = COALESCE($4, is_active),
       updated_at = now()
     WHERE id = $5 AND tenant_id = $6`,
    [
      name?.trim() || null,
      location?.trim() ?? null,
      countryCode?.trim() || null,
      isActive ?? null,
      id,
      user.tenantId,
    ]
  );

  return NextResponse.json({ ok: true });
}
