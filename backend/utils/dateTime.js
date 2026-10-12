/**
 * ============================================================================
 * DATE & TIME UTILITY: TIMEZONE-AWARE CALCULATIONS (backend/utils/dateTime.js)
 * ============================================================================
 * Handles date formatting and boundary calculations in Indian Standard Time (IST, UTC+5:30)
 * or system local timezone.
 */

// IST offset is UTC + 5.5 hours (330 minutes)
const IST_OFFSET_MINUTES = 330;

/**
 * Get Date object adjusted to IST
 * @param {Date|string|number} [dateInput]
 * @returns {Date}
 */
export function getISTDate(dateInput = new Date()) {
  const d = new Date(dateInput);
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  return new Date(utc + (IST_OFFSET_MINUTES * 60000));
}

/**
 * Format a Date object into YYYY-MM-DD in IST
 * @param {Date} [date]
 * @returns {string} e.g. "2026-10-12"
 */
export function formatDateKey(date = new Date()) {
  const istDate = getISTDate(date);
  const y = istDate.getFullYear();
  const m = String(istDate.getMonth() + 1).padStart(2, '0');
  const d = String(istDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns today's date string (YYYY-MM-DD)
 */
export function getTodayKey() {
  return formatDateKey(new Date());
}

/**
 * Returns yesterday's date string (YYYY-MM-DD)
 */
export function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDateKey(d);
}

/**
 * Returns start of current month date string (YYYY-MM-01)
 */
export function getMonthStartKey() {
  const istDate = getISTDate(new Date());
  const y = istDate.getFullYear();
  const m = String(istDate.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}

/**
 * Generate an array of date strings for the past N days inclusive of today
 * @param {number} days
 * @returns {string[]}
 */
export function getPastNDaysKeys(days = 7) {
  const keys = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(formatDateKey(d));
  }
  return keys;
}

/**
 * Generate date strings between two date strings (YYYY-MM-DD) inclusive
 * @param {string} startStr
 * @param {string} endStr
 * @returns {string[]}
 */
export function getDateRangeKeys(startStr, endStr) {
  const keys = [];
  const start = new Date(startStr);
  const end = new Date(endStr);
  
  // Guard against invalid dates or inverted ranges
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return getPastNDaysKeys(7);
  }

  let curr = new Date(start);
  while (curr <= end && keys.length <= 365) {
    keys.push(formatDateKey(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return keys;
}
