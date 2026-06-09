CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO site_config (key, value) VALUES ('site_settings', '{}')
ON CONFLICT (key) DO NOTHING;
