import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();

  const whereClause =
    user.role === "super_admin"
      ? "WHERE u.tenant_id = $1"
      : "WHERE u.tenant_id = $1 AND u.branch_id = $2";
  const params =
    user.role === "super_admin"
      ? [user.tenantId]
      : [user.tenantId, user.branchId];

  const users = await db.query(
    `SELECT u.id, u.email, u.name, u.role, u.is_active, u.created_at, b.name as branch_name
     FROM users u
     JOIN branches b ON b.id = u.branch_id
     ${whereClause}
     ORDER BY u.created_at DESC`,
    params
  );

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, name, password, role, branchId } = await request.json();

  if (!email?.trim() || !name?.trim() || !password) {
    return NextResponse.json(
      { error: "Email, name, and password are required" },
      { status: 400 }
    );
  }

  const allowedRoles =
    user.role === "super_admin"
      ? ["admin", "registrar"]
      : ["registrar"];

  if (!allowedRoles.includes(role)) {
    return NextResponse.json(
      { error: `You can only create ${allowedRoles.join(" or ")} accounts` },
      { status: 403 }
    );
  }

  const targetBranch = user.role === "super_admin" && branchId ? branchId : user.branchId;

  const db = getDatabase();
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const rows = await db.query<{ id: string }>(
      "INSERT INTO users (tenant_id, branch_id, email, name, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [user.tenantId, targetBranch, email.trim(), name.trim(), passwordHash, role]
    );
    return NextResponse.json({ id: rows[0].id });
  } catch {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 409 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, isActive } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  if (id === user.id) {
    return NextResponse.json(
      { error: "You cannot deactivate your own account" },
      { status: 400 }
    );
  }

  const db = getDatabase();
  await db.execute(
    "UPDATE users SET is_active = $1, updated_at = now() WHERE id = $2 AND tenant_id = $3",
    [isActive, id, user.tenantId]
  );

  return NextResponse.json({ ok: true });
}
