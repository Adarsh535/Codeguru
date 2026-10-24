/**
 * ============================================================================
 * UTILITY: REAL-TIME STUDENT GEOLOCATION DETECTOR (geoLocator.js)
 * ============================================================================
 * Primary Source: Browser HTML5 Geolocation API (navigator.geolocation)
 * High accuracy, 10s timeout, fresh (maximumAge: 0).
 * Reverse Geocoding: OpenStreetMap Nominatim with BigDataCloud fallback.
 * Strictly avoids silent fallback to random/hardcoded cities for student inquiries.
 */

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
  return stateName.length <= 3 ? stateName.toUpperCase() : stateName.slice(0, 2).toUpperCase();
}

/**
 * Reverse geocode latitude and longitude into City and State.
 * Uses OpenStreetMap Nominatim as primary, BigDataCloud as secondary fallback.
 */
export async function reverseGeocodeLatLng(latitude, longitude) {

  // 1. Primary Reverse Geocoder: OpenStreetMap Nominatim
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    const res = await fetch(nominatimUrl, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'CodeGurru-StudentInquiry/1.0'
      }
    });

    if (res.ok) {
      const data = await res.json();
      console.log('[CodeGurru Geo] Reverse Geocode Response (Nominatim):', data);

      const addr = data?.address || {};
      // Prioritize most specific city/settlement names
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.suburb ||
        addr.city_district ||
        addr.district ||
        addr.county ||
        addr.state_district ||
        '';

      const state = addr.state || '';
      const stateCode = getStateCode(state);

      if (city) {
        console.log('[CodeGurru Geo] Resolved City (Nominatim):', { city, state, stateCode });
        return {
          city: city.trim(),
          state: state.trim(),
          stateCode,
          provider: 'nominatim'
        };
      }
    }
  } catch (err) {
    console.warn('[CodeGurru Geo] Nominatim reverse geocode error:', err.message);
  }

  // 2. Secondary Fallback: BigDataCloud Reverse Geocode
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(bdcUrl);

    if (res.ok) {
      const data = await res.json();
      console.log('[CodeGurru Geo] Reverse Geocode Response (BigDataCloud):', data);

      // Important: Do NOT use principalSubdivision (that is state, not city)
      const city = data?.city || data?.locality || '';
      const state = data?.principalSubdivision || '';
      const stateCode = getStateCode(state);

      if (city) {
        console.log('[CodeGurru Geo] Resolved City (BigDataCloud):', { city, state, stateCode });
        return {
          city: city.trim(),
          state: state.trim(),
          stateCode,
          provider: 'bigdatacloud'
        };
      }
    }
  } catch (err) {
    console.warn('[CodeGurru Geo] BigDataCloud reverse geocode error:', err.message);
  }

  return {
    city: '',
    state: '',
    stateCode: '',
    provider: 'none'
  };
}

/**
 * High-accuracy student location fetcher for inquiries.
 * - Always fresh (maximumAge: 0)
 * - 10-second timeout
 * - Browser Geolocation API as primary source
 * - Returns detailed status so the inquiry form knows whether permission was allowed, denied, or timed out.
 */
