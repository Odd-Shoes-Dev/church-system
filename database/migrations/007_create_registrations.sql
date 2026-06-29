CREATE TABLE IF NOT EXISTS registrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id       UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  member_id       UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  service_id      UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  event_id        UUID REFERENCES events(id) ON DELETE SET NULL,
  registered_by   UUID NOT NULL REFERENCES users(id),
  registered_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_registrations_branch_date ON registrations (tenant_id, branch_id, registered_at);
CREATE INDEX idx_registrations_member ON registrations (member_id);
