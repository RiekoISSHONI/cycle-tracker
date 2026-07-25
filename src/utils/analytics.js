const STORAGE_KEY = 'meguri_engagement';

function getStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { impressions: {}, clicks: {}, daily: {} };
  } catch { return { impressions: {}, clicks: {}, daily: {} }; }
}

function save(store) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch {}
}

function today() {
  return new Date().toISOString().split('T')[0];
}

export function trackImpression(category, itemId) {
  const store = getStore();
  const key = `${category}:${itemId}`;
  store.impressions[key] = (store.impressions[key] || 0) + 1;

  const day = today();
  if (!store.daily[day]) store.daily[day] = { impressions: {}, clicks: {} };
  store.daily[day].impressions[key] = (store.daily[day].impressions[key] || 0) + 1;

  save(store);
}

export function trackClick(category, itemId) {
  const store = getStore();
  const key = `${category}:${itemId}`;
  store.clicks[key] = (store.clicks[key] || 0) + 1;

  const day = today();
  if (!store.daily[day]) store.daily[day] = { impressions: {}, clicks: {} };
  store.daily[day].clicks[key] = (store.daily[day].clicks[key] || 0) + 1;

  save(store);
}

export function getEngagementSummary() {
  const store = getStore();
  const categories = {};

  Object.entries(store.impressions).forEach(([key, count]) => {
    const [cat] = key.split(':');
    if (!categories[cat]) categories[cat] = { impressions: 0, clicks: 0, items: {} };
    categories[cat].impressions += count;
    categories[cat].items[key] = { impressions: count, clicks: store.clicks[key] || 0 };
  });

  Object.entries(store.clicks).forEach(([key, count]) => {
    const [cat] = key.split(':');
    if (!categories[cat]) categories[cat] = { impressions: 0, clicks: 0, items: {} };
    categories[cat].clicks += count;
    if (!categories[cat].items[key]) categories[cat].items[key] = { impressions: 0, clicks: 0 };
    categories[cat].items[key].clicks = count;
  });

  Object.values(categories).forEach(cat => {
    cat.ctr = cat.impressions > 0 ? Math.round((cat.clicks / cat.impressions) * 1000) / 10 : 0;
  });

  return {
    categories,
    totalImpressions: Object.values(store.impressions).reduce((a, b) => a + b, 0),
    totalClicks: Object.values(store.clicks).reduce((a, b) => a + b, 0),
    activeDays: Object.keys(store.daily).length,
  };
}

export function rotatePool(pool, count, seed) {
  if (!pool || pool.length <= count) return pool || [];
  const start = seed % pool.length;
  const result = [];
  for (let i = 0; i < count; i++) result.push(pool[(start + i) % pool.length]);
  return result;
}

export function getDayOfYear() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
}
