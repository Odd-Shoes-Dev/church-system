-- Demo tenant for local development
-- Password for all users: "password123" (bcrypt hash)

INSERT INTO tenants (id, name, slug)
VALUES ('a0000000-0000-0000-0000-000000000001'::uuid, 'Grace Community Church', 'grace-community-system')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO branches (id, tenant_id, name, location, country_code, is_main)
VALUES ('b0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Main Campus', 'Kampala, Uganda', '+256', true)
ON CONFLICT (tenant_id, name) DO NOTHING;

INSERT INTO branches (id, tenant_id, name, location, country_code, is_main)
VALUES ('b0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000001'::uuid, 'Entebbe Branch', 'Entebbe, Uganda', '+256', false)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- super_admin: admin@gmail.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000001'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'b0000000-0000-0000-0000-000000000001'::uuid,
  'admin@gmail.com',
  'Super Admin',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'super_admin'
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- registrar: reg@grace.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000002'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'b0000000-0000-0000-0000-000000000001'::uuid,
  'reg@grace.com',
  'Jane Registrar',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'registrar'
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- Default services
INSERT INTO services (tenant_id, branch_id, name, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Sunday Service (Morning)', 1),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Sunday Service (Afternoon)', 2),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Wednesday Service', 3),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Friday Service', 4)
ON CONFLICT DO NOTHING;

-- Default events
INSERT INTO events (tenant_id, branch_id, name) VALUES
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Regular Service'),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'IGNITE Crusade'),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Pastors Conference')
ON CONFLICT DO NOTHING;

-- Default referral sources
INSERT INTO referral_sources (tenant_id, branch_id, name, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Friend or Family', 1),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Social Media', 2),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Walk-in', 3),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Church Event', 4),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Online Search', 5)
ON CONFLICT DO NOTHING;

-- Default theme
INSERT INTO theme_settings (tenant_id)
VALUES ('a0000000-0000-0000-0000-000000000001'::uuid)
ON CONFLICT DO NOTHING;
