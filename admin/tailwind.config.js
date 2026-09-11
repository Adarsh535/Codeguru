/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          sidebar: '#ffffff',
          body: '#f4f6fb',
          card: '#ffffff',
          accent: '#4f46e5', // Indigo primary
          brand: '#2563eb', // Blue brand
          darkText: '#0f172a',
          mutedText: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'metoxi': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'metoxi-hover': '0 10px 25px -5px rgba(37, 99, 235, 0.12)',
      }
    },
  },
  plugins: [],
}
