-- Demo tenant for local development
-- Password for all users: "password123" (bcrypt hash)

INSERT INTO tenants (id, name, slug)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Grace Community Church', 'grace-community')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO branches (id, tenant_id, name, location, country_code, is_main)
VALUES ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Main Campus', 'Kampala, Uganda', '+256', true)
ON CONFLICT (tenant_id, name) DO NOTHING;

INSERT INTO branches (id, tenant_id, name, location, country_code, is_main)
VALUES ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Entebbe Branch', 'Entebbe, Uganda', '+256', false)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- super_admin: admin@grace.test / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'u0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'admin@grace.test',
  'Super Admin',
  '$2b$10$8K1p/MuLkGZWSsOJwZRkCe5hVz0xGlGPg8BqF1p3dXzVn0cYLOqVy',
  'super_admin'
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- registrar: reg@grace.test / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'u0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'reg@grace.test',
  'Jane Registrar',
  '$2b$10$8K1p/MuLkGZWSsOJwZRkCe5hVz0xGlGPg8BqF1p3dXzVn0cYLOqVy',
  'registrar'
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- Default services
INSERT INTO services (tenant_id, branch_id, name, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Sunday Service (Morning)', 1),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Sunday Service (Afternoon)', 2),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Wednesday Service', 3),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Friday Service', 4)
ON CONFLICT DO NOTHING;

-- Default events
INSERT INTO events (tenant_id, branch_id, name) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Regular Service'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'IGNITE Crusade'),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Pastors Conference')
ON CONFLICT DO NOTHING;

-- Default referral sources
INSERT INTO referral_sources (tenant_id, branch_id, name, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Friend or Family', 1),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Social Media', 2),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Walk-in', 3),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Church Event', 4),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Online Search', 5)
ON CONFLICT DO NOTHING;

-- Default theme
INSERT INTO theme_settings (tenant_id)
VALUES ('a0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;
