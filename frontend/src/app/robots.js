export default function robots() {
  const baseUrl = 'https://codegurru.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile/edit', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/profile/edit', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
