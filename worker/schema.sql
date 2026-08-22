-- Meguri anonymous telemetry — D1 (SQLite) schema
-- No PII stored. anon_id is a random client-generated UUID.
-- Apply: npx wrangler d1 execute meguri-telemetry --file=schema.sql

CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  anon_id    TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event      TEXT NOT NULL,
  payload    TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Fast queries by event type and date
CREATE INDEX IF NOT EXISTS idx_events_event_created ON events (event, created_at);

-- DAU/MAU counting
CREATE INDEX IF NOT EXISTS idx_events_anon_created ON events (anon_id, created_at);

-- Daily aggregates materialized view (populated by cron or on-demand)
CREATE TABLE IF NOT EXISTS daily_stats (
  day        TEXT NOT NULL,
  event      TEXT NOT NULL,
  count      INTEGER NOT NULL DEFAULT 0,
  unique_ids INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, event)
);
