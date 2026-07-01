-- Production church seeds
-- All passwords: "password123"
-- Hash: $2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq
--
-- Run AFTER demo-tenant.sql (Grace Community Church must already exist)
--
-- Tenant IDs:
--   Grace Community Church  a0000000-0000-0000-0000-000000000001  (existing)
--   Watoto Church           a0000000-0000-0000-0000-000000000002
--   Apokalupsis Ministries  a0000000-0000-0000-0000-000000000003
--   Dublin Christian Church a0000000-0000-0000-0000-000000000004

-- ============================================================
-- GRACE COMMUNITY CHURCH — add missing admin user
-- ============================================================

-- admin: admin@grace.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000003'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'b0000000-0000-0000-0000-000000000001'::uuid,
  'admin@grace.com',
  'Grace Admin',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'admin'
) ON CONFLICT (tenant_id, email) DO NOTHING;


-- ============================================================
-- WATOTO CHURCH
-- ============================================================

INSERT INTO tenants (id, name, slug)
VALUES ('a0000000-0000-0000-0000-000000000002'::uuid, 'Watoto Church', 'watoto-church')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO branches (id, tenant_id, name, location, country_code, is_main) VALUES
  ('b0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000002'::uuid, 'Watoto City Church', 'Kampala, Uganda', '+256', true),
  ('b0000000-0000-0000-0000-000000000004'::uuid, 'a0000000-0000-0000-0000-000000000002'::uuid, 'Watoto Buloba Campus', 'Buloba, Uganda', '+256', false)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- super_admin: superadmin@watoto.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000010'::uuid,
  'a0000000-0000-0000-0000-000000000002'::uuid,
  'b0000000-0000-0000-0000-000000000003'::uuid,
  'superadmin@watoto.com',
  'Watoto Super Admin',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'super_admin'
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- admin: admin@watoto.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000011'::uuid,
  'a0000000-0000-0000-0000-000000000002'::uuid,
  'b0000000-0000-0000-0000-000000000003'::uuid,
  'admin@watoto.com',
  'Watoto Admin',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'admin'
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- registrar: reg@watoto.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000012'::uuid,
  'a0000000-0000-0000-0000-000000000002'::uuid,
  'b0000000-0000-0000-0000-000000000003'::uuid,
  'reg@watoto.com',
  'Watoto Registrar',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'registrar'
) ON CONFLICT (tenant_id, email) DO NOTHING;

INSERT INTO services (tenant_id, branch_id, name, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Sunday First Service', 1),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Sunday Second Service', 2),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Wednesday Prayer Night', 3),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Friday Youth Service', 4)
ON CONFLICT DO NOTHING;

INSERT INTO events (tenant_id, branch_id, name) VALUES
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Regular Service'),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Children''s Camp'),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Missions Conference')
ON CONFLICT DO NOTHING;

INSERT INTO referral_sources (tenant_id, branch_id, name, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Friend or Family', 1),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Social Media', 2),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Walk-in', 3),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Radio or Television', 4),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Church Event', 5)
ON CONFLICT DO NOTHING;

-- Theme: Emerald Scripture
INSERT INTO theme_settings (
  tenant_id, primary_color, secondary_color, background_color, text_color,
  accent_color, surface_color, border_color, muted_color,
  heading_font, body_font
) VALUES (
  'a0000000-0000-0000-0000-000000000002'::uuid,
  '#1a4a2e', '#b5924c', '#f8f6ef', '#1c2818',
  '#c9a84c', '#eeebdf', '#ccc9b8', '#7a8a6e',
  'Crimson Text', 'Lora'
) ON CONFLICT DO NOTHING;


-- ============================================================
-- APOKALUPSIS MINISTRIES
-- ============================================================

INSERT INTO tenants (id, name, slug)
VALUES ('a0000000-0000-0000-0000-000000000003'::uuid, 'Apokalupsis Ministries', 'apokalupsis-ministries')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO branches (id, tenant_id, name, location, country_code, is_main) VALUES
  ('b0000000-0000-0000-0000-000000000005'::uuid, 'a0000000-0000-0000-0000-000000000003'::uuid, 'Main Sanctuary', 'Kampala, Uganda', '+256', true),
  ('b0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000003'::uuid, 'Ntinda Centre', 'Ntinda, Uganda', '+256', false)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- super_admin: superadmin@apokalupsis.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000020'::uuid,
  'a0000000-0000-0000-0000-000000000003'::uuid,
  'b0000000-0000-0000-0000-000000000005'::uuid,
  'superadmin@apokalupsis.com',
  'Apokalupsis Super Admin',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'super_admin'
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- admin: admin@apokalupsis.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000021'::uuid,
  'a0000000-0000-0000-0000-000000000003'::uuid,
  'b0000000-0000-0000-0000-000000000005'::uuid,
  'admin@apokalupsis.com',
  'Apokalupsis Admin',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'admin'
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- registrar: reg@apokalupsis.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000022'::uuid,
  'a0000000-0000-0000-0000-000000000003'::uuid,
  'b0000000-0000-0000-0000-000000000005'::uuid,
  'reg@apokalupsis.com',
  'Apokalupsis Registrar',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'registrar'
) ON CONFLICT (tenant_id, email) DO NOTHING;

