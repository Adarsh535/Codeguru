export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://codegurru.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/profile',
          '/profile/*',
          '/my-batch',
          '/my-batch/*',
          '/api/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/profile',
          '/profile/*',
          '/my-batch',
          '/my-batch/*',
          '/api/*',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/logo.png', '/logo-icon.png', '/full-brand-logo.png', '/images/*', '/*.png', '/*.jpg', '/*.webp'],
        disallow: [],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
