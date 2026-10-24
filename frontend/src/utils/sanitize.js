/**
 * ============================================================================
 * SECURITY UTILITY: XSS SANITIZER & HTML ESCAPER (frontend/src/utils/sanitize.js)
 * ============================================================================
 * Neutralizes Cross-Site Scripting (XSS) vectors in input fields:
 * - Code editor inputs
 * - Comments & inquiries
 * - Student profile names & bios
 */

/**
 * Strips script tags, inline event handlers (onerror, onload, onclick),
 * and javascript: pseudo-protocols from raw user strings.
 * @param {string} input - User provided input string
 * @returns {string} Sanitized safe string
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return input || '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\bon[a-zA-Z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '')
    .replace(/javascript\s*:[^'"\s>]+/gi, '')
    .trim();
}

/**
 * Escapes characters with special HTML meaning into safe entity representations.
 * @param {string} str - Raw input
 * @returns {string} Entity-escaped representation
 */
export function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  return str.replace(/[&<>"'/]/g, (match) => htmlEntities[match]);
}

/**
 * Validates whether an input string contains raw, unescaped malicious scripts.
 * @param {string} input
 * @returns {boolean} True if malicious script tags or handlers are detected
 */
export function containsXss(input) {
  if (!input || typeof input !== 'string') return false;
  const xssPatterns = [
    /<script\b/i,
    /<\/script>/i,
    /\bonerror\s*=/i,
    /\bonload\s*=/i,
    /\bonclick\s*=/i,
    /\bonmouseover\s*=/i,
    /javascript:/i,
    /<img[^>]+src=[^>]+onerror/i,
    /<svg[^>]+onload/i
  ];
  return xssPatterns.some(pattern => pattern.test(input));
}
