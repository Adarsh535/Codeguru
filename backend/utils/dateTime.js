/**
 * ============================================================================
 * DATE & TIME UTILITY: TIMEZONE-AWARE CALCULATIONS (backend/utils/dateTime.js)
 * ============================================================================
 * Handles date formatting and boundary calculations in Indian Standard Time (IST, UTC+5:30)
 * using robust Intl.DateTimeFormat with Asia/Kolkata timezone.
 */

// Format Date into YYYY-MM-DD in Asia/Kolkata timezone
const istDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

/**
 * Format any Date/timestamp into YYYY-MM-DD string in Asia/Kolkata timezone
 * @param {Date|string|number} [dateInput]
 * @returns {string} e.g. "2026-10-13"
 */
export function formatDateKey(dateInput = new Date()) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) {
    return istDateFormatter.format(new Date());
  }
  return istDateFormatter.format(d);
}

/**
 * Returns today's date string in IST (YYYY-MM-DD)
 */
export function getTodayKey() {
  return formatDateKey(new Date());
}

/**
 * Returns yesterday's date string in IST (YYYY-MM-DD)
 */
export function getYesterdayKey() {
  const d = new Date();
  // Subtract 24 hours
  d.setTime(d.getTime() - 24 * 60 * 60 * 1000);
  return formatDateKey(d);
}

/**
 * Returns start of current month date string in IST (YYYY-MM-01)
 */
export function getMonthStartKey() {
  const todayKey = getTodayKey();
  const [year, month] = todayKey.split('-');
  return `${year}-${month}-01`;
}

/**
 * Generate an array of date strings for the past N days inclusive of today in IST
 * @param {number} days
 * @returns {string[]}
 */
export function getPastNDaysKeys(days = 7) {
  const keys = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
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
  const start = new Date(`${startStr}T00:00:00.000+05:30`);
  const end = new Date(`${endStr}T23:59:59.999+05:30`);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return getPastNDaysKeys(7);
  }

  let curr = new Date(start);
  while (curr <= end && keys.length <= 365) {
    keys.push(formatDateKey(curr));
    curr.setTime(curr.getTime() + 24 * 60 * 60 * 1000);
  }
  return keys;
}

/**
 * Return precise UTC Date boundaries corresponding to 00:00:00.000 IST and 23:59:59.999 IST
 * for a given YYYY-MM-DD dateKey
 * @param {string} dateKey - "YYYY-MM-DD"
 * @returns {{ start: Date, end: Date }}
 */
export function getISTDayBoundaries(dateKey) {
  const key = dateKey || getTodayKey();
  const start = new Date(`${key}T00:00:00.000+05:30`);
  const end = new Date(`${key}T23:59:59.999+05:30`);
  return { start, end };
}

/**
 * Return precise UTC Date boundaries for a range of IST dates
 * @param {string} startDateKey - "YYYY-MM-DD"
 * @param {string} endDateKey - "YYYY-MM-DD"
 * @returns {{ start: Date, end: Date }}
 */
export function getISTRangeBoundaries(startDateKey, endDateKey) {
  const startKey = startDateKey || getTodayKey();
  const endKey = endDateKey || getTodayKey();
  const start = new Date(`${startKey}T00:00:00.000+05:30`);
  const end = new Date(`${endKey}T23:59:59.999+05:30`);
  return { start, end };
}

