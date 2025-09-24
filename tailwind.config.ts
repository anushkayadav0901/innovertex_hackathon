import type { Config } from 'tailwindcss'

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f5ff',
          100: '#e3ebff',
          200: '#c2d1ff',
          300: '#9fb6ff',
          400: '#6c8cff',
          500: '#3b5cff',
          600: '#2846e6',
          700: '#1f36b3',
          800: '#182a8a',
          900: '#111e61',
        },
      },
      boxShadow: {
        glow: '0 0 0 3px rgba(59, 92, 255, 0.3)'
      },
    },
  },
  plugins: [],
} satisfies Config
