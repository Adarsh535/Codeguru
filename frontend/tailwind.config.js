/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Mukta sits in every stack so Hindi (Devanagari) text gets a matching font
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-mukta)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        heading: ['var(--font-jakarta)', 'var(--font-mukta)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-quart': 'cubic-bezier(0.5, 0, 0.75, 0)',
      },
      screens: {
        'xxs': '280px',
        'xs': '360px',
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          accent: '#06b6d4',
          dark: '#0b0f19',
          card: '#131b2e'
        }
      }
    },
  },
  plugins: [],
}
