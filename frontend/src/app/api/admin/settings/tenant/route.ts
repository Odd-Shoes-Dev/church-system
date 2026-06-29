import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();
  const tenant = await db.queryOne(
    "SELECT id, name, slug, custom_domain, logo_url FROM tenants WHERE id = $1",
    [user.tenantId]
  );

  return NextResponse.json({ tenant });
}
