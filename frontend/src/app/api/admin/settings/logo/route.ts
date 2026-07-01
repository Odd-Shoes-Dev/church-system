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

  const existing = await db.queryOne<{ logo_file_id: string | null }>(
    "SELECT logo_file_id FROM tenants WHERE id = $1",
    [user.tenantId]
  );
  if (existing?.logo_file_id) {
    await storage.delete(existing.logo_file_id).catch(() => {});
  }

  await db.execute(
    "UPDATE tenants SET logo_url = $1, logo_file_id = $2, updated_at = now() WHERE id = $3",
    [result.url, result.fileId, user.tenantId]
  );

  return NextResponse.json({ url: result.url });
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();

  const existing = await db.queryOne<{ logo_file_id: string | null }>(
    "SELECT logo_file_id FROM tenants WHERE id = $1",
    [user.tenantId]
  );
  if (existing?.logo_file_id) {
    const storage = getStorage();
    await storage.delete(existing.logo_file_id).catch(() => {});
  }

  await db.execute(
    "UPDATE tenants SET logo_url = NULL, logo_file_id = NULL, updated_at = now() WHERE id = $1",
    [user.tenantId]
  );

  return NextResponse.json({ ok: true });
}
