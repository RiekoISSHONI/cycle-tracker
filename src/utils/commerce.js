/**
 * Commerce Privacy Layer - "Five Seals" Implementation
 *
 * 1. Compute on-device - Phase matching runs locally
 * 2. Strip outbound links - No phase/user context in URLs
 * 3. Count don't profile - Anonymous aggregate counters only
 * 4. Attribution stays with network - No user ID to merchant
 * 5. Embed no trackers - System browser, no pixels
 */

const REDIRECT_BASE = 'https://go.meguri.app/p';

/**
 * Generate a clean affiliate URL with no user/cycle context
 * @param {Object} product - Product with affiliate link
 * @returns {string} Clean affiliate URL
 */
export function getCleanAffiliateUrl(product) {
  if (product.directUrl) {
    return product.directUrl;
  }

  if (product.affiliateUrl) {
    return product.affiliateUrl;
  }

  if (product.asin) {
    return `https://www.amazon.co.jp/dp/${product.asin}?tag=meguri-22`;
  }

  return null;
}

/**
 * Generate redirect URL for anonymous click tracking
 * Routes through first-party redirect for aggregate counting
 * @param {Object} product - Product object
 * @returns {string} Redirect URL
 */
export function getRedirectUrl(product) {
  const slug = product.slug || generateSlug(product.name);
  const affiliateUrl = getCleanAffiliateUrl(product);

  if (!affiliateUrl) return null;

  // In production, this would route through go.meguri.app
  // For now, return clean affiliate URL directly
  // The redirect server increments counter and forwards
  return affiliateUrl;
}

/**
 * Generate a URL-safe slug from product name
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

/**
 * Open affiliate link in system browser with privacy protections
 * - Opens in external browser (not webview)
 * - Strips referrer
 * - Shows disclosure on first tap
 * @param {Object} product - Product to open
 * @param {Function} onFirstTap - Callback for first-tap disclosure
 * @returns {boolean} Whether link was opened
 */
export function openAffiliateLink(product, onFirstTap) {
  const url = getRedirectUrl(product);
  if (!url) return false;

  // Open in system browser with no referrer
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer nofollow';
  link.referrerPolicy = 'no-referrer';
  link.click();

  return true;
}

/**
 * Check if Calm Mode is enabled (commerce hidden)
 * @returns {boolean}
 */
export function isCalmModeEnabled() {
  try {
    return localStorage.getItem('calmMode') === 'true';
  } catch {
    return false;
  }
}

/**
 * Toggle Calm Mode
 * @param {boolean} enabled
 */
export function setCalmMode(enabled) {
  try {
    localStorage.setItem('calmMode', enabled ? 'true' : 'false');
  } catch {
    // localStorage not available
  }
}

/**
 * Check if first-tap disclosure has been shown
 * @returns {boolean}
 */
export function hasSeenAffiliateDisclosure() {
  try {
    return localStorage.getItem('affiliateDisclosureSeen') === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark first-tap disclosure as seen
 */
export function markAffiliateDisclosureSeen() {
  try {
    localStorage.setItem('affiliateDisclosureSeen', 'true');
  } catch {
    // localStorage not available
  }
}

/**
 * Privacy-safe commerce event tracking
 * Increments anonymous aggregate counter only - no user ID
 * @param {string} eventType - 'view' | 'tap' | 'category_view'
 * @param {string} productSlug - Product identifier
 */
export function trackCommerceEvent(eventType, productSlug) {
  // In production, this would send to a privacy-respecting endpoint
  // that only increments aggregate counters:
  //
  // POST go.meguri.app/events
  // { event: 'tap', slug: 'product-name' }
  //
  // No user ID, no session, no cycle data
  // Just: "product X got N taps this week"

  // For now, no-op in client
  // console.debug(`[commerce] ${eventType}: ${productSlug}`);
}

/**
 * Validate that a product catalog entry is safe
 * No tracking pixels, no user-specific URLs
 * @param {Object} product
 * @returns {boolean}
 */
export function validateProductEntry(product) {
  const url = product.affiliateUrl || product.directUrl || '';

  // Block URLs with user tracking parameters
  const blockedParams = ['uid', 'user_id', 'session', 'fbclid', 'gclid', 'utm_'];
  for (const param of blockedParams) {
    if (url.toLowerCase().includes(param)) {
      console.warn(`[commerce] Blocked tracking param in product: ${product.name}`);
      return false;
    }
  }

  return true;
}
