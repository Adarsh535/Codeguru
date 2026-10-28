export default function manifest() {
  return {
    name: 'CodeGurru - Coding, Robotics & IT Training Institute',
    short_name: 'CodeGurru',
    description:
      'CodeGurru (UK VK Pvt. Ltd.) is Uttar Pradesh’s premier tech hub. 100% placement IT bootcamps, custom software development & same-day laptop repair.',
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#070b14',
    theme_color: '#070b14',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/images/codeguru-guru-logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/images/codeguru-guru-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/logo-icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
  };
}
