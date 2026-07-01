import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { themeToStyleObject, themeRowToSettings } from "@/lib/theme/apply";

export const metadata: Metadata = {
  title: "Church Registration System",
  description: "Church member registration and attendance tracking",
};

function slugFromHost(host: string): string | null {
  const h = host.split(":")[0];
  const baseDomain = (process.env.BASE_DOMAIN ?? "localhost:3000").split(":")[0];
  const parts = h.split(".");

  if (parts.length === 2 && parts[1] === "localhost" && parts[0] !== "www") {
    return parts[0];
  }
  if (h !== baseDomain && h.endsWith(`.${baseDomain}`)) {
    return h.slice(0, h.length - baseDomain.length - 1);
  }
  return null;
}

async function getTenantThemeStyle(): Promise<Record<string, string> | null> {
  try {
    const headerStore = await headers();
    const cookieStore = await cookies();

    const slug =
      headerStore.get("x-tenant-slug") ??
      cookieStore.get("tenant-slug")?.value ??
      slugFromHost(headerStore.get("host") ?? "");

    if (!slug) return null;

    const { getDatabase } = await import("@/lib/providers/database");
    const db = getDatabase();

    const tenant = await db.queryOne<{ id: string }>(
      "SELECT id FROM tenants WHERE slug = $1 AND is_active = true",
      [slug]
    );

    if (!tenant) return null;

    const theme = await db.queryOne(
      "SELECT * FROM theme_settings WHERE tenant_id = $1",
      [tenant.id]
    );

    if (!theme) return null;

    return themeToStyleObject(
      themeRowToSettings(theme as Record<string, unknown>)
    );
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeStyle = await getTenantThemeStyle();

  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={themeStyle as React.CSSProperties | undefined}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