export async function getFreshStudentLocation() {
  if (typeof window === 'undefined') {
    return { success: false, error: 'server_env', message: 'Window is not defined' };
  }

  // Geolocation requires secure context (HTTPS or localhost)
  if (!window.isSecureContext) {
    console.warn('[CodeGurru Geo] Warning: Browser Geolocation requires HTTPS or localhost');
  }

  if (!('geolocation' in navigator)) {
    console.warn('[CodeGurru Geo] navigator.geolocation not supported by browser');
    return { success: false, error: 'not_supported', message: 'Geolocation is not supported by your browser' };
  }

  return new Promise((resolve) => {
    let resolved = false;

    // Safety timeout in case browser hangs on prompt
    const safetyTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn('[CodeGurru Geo] Geolocation request timed out after 10000ms');
        resolve({
          success: false,
          error: 'timeout',
          message: 'Location detection timed out. Please enter your city manually.'
        });
      }
    }, 10500);

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (resolved) return;
          resolved = true;
          clearTimeout(safetyTimer);

          const { latitude, longitude, accuracy } = position.coords;

          try {
            const geoResult = await reverseGeocodeLatLng(latitude, longitude);

            if (geoResult.city) {
              const displayLocation = geoResult.stateCode
                ? `${geoResult.city}, ${geoResult.stateCode}`
                : `${geoResult.city}${geoResult.state ? `, ${geoResult.state}` : ''}`;

              console.log('[CodeGurru Geo] Final City Saved:', {
                city: geoResult.city,
                state: geoResult.state,
                displayLocation,
                source: 'gps'
              });

              resolve({
                success: true,
                city: geoResult.city,
                state: geoResult.state,
                stateCode: geoResult.stateCode,
                location: displayLocation,
                latitude,
                longitude,
                accuracy,
                source: 'gps',
                isApproximate: false
              });
              return;
            }

            // GPS coordinates received but reverse geocoding failed to find a city
            resolve({
              success: false,
              latitude,
              longitude,
              error: 'reverse_geocode_failed',
              message: 'Could not resolve city name from coordinates. Please enter your city manually.'
            });
          } catch (geoErr) {
            resolve({
              success: false,
              latitude,
              longitude,
              error: 'reverse_geocode_error',
              message: geoErr.message
            });
          }
        },
        (error) => {
          if (resolved) return;
          resolved = true;
          clearTimeout(safetyTimer);

          let errorType = 'error';
          let userMessage = 'Unable to retrieve your location.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorType = 'permission_denied';
              userMessage = 'Location permission was denied. Please enter your city manually.';
              console.warn('[CodeGurru Geo] Geolocation permission denied by user.');
              break;
            case error.POSITION_UNAVAILABLE:
              errorType = 'position_unavailable';
              userMessage = 'Location information is currently unavailable.';
              console.warn('[CodeGurru Geo] Geolocation position unavailable.');
              break;
            case error.TIMEOUT:
              errorType = 'timeout';
              userMessage = 'Location request timed out.';
              console.warn('[CodeGurru Geo] Geolocation request timed out.');
              break;
            default:
              console.warn('[CodeGurru Geo] Geolocation error:', error.message);
              break;
          }

          resolve({
            success: false,
            error: errorType,
            message: userMessage
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (e) {
      if (!resolved) {
        resolved = true;
        clearTimeout(safetyTimer);
        resolve({
          success: false,
          error: 'unexpected_error',
          message: e.message
        });
      }
    }
  });
}

/**
 * Optional IP-based lookup used ONLY as an approximate hint when GPS is denied/failed.
 * Clearly tagged with source: 'ip' and isApproximate: true.
 */
export async function getApproximateIpLocation() {
  // Service 1: ipwho.is
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.city) {
        const city = data.city.trim();
        const state = data.region || '';
        const stateCode = data.region_code || getStateCode(state);
        const name = `${city}, ${stateCode || state}`;
        console.log('[CodeGurru Geo] IP Lookup (ipwho.is, approximate):', { city, state, name });
        return {
          success: true,
          city,
          state,
          stateCode,
          location: name,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          source: 'ip',
          isApproximate: true
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
        const state = data.principalSubdivision || '';
        const stateCode = getStateCode(state);
        const name = `${city}, ${stateCode || state}`;
        console.log('[CodeGurru Geo] IP Lookup (BigDataCloud, approximate):', { city, state, name });
        return {
          success: true,
          city,
          state,
          stateCode,
          location: name,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          source: 'ip',
          isApproximate: true
        };
      }
    }
  } catch (e) {}

  return { success: false, error: 'ip_failed' };
}

/**
 * Backward compatibility helper for placement filter / visitor display
 */
export function getQuickLocationSync() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('codeguru_selected_location') || localStorage.getItem('codeguru_detected_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) return parsed.name;
        if (parsed?.city) return parsed.city;
      }
    } catch (e) {}
  }
  return '';
}

/**
 * Backward compatibility helper for placement filter
 */
export async function detectStudentRealLocation(forceRefresh = false) {
  // Try fresh GPS first
  const gpsRes = await getFreshStudentLocation();
  if (gpsRes.success) {
    const locObj = {
      id: `gps-${Date.now()}`,
      name: gpsRes.location,
      city: gpsRes.city,
      state: gpsRes.state,
      stateCode: gpsRes.stateCode,
      latitude: gpsRes.latitude,
      longitude: gpsRes.longitude,
      source: 'gps',
      autoDetected: true
    };
    try {
      localStorage.setItem('codeguru_selected_location', JSON.stringify(locObj));
    } catch (e) {}
    return locObj;
  }

  // Fallback to IP approximate
  const ipRes = await getApproximateIpLocation();
  if (ipRes.success) {
    const locObj = {
      id: `ip-${Date.now()}`,
      name: ipRes.location,
      city: ipRes.city,
      state: ipRes.state,
      stateCode: ipRes.stateCode,
      latitude: ipRes.latitude,
      longitude: ipRes.longitude,
      source: 'ip',
      autoDetected: true,
      isApproximate: true
    };
    return locObj;
  }

  return {
    id: 'loc-default',
    name: 'Ayodhya, UP',
    city: 'Ayodhya',
    state: 'Uttar Pradesh (HQ)',
    stateCode: 'UP',
    source: 'default',
    autoDetected: true
  };
}
