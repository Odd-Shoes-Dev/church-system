CREATE TABLE IF NOT EXISTS theme_settings (
  tenant_id         UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  primary_color     TEXT NOT NULL DEFAULT '#6b5344',
  secondary_color   TEXT NOT NULL DEFAULT '#a89279',
  background_color  TEXT NOT NULL DEFAULT '#faf6f1',
  text_color        TEXT NOT NULL DEFAULT '#2c2420',
  accent_color      TEXT NOT NULL DEFAULT '#8c7355',
  surface_color     TEXT NOT NULL DEFAULT '#f0ebe4',
  border_color      TEXT NOT NULL DEFAULT '#d4c9bb',
  muted_color       TEXT NOT NULL DEFAULT '#8a7e72',
  heading_font      TEXT NOT NULL DEFAULT 'Playfair Display',
  body_font         TEXT NOT NULL DEFAULT 'Lora',
  base_font_size    INT NOT NULL DEFAULT 16,
  border_radius     TEXT NOT NULL DEFAULT '4px',
  custom_css        TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
