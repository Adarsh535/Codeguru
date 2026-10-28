export default function manifest() {
  return {
    name: 'CodeGurru | Best IT Training, Software Development & Laptop Repair',
    short_name: 'CodeGurru',
    description:
      'CodeGurru (UK VK Pvt. Ltd.) is Uttar Pradesh’s premier tech hub founded by Kishan Pandey. 100% placement IT bootcamps, custom software development & same-day laptop repair.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#f59e0b',
    icons: [
      {
        src: '/logo-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
