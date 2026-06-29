import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/providers/database";
import { getSession } from "@/lib/auth/session";
import type { SessionUser } from "@/lib/auth/types";

interface UserRow {
  id: string;
  tenant_id: string;
  branch_id: string;
  email: string;
  name: string;
  password_hash: string;
  role: string;
}

interface BranchRow {
  id: string;
  name: string;
  location: string | null;
  is_main: boolean;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, branchId } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const tenantSlug =
    request.headers.get("x-tenant-slug") ??
    request.cookies.get("tenant-slug")?.value;

  if (!tenantSlug) {
    return NextResponse.json(
      { error: "Tenant not found" },
      { status: 400 }
    );
  }

  const db = getDatabase();

  const user = await db.queryOne<UserRow>(
    `SELECT u.id, u.tenant_id, u.branch_id, u.email, u.name, u.password_hash, u.role
     FROM users u
     JOIN tenants t ON t.id = u.tenant_id
     WHERE t.slug = $1 AND u.email = $2 AND u.is_active = true`,
    [tenantSlug, email]
  );

  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // If super_admin and no branch selected, return branches for selection
  if (user.role === "super_admin" && !branchId) {
    const branches = await db.query<BranchRow>(
      "SELECT id, name, location, is_main FROM branches WHERE tenant_id = $1 AND is_active = true ORDER BY is_main DESC, name",
      [user.tenant_id]
    );

    if (branches.length > 1) {
      return NextResponse.json({
        requireBranchSelection: true,
        branches,
        userId: user.id,
      });
    }
  }

  const selectedBranchId = branchId ?? user.branch_id;

  const session = await getSession();
  const sessionUser: SessionUser = {
    id: user.id,
    tenantId: user.tenant_id,
    branchId: selectedBranchId,
    email: user.email,
    name: user.name,
    role: user.role as SessionUser["role"],
  };
  session.user = sessionUser;
  await session.save();

  return NextResponse.json({ user: sessionUser });
}
