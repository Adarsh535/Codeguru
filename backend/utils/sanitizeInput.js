/**
 * ============================================================================
 * SECURITY UTILITY: INPUT SANITIZER (utils/sanitizeInput.js)
 * ============================================================================
 * Strips ALL HTML tags/scripts from free-text fields before they are stored,
 * so public-submitted data (lead name/message, analytics titles/referrers)
 * can never execute as script when later rendered in the admin panel (stored XSS).
 */

import xss from 'xss';

const STRIP_ALL = { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ['script', 'style'] };

/**
 * Clean a single string value: trim + remove every HTML tag.
 * Non-strings are returned unchanged.
 */
export const cleanText = (value) => {
  if (typeof value !== 'string') return value;
  return xss(value, STRIP_ALL).trim();
};
