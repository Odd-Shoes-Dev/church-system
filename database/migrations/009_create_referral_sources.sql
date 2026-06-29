CREATE TABLE IF NOT EXISTS referral_sources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id   UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (tenant_id, branch_id, name)
);

CREATE TABLE IF NOT EXISTS member_referrals (
  member_id         UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  referral_source_id UUID NOT NULL REFERENCES referral_sources(id) ON DELETE CASCADE,
  PRIMARY KEY (member_id, referral_source_id)
);
