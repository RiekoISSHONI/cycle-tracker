const STORAGE_KEY = 'meguri_anon';
const QUEUE_KEY = 'meguri_tq';
const FLUSH_INTERVAL = 30_000;
const MAX_QUEUE = 200;

let queue = [];
let timer = null;

function getAnonId() {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

function getSessionId() {
  let id = sessionStorage.getItem('meguri_sid');
  if (!id) {
    id = crypto.randomUUID().slice(0, 8);
    sessionStorage.setItem('meguri_sid', id);
  }
  return id;
}

function getEndpoint() {
  return window.__MEGURI_TELEMETRY_URL || import.meta.env.VITE_TELEMETRY_URL || null;
}

function loadQueue() {
  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    if (stored) queue = JSON.parse(stored);
  } catch { /* ignore */ }
}

function persistQueue() {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE)));
  } catch { /* ignore */ }
}

function flush() {
  const endpoint = getEndpoint();
  if (!endpoint || queue.length === 0) return;

  const batch = queue.splice(0);
  persistQueue();

  const payload = JSON.stringify({ events: batch });

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }));
    if (!sent) {
      queue.unshift(...batch);
      persistQueue();
    }
    return;
  }

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {
    queue.unshift(...batch);
    persistQueue();
  });
}

function startFlushTimer() {
  if (timer) return;
  timer = setInterval(flush, FLUSH_INTERVAL);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('pagehide', flush);
}

export function track(event, props = {}) {
  if (!getEndpoint()) return;

  queue.push({
    e: event,
    aid: getAnonId(),
    sid: getSessionId(),
    ts: Date.now(),
    ...props,
  });

  if (queue.length >= MAX_QUEUE) flush();
  persistQueue();
  startFlushTimer();
}

export function trackPageView(tab, extra = {}) {
  track('page_view', { tab, ...extra });
}

export function trackFeature(feature, extra = {}) {
  track('feature', { feature, ...extra });
}

export function trackContent(action, category, itemId) {
  track('content', { action, category, item: itemId });
}

export function trackEvent(name, extra = {}) {
  track('event', { name, ...extra });
}

loadQueue();
