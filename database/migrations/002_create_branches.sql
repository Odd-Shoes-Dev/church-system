CREATE TABLE IF NOT EXISTS branches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  location      TEXT,
  country_code  TEXT NOT NULL DEFAULT '+256',
  is_main       BOOLEAN NOT NULL DEFAULT false,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

CREATE INDEX idx_branches_tenant ON branches (tenant_id);

CREATE UNIQUE INDEX idx_branches_one_main_per_tenant
  ON branches (tenant_id) WHERE is_main = true;
