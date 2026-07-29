-- Meguri anonymous telemetry schema
-- Works with Supabase (Postgres) or any Postgres instance
-- No PII is stored — anon_id is a random UUID generated client-side

create table if not exists events (
  id         bigint generated always as identity primary key,
  anon_id    uuid not null,
  session_id text not null,
  event      text not null,
  payload    jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Fast queries by event type and date
create index idx_events_event_created on events (event, created_at);

-- DAU/MAU counting
create index idx_events_anon_created on events (anon_id, created_at);

-- Ingest endpoint (Supabase Edge Function or any POST handler)
-- Expected request body:
-- {
--   "events": [
--     {
--       "e": "page_view",       -- event name
--       "aid": "uuid",          -- anonymous device id
--       "sid": "abc12345",      -- session id (8 char, per browser session)
--       "ts": 1722300000000,    -- client timestamp ms
--       "tab": "care",          -- event-specific properties
--       "phase": "sei",
--       "mode": "personal"
--     }
--   ]
-- }
--
-- Insert logic:
-- for each event in body.events:
--   insert into events (anon_id, session_id, event, payload, created_at)
--   values (e.aid, e.sid, e.e, e - 'e' - 'aid' - 'sid' - 'ts', to_timestamp(e.ts / 1000.0))

-- Useful aggregate queries:

-- Daily active users (last 30 days)
-- select date_trunc('day', created_at) as day,
--        count(distinct anon_id) as dau
-- from events
-- where created_at > now() - interval '30 days'
-- group by 1 order by 1;

-- Monthly active users
-- select date_trunc('month', created_at) as month,
--        count(distinct anon_id) as mau
-- from events
-- where created_at > now() - interval '12 months'
-- group by 1 order by 1;

-- Content CTR by category
-- select payload->>'category' as category,
--        count(*) filter (where payload->>'action' = 'impression') as impressions,
--        count(*) filter (where payload->>'action' = 'click') as clicks,
--        round(100.0 * count(*) filter (where payload->>'action' = 'click')
--            / nullif(count(*) filter (where payload->>'action' = 'impression'), 0), 1) as ctr
-- from events
-- where event = 'content'
-- group by 1;

-- Retention (day-1, day-7, day-30)
-- with first_seen as (
--   select anon_id, min(date_trunc('day', created_at)) as first_day
--   from events group by 1
-- )
-- select
--   count(distinct f.anon_id) as total_users,
--   count(distinct case when e.created_at >= f.first_day + interval '1 day'
--     and e.created_at < f.first_day + interval '2 days' then f.anon_id end) as d1,
--   count(distinct case when e.created_at >= f.first_day + interval '7 days'
--     and e.created_at < f.first_day + interval '8 days' then f.anon_id end) as d7,
--   count(distinct case when e.created_at >= f.first_day + interval '30 days'
--     and e.created_at < f.first_day + interval '31 days' then f.anon_id end) as d30
-- from first_seen f
-- join events e using (anon_id);

-- Tab popularity
-- select payload->>'tab' as tab,
--        count(*) as views,
--        count(distinct anon_id) as unique_users
-- from events
-- where event = 'page_view'
-- group by 1 order by 2 desc;
