/**
 * LOCATION SANITIZER UTILITY
 * Ensures IP / ISP telecom nodes in Uttar Pradesh (e.g. Bahraich, Bahraigh, Barabanki)
 * are accurately resolved & mapped to Lucknow, UP (or user's selected hub).
 */

export const DEFAULT_LUCKNOW_LOCATION = {
  id: 'loc-lko',
  name: 'Lucknow, UP',
  city: 'Lucknow',
  state: 'Uttar Pradesh (Capital HQ)',
  icon: '🏛️',
  autoDetected: true
};

export function sanitizeLocation(locObj) {
  if (!locObj) return DEFAULT_LUCKNOW_LOCATION;

  const nameStr = (locObj.name || locObj.city || '').toLowerCase();
  
  // Coarse IP/ISP telecom routing nodes in UP that frequently mistarget Lucknow visitors
  const coarseUpNodes = ['bahraich', 'bahraigh', 'bahraig', 'barabanki', 'bara banki', 'unknown', 'telecom'];

  const isCoarseNode = coarseUpNodes.some(node => nameStr.includes(node));

  if (isCoarseNode) {
    return DEFAULT_LUCKNOW_LOCATION;
  }

  return locObj;
}

export function sanitizeCityName(rawCity, rawRegion) {
  if (!rawCity) return 'Lucknow';
  const cityLower = rawCity.trim().toLowerCase();
  
  const coarseUpNodes = ['bahraich', 'bahraigh', 'bahraig', 'barabanki', 'bara banki', 'unknown', 'telecom'];
  if (coarseUpNodes.some(node => cityLower.includes(node))) {
    return 'Lucknow';
  }
  return rawCity.trim();
}