INSERT INTO services (tenant_id, branch_id, name, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Sunday Morning Service', 1),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Sunday Evening Service', 2),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Tuesday Bible Study', 3),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Friday Revival Night', 4)
ON CONFLICT DO NOTHING;

INSERT INTO events (tenant_id, branch_id, name) VALUES
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Regular Service'),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Prophetic Conference'),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Revival Crusade')
ON CONFLICT DO NOTHING;

INSERT INTO referral_sources (tenant_id, branch_id, name, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Friend or Family', 1),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Social Media', 2),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Walk-in', 3),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Crusade', 4),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Church Event', 5)
ON CONFLICT DO NOTHING;

-- Theme: Midnight Chapel
INSERT INTO theme_settings (
  tenant_id, primary_color, secondary_color, background_color, text_color,
  accent_color, surface_color, border_color, muted_color,
  heading_font, body_font
) VALUES (
  'a0000000-0000-0000-0000-000000000003'::uuid,
  '#c4a96a', '#8a7d5a', '#1c1b19', '#e8e4dc',
  '#b89d5e', '#2a2826', '#3d3a36', '#8c877e',
  'Playfair Display', 'Lora'
) ON CONFLICT DO NOTHING;


-- ============================================================
-- DUBLIN CHRISTIAN CHURCH
-- ============================================================

INSERT INTO tenants (id, name, slug)
VALUES ('a0000000-0000-0000-0000-000000000004'::uuid, 'Dublin Christian Church', 'dublin-christian-church')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO branches (id, tenant_id, name, location, country_code, is_main) VALUES
  ('b0000000-0000-0000-0000-000000000007'::uuid, 'a0000000-0000-0000-0000-000000000004'::uuid, 'Dublin City Campus', 'Dublin, Ireland', '+353', true),
  ('b0000000-0000-0000-0000-000000000008'::uuid, 'a0000000-0000-0000-0000-000000000004'::uuid, 'Blanchardstown Campus', 'Blanchardstown, Ireland', '+353', false)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- super_admin: superadmin@dublin.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000030'::uuid,
  'a0000000-0000-0000-0000-000000000004'::uuid,
  'b0000000-0000-0000-0000-000000000007'::uuid,
  'superadmin@dublin.com',
  'Dublin Super Admin',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'super_admin'
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- admin: admin@dublin.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000031'::uuid,
  'a0000000-0000-0000-0000-000000000004'::uuid,
  'b0000000-0000-0000-0000-000000000007'::uuid,
  'admin@dublin.com',
  'Dublin Admin',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'admin'
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- registrar: reg@dublin.com / password123
INSERT INTO users (id, tenant_id, branch_id, email, name, password_hash, role)
VALUES (
  'c0000000-0000-0000-0000-000000000032'::uuid,
  'a0000000-0000-0000-0000-000000000004'::uuid,
  'b0000000-0000-0000-0000-000000000007'::uuid,
  'reg@dublin.com',
  'Dublin Registrar',
  '$2b$10$gKJPIfqdofwVGa9NytLkouq1v6FqrLIKCs5ZEJMeVgv/3sYQOFoPq',
  'registrar'
) ON CONFLICT (tenant_id, email) DO NOTHING;

INSERT INTO services (tenant_id, branch_id, name, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Sunday Service', 1),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Wednesday Prayer Meeting', 2),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Friday Evening Service', 3)
ON CONFLICT DO NOTHING;

INSERT INTO events (tenant_id, branch_id, name) VALUES
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Regular Service'),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Easter Conference'),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Christmas Special')
ON CONFLICT DO NOTHING;

INSERT INTO referral_sources (tenant_id, branch_id, name, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Friend or Family', 1),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Social Media', 2),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Walk-in', 3),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Online Search', 4),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Community Outreach', 5)
ON CONFLICT DO NOTHING;

-- Theme: Forest Sanctuary
INSERT INTO theme_settings (
  tenant_id, primary_color, secondary_color, background_color, text_color,
  accent_color, surface_color, border_color, muted_color,
  heading_font, body_font
) VALUES (
  'a0000000-0000-0000-0000-000000000004'::uuid,
  '#2d5016', '#4a7c2f', '#f5f7f0', '#1a2410',
  '#3d6b1f', '#eaefe3', '#c4d4b0', '#6b8055',
  'Playfair Display', 'Lora'
) ON CONFLICT DO NOTHING;
