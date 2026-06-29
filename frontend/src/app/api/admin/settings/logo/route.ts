import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";
import { getStorage } from "@/lib/providers/storage";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("logo") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const storage = getStorage();

  const result = await storage.upload(
    buffer,
    `tenants/${user.tenantId}/logo-${Date.now()}`,
    file.type
  );

  const db = getDatabase();
  await db.execute(
    "UPDATE tenants SET logo_url = $1, updated_at = now() WHERE id = $2",
    [result.url, user.tenantId]
  );

  return NextResponse.json({ url: result.url });
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();
  await db.execute(
    "UPDATE tenants SET logo_url = NULL, updated_at = now() WHERE id = $1",
    [user.tenantId]
  );

  return NextResponse.json({ ok: true });
}
