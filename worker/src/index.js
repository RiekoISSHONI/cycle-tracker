/**
 * Meguri Telemetry Worker
 *
 * Anonymous event ingest for Cloudflare D1.
 * No PII is stored — anon_id is a random UUID generated client-side.
 *
 * Endpoints:
 *   POST /events        — ingest a batch of events
 *   GET  /stats/summary — DAU, MAU, top events, top tabs (for internal dashboards)
 *   GET  /health        — uptime check
 */

const MAX_BATCH = 200;
const MAX_EVENT_LEN = 64;
const MAX_PAYLOAD_LEN = 2048;

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());

  // In production, also allow the deployed app domain
  if (allowed.includes(origin) || allowed.includes('*')) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };
  }
  return {};
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

// Validate UUID v4 format (loose)
function isUUID(s) {
  return typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

async function handleEvents(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const events = body.events;
  if (!Array.isArray(events) || events.length === 0) {
    return json({ error: 'events must be a non-empty array' }, 400);
  }
  if (events.length > MAX_BATCH) {
    return json({ error: `Max ${MAX_BATCH} events per batch` }, 400);
  }

  const stmt = env.DB.prepare(
    'INSERT INTO events (anon_id, session_id, event, payload, created_at) VALUES (?, ?, ?, ?, ?)'
  );

  const stmts = [];
  let accepted = 0;

  for (const evt of events) {
    // Validate required fields
    if (!isUUID(evt.aid)) continue;
    if (typeof evt.sid !== 'string' || evt.sid.length > 16) continue;
    if (typeof evt.e !== 'string' || evt.e.length > MAX_EVENT_LEN) continue;

    // Extract known fields, put the rest in payload
    const { e, aid, sid, ts, ...rest } = evt;
    const payload = JSON.stringify(rest);
    if (payload.length > MAX_PAYLOAD_LEN) continue;

    // Convert client timestamp (ms) to ISO string
    const createdAt = typeof ts === 'number' && ts > 1_000_000_000_000
      ? new Date(ts).toISOString()
      : new Date().toISOString();

    stmts.push(stmt.bind(aid, sid, e, payload, createdAt));
    accepted++;
  }

  if (stmts.length > 0) {
    try {
      await env.DB.batch(stmts);
    } catch (err) {
      return json({ error: 'DB write failed', detail: err.message }, 500);
    }
  }

  return json({ accepted, dropped: events.length - accepted });
}

async function handleStats(env) {
  const now = new Date();
  const day30 = new Date(now - 30 * 86400000).toISOString();
  const day1 = new Date(now - 86400000).toISOString();

  const [dauResult, mauResult, topEventsResult, topTabsResult, retentionResult] = await Promise.all([
    // DAU (last 24h)
    env.DB.prepare(
      'SELECT COUNT(DISTINCT anon_id) as dau FROM events WHERE created_at > ?'
    ).bind(day1).first(),

    // MAU (last 30d)
    env.DB.prepare(
      'SELECT COUNT(DISTINCT anon_id) as mau FROM events WHERE created_at > ?'
    ).bind(day30).first(),

    // Top events (last 30d)
    env.DB.prepare(`
      SELECT event, COUNT(*) as count, COUNT(DISTINCT anon_id) as unique_users
      FROM events WHERE created_at > ?
      GROUP BY event ORDER BY count DESC LIMIT 20
    `).bind(day30).all(),

    // Top tabs (last 30d)
    env.DB.prepare(`
      SELECT json_extract(payload, '$.tab') as tab,
             COUNT(*) as views,
             COUNT(DISTINCT anon_id) as unique_users
      FROM events
      WHERE event = 'page_view' AND created_at > ?
      GROUP BY tab ORDER BY views DESC
    `).bind(day30).all(),

    // DAU trend (last 30 days)
    env.DB.prepare(`
      SELECT DATE(created_at) as day, COUNT(DISTINCT anon_id) as dau
      FROM events WHERE created_at > ?
      GROUP BY DATE(created_at) ORDER BY day
    `).bind(day30).all(),
  ]);

  return json({
    dau: dauResult?.dau || 0,
    mau: mauResult?.mau || 0,
    topEvents: topEventsResult?.results || [],
    topTabs: topTabsResult?.results || [],
    dauTrend: retentionResult?.results || [],
  });
}

async function handleFunnel(env) {
  const day30 = new Date(Date.now() - 30 * 86400000).toISOString();

  const result = await env.DB.prepare(`
    SELECT event, COUNT(DISTINCT anon_id) as unique_users
    FROM events
    WHERE event IN ('upgrade_modal_open', 'upgrade_plan_select', 'upgrade_tap', 'upgrade_complete')
      AND created_at > ?
    GROUP BY event
  `).bind(day30).all();

  const funnel = {};
  for (const row of (result?.results || [])) {
    funnel[row.event] = row.unique_users;
  }

  return json({
    period: 'last_30d',
    funnel: {
      modal_opened: funnel.upgrade_modal_open || 0,
      plan_selected: funnel.upgrade_plan_select || 0,
      cta_tapped: funnel.upgrade_tap || 0,
      completed: funnel.upgrade_complete || 0,
    },
  });
}

async function handleContentCTR(env) {
  const day30 = new Date(Date.now() - 30 * 86400000).toISOString();

  const result = await env.DB.prepare(`
    SELECT json_extract(payload, '$.category') as category,
           SUM(CASE WHEN json_extract(payload, '$.action') = 'impression' THEN 1 ELSE 0 END) as impressions,
           SUM(CASE WHEN json_extract(payload, '$.action') = 'click' THEN 1 ELSE 0 END) as clicks
    FROM events
    WHERE event = 'content' AND created_at > ?
    GROUP BY category
  `).bind(day30).all();

  const categories = (result?.results || []).map(row => ({
    category: row.category,
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: row.impressions > 0 ? Math.round((row.clicks / row.impressions) * 1000) / 10 : 0,
  }));

  return json({ period: 'last_30d', categories });
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    let response;

    try {
      if (path === '/events' && request.method === 'POST') {
        response = await handleEvents(request, env);
      } else if (path === '/stats/summary' && request.method === 'GET') {
        response = await handleStats(env);
      } else if (path === '/stats/funnel' && request.method === 'GET') {
        response = await handleFunnel(env);
      } else if (path === '/stats/content' && request.method === 'GET') {
        response = await handleContentCTR(env);
      } else if (path === '/health') {
        response = json({ ok: true, ts: new Date().toISOString() });
      } else {
        response = json({ error: 'Not found' }, 404);
      }
    } catch (err) {
      response = json({ error: 'Internal error', detail: err.message }, 500);
    }

    // Apply CORS headers to response
    const headers = new Headers(response.headers);
    for (const [k, v] of Object.entries(cors)) {
      headers.set(k, v);
    }
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
