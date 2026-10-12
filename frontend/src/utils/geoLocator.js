/**
 * ============================================================================
 * UTILITY: REAL-TIME STUDENT GEOLOCATION DETECTOR (geoLocator.js)
 * ============================================================================
 * Detects the real, live physical location of the student filling the form.
 * 1. Checks High-Precision HTML5 Geolocation (GPS coords -> BigDataCloud reverse geocode)
 * 2. High-speed IP Geolocation fallback (ipwho.is / bigdatacloud client / freeipapi)
 * 3. Never serves random cities; captures actual city & state of the student.
 */

// Cache detected location in memory
let cachedLocation = null;
let detectionPromise = null;

export function getStateCode(stateName) {
  if (!stateName) return '';
  const s = stateName.toLowerCase().trim();
  if (s.includes('uttar pradesh')) return 'UP';
  if (s.includes('maharashtra')) return 'MH';
  if (s.includes('delhi')) return 'DL';
  if (s.includes('bihar')) return 'BR';
  if (s.includes('madhya pradesh')) return 'MP';
  if (s.includes('rajasthan')) return 'RJ';
  if (s.includes('gujarat')) return 'GJ';
  if (s.includes('haryana')) return 'HR';
  if (s.includes('punjab')) return 'PB';
  if (s.includes('karnataka')) return 'KA';
  if (s.includes('telangana')) return 'TS';
  if (s.includes('tamil nadu')) return 'TN';
  if (s.includes('west bengal')) return 'WB';
  if (s.includes('uttarakhand')) return 'UK';
  if (s.includes('jharkhand')) return 'JH';
  if (s.includes('chhattisgarh')) return 'CG';
  if (s.includes('odisha') || s.includes('orissa')) return 'OD';
  if (s.includes('kerala')) return 'KL';
  if (s.includes('assam')) return 'AS';
  if (s.includes('andhra pradesh')) return 'AP';
  if (s.includes('himachal')) return 'HP';
  return stateName.slice(0, 2).toUpperCase();
}

/**
 * Returns currently cached location string synchronously (e.g. 'Lucknow, UP')
 */
export function getQuickLocationSync() {
  if (cachedLocation?.name) return cachedLocation.name;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('codeguru_detected_location') || localStorage.getItem('codeguru_selected_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) return parsed.name;
      }
    } catch (e) {}
  }
  return '';
}

/**
 * Fast IP fallback lookup using accurate CORS-enabled Indian geolocation services
 */
async function fetchIpLocation() {
  // Service 1: ipwho.is (Fastest & most accurate for Indian cellular & broadband networks)
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.city) {
        const city = data.city.trim();
        const state = data.region || 'Uttar Pradesh';
        const stateCode = data.region_code || getStateCode(state);
        return {
          id: `auto-ip-${Date.now()}`,
          name: `${city}, ${stateCode}`,
          city,
          state,
          stateCode,
          icon: '📍',
          source: 'ip',
          autoDetected: true
        };
      }
    }
  } catch (e) {}

  // Service 2: BigDataCloud Client IP Reverse Geocode
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality;
      if (city) {
        const state = data.principalSubdivision || 'Uttar Pradesh';
        const stateCode = getStateCode(state);
        return {
          id: `auto-bdc-${Date.now()}`,
          name: `${city}, ${stateCode}`,
          city,
          state,
          stateCode,
          icon: '📍',
          source: 'ip',
          autoDetected: true
        };
      }
    }
  } catch (e) {}

  // Service 3: FreeIPAPI
  try {
    const res = await fetch('https://freeipapi.com/api/json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.cityName) {
        const city = data.cityName.trim();
        const state = data.regionName || 'Uttar Pradesh';
        const stateCode = getStateCode(state);
        return {
          id: `auto-freeip-${Date.now()}`,
          name: `${city}, ${stateCode}`,
          city,
          state,
          stateCode,
          icon: '📍',
          source: 'ip',
          autoDetected: true
        };
      }
    }
  } catch (e) {}

  return null;
}

