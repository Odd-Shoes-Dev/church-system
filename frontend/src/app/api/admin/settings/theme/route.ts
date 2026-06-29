import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/providers/database";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();
  const theme = await db.queryOne(
    "SELECT * FROM theme_settings WHERE tenant_id = $1",
    [user.tenantId]
  );

  return NextResponse.json({ theme });
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const db = getDatabase();

  await db.execute(
    `INSERT INTO theme_settings (
       tenant_id, primary_color, secondary_color, background_color, text_color,
       accent_color, surface_color, border_color, muted_color,
       heading_font, body_font, base_font_size, border_radius, custom_css
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     ON CONFLICT (tenant_id) DO UPDATE SET
       primary_color = $2, secondary_color = $3, background_color = $4, text_color = $5,
       accent_color = $6, surface_color = $7, border_color = $8, muted_color = $9,
       heading_font = $10, body_font = $11, base_font_size = $12, border_radius = $13,
       custom_css = $14, updated_at = now()`,
    [
      user.tenantId,
      body.primaryColor,
      body.secondaryColor,
      body.backgroundColor,
      body.textColor,
      body.accentColor,
      body.surfaceColor,
      body.borderColor,
      body.mutedColor,
      body.headingFont,
      body.bodyFont,
      body.baseFontSize,
      body.borderRadius,
      body.customCSS || null,
    ]
  );

  return NextResponse.json({ ok: true });
}
