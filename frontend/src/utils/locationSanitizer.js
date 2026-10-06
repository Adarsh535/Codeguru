/**
 * LOCATION SANITIZER UTILITY
 * Ensures IP / ISP telecom nodes in Uttar Pradesh are accurately resolved & mapped to Ayodhya, UP.
 */

export const DEFAULT_AYODHYA_LOCATION = {
  id: 'loc-ayodhya',
  name: 'Ayodhya, UP',
  city: 'Ayodhya',
  state: 'Uttar Pradesh (HQ)',
  icon: '🏛️',
  autoDetected: true
};

export function sanitizeLocation(locObj) {
  if (!locObj) return DEFAULT_AYODHYA_LOCATION;

  const nameStr = (locObj.name || locObj.city || '').toLowerCase();
  
  const coarseUpNodes = ['unknown', 'telecom'];

  const isCoarseNode = coarseUpNodes.some(node => nameStr.includes(node));

  if (isCoarseNode) {
    return DEFAULT_AYODHYA_LOCATION;
  }

  return locObj;
}

export function sanitizeCityName(rawCity, rawRegion) {
  if (!rawCity) return 'Ayodhya';
  const cityLower = rawCity.trim().toLowerCase();
  
  const coarseUpNodes = ['unknown', 'telecom'];
  if (coarseUpNodes.some(node => cityLower.includes(node))) {
    return 'Ayodhya';
  }
  return rawCity.trim();
}