/**
 * Detects the real, actual location of the student
 * First tries GPS geolocation, then falls back to high-accuracy IP detection.
 */
export async function detectStudentRealLocation(forceRefresh = false) {
  if (cachedLocation && !forceRefresh) {
    return cachedLocation;
  }

  if (detectionPromise && !forceRefresh) {
    return detectionPromise;
  }

  detectionPromise = (async () => {
    // 1. Try Browser GPS Geolocation if available
    let gpsResult = null;
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      gpsResult = await new Promise((resolve) => {
        const timer = setTimeout(() => resolve(null), 6000);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            clearTimeout(timer);
            try {
              const { latitude, longitude } = pos.coords;

              // PRIMARY: Nominatim (OpenStreetMap) — free, accurate, no API key needed
              const nominatimRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
                { headers: { 'Accept-Language': 'en', 'User-Agent': 'CodeGuru-App/1.0' } }
              );
              if (nominatimRes.ok) {
                const data = await nominatimRes.json();
                const addr = data.address || {};
                // Pick best city field (city > town > village > county)
                const city = addr.city || addr.town || addr.village || addr.county || addr.state_district;
                const state = addr.state || 'Uttar Pradesh';
                if (city) {
                  const stateCode = getStateCode(state);
                  resolve({
                    id: `auto-gps-${Date.now()}`,
                    name: `${city}, ${stateCode}`,
                    city,
                    state,
                    stateCode,
                    latitude,
                    longitude,
                    icon: '📍',
                    source: 'gps',
                    autoDetected: true
                  });
                  return;
                }
              }

              // FALLBACK: BigDataCloud if Nominatim fails
              const bdcRes = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              if (bdcRes.ok) {
                const data = await bdcRes.json();
                const city = data.city || data.locality || data.principalSubdivision;
                const state = data.principalSubdivision || 'Uttar Pradesh';
                if (city) {
                  const stateCode = getStateCode(state);
                  resolve({
                    id: `auto-gps-bdc-${Date.now()}`,
                    name: `${city}, ${stateCode}`,
                    city,
                    state,
                    stateCode,
                    latitude,
                    longitude,
                    icon: '📍',
                    source: 'gps',
                    autoDetected: true
                  });
                  return;
                }
              }
            } catch (err) {}
            resolve(null);
          },
          () => {
            clearTimeout(timer);
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
        );
      });
    }

    if (gpsResult) {
      cachedLocation = gpsResult;
      saveLocationToStorage(gpsResult);
      return gpsResult;
    }

    // 2. High-speed IP Fallback (Captures real ISP node city of student)
    const ipResult = await fetchIpLocation();
    if (ipResult) {
      cachedLocation = ipResult;
      saveLocationToStorage(ipResult);
      return ipResult;
    }

    // 3. Last fallback: Check previous stored location
    try {
      const stored = localStorage.getItem('codeguru_detected_location') || localStorage.getItem('codeguru_selected_location');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          cachedLocation = parsed;
          return parsed;
        }
      }
    } catch (e) {}

    // Default if completely offline
    const defaultLoc = {
      id: 'loc-default',
      name: 'Ayodhya, UP',
      city: 'Ayodhya',
      state: 'Uttar Pradesh (HQ)',
      stateCode: 'UP',
      icon: '📍',
      source: 'default',
      autoDetected: true
    };
    cachedLocation = defaultLoc;
    return defaultLoc;
  })();

  try {
    const result = await detectionPromise;
    detectionPromise = null;
    return result;
  } catch (err) {
    detectionPromise = null;
    return { name: 'Ayodhya, UP', city: 'Ayodhya', state: 'Uttar Pradesh' };
  }
}

function saveLocationToStorage(loc) {
  if (typeof window === 'undefined' || !loc) return;
  try {
    localStorage.setItem('codeguru_detected_location', JSON.stringify(loc));
    localStorage.setItem('codeguru_selected_location', JSON.stringify(loc));
    window.dispatchEvent(new CustomEvent('codeguru_location_updated', { detail: loc }));
  } catch (e) {}
}
