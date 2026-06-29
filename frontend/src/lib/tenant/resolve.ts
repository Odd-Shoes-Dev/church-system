import { getDatabase } from "@/lib/providers/database";
import type { Tenant } from "./types";

interface TenantRow {
  id: string;
  name: string;
  slug: string;
  custom_domain: string | null;
  logo_url: string | null;
  is_active: boolean;
}

const cache = new Map<string, { tenant: Tenant; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function toTenant(row: TenantRow): Tenant {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    customDomain: row.custom_domain,
    logoUrl: row.logo_url,
    isActive: row.is_active,
  };
}

export async function resolveTenantBySlug(
  slug: string
): Promise<Tenant | null> {
  const cacheKey = `slug:${slug}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.tenant;

  const db = getDatabase();
  const row = await db.queryOne<TenantRow>(
    "SELECT id, name, slug, custom_domain, logo_url, is_active FROM tenants WHERE slug = $1 AND is_active = true",
    [slug]
  );

  if (!row) return null;
  const tenant = toTenant(row);
  cache.set(cacheKey, { tenant, expiresAt: Date.now() + CACHE_TTL });
  return tenant;
}

export async function resolveTenantByDomain(
  domain: string
): Promise<Tenant | null> {
  const cacheKey = `domain:${domain}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.tenant;

  const db = getDatabase();
  const row = await db.queryOne<TenantRow>(
    "SELECT id, name, slug, custom_domain, logo_url, is_active FROM tenants WHERE custom_domain = $1 AND is_active = true",
    [domain]
  );

  if (!row) return null;
  const tenant = toTenant(row);
  cache.set(cacheKey, { tenant, expiresAt: Date.now() + CACHE_TTL });
  return tenant;
}
