/**
 * ============================================================================
 * SECURITY UTILITY: XSS SANITIZER & HTML ESCAPER (admin/src/utils/sanitize.js)
 * ============================================================================
 * Neutralizes Cross-Site Scripting (XSS) vectors in input fields:
 * - Code editor inputs
 * - Comments & notes
 * - Admin profile names & content management fields
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
