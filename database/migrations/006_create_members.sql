CREATE TABLE IF NOT EXISTS members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  home_branch_id  UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  gender          TEXT CHECK (gender IN ('male', 'female')),
  age_group       TEXT CHECK (age_group IN ('child', 'teen', 'young_adult', 'adult', 'senior')),
  district        TEXT,
  occupation      TEXT,
  marital_status  TEXT CHECK (marital_status IN ('single', 'married', 'widowed', 'divorced')),
  is_first_time   BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_members_tenant ON members (tenant_id);
CREATE INDEX idx_members_phone ON members (tenant_id, phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_members_branch ON members (tenant_id, home_branch_id);
