import { cookies, headers } from "next/headers";
import { getDatabase } from "@/lib/providers/database";
import LoginForm from "./LoginForm";

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

async function getTenantName(): Promise<string> {
  try {
    const headerStore = await headers();
    const cookieStore = await cookies();

    const slug =
      headerStore.get("x-tenant-slug") ??
      cookieStore.get("tenant-slug")?.value ??
      slugFromHost(headerStore.get("host") ?? "");

    if (!slug) return "";

    const db = getDatabase();
    const tenant = await db.queryOne<{ name: string }>(
      "SELECT name FROM tenants WHERE slug = $1 AND is_active = true",
      [slug]
    );

    return tenant?.name ?? "";
  } catch {
    return "";
  }
}

export default async function LoginPage() {
  const tenantName = await getTenantName();
  return <LoginForm tenantName={tenantName} />;
}
