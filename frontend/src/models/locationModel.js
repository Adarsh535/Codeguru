/**
 * LOCATION MODEL & STORE
 * Manages location data and helper methods for filtering locations.
 */

export const LOCATIONS = [
  { id: 'loc-lko', name: 'Lucknow, UP', state: 'Uttar Pradesh (Capital HQ)', icon: '🏛️', popular: true, count: 580 },
  { id: 'loc-ayodhya', name: 'Ayodhya, UP', state: 'Uttar Pradesh (Branch Campus)', icon: '🚩', popular: true, count: 275 },
  { id: 'loc-kanpur', name: 'Kanpur, UP', state: 'Uttar Pradesh', icon: '🏬', popular: true, count: 195 },
  { id: 'loc-varanasi', name: 'Varanasi, UP', state: 'Uttar Pradesh', icon: '🛕', popular: true, count: 120 },
  { id: 'loc-1', name: 'Bengaluru, KA', state: 'Karnataka', icon: '📍', popular: true, count: 420 },
  { id: 'loc-2', name: 'Mumbai, MH', state: 'Maharashtra', icon: '🌆', popular: true, count: 310 },
  { id: 'loc-3', name: 'Delhi-NCR', state: 'Delhi/Gurugram/Noida', icon: '🏛️', popular: true, count: 280 },
  { id: 'loc-4', name: 'Hyderabad, TS', state: 'Telangana', icon: '💎', popular: true, count: 250 },
  { id: 'loc-5', name: 'Pune, MH', state: 'Maharashtra', icon: '🏫', popular: true, count: 190 },
  { id: 'loc-6', name: 'Work From Home (Remote)', state: 'Pan India', icon: '💻', popular: true, count: 520 }
];

export const getLocationById = (id) => LOCATIONS.find(loc => loc.id === id);
export const getPopularLocations = () => LOCATIONS.filter(loc => loc.popular);
