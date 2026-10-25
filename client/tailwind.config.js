/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F5EFE6',
          200: '#EBDDCF',
          300: '#DEC6B1',
          400: '#D0AF93',
        },
        peach: {
          50: '#FFF7F2',
          100: '#FDEEE3',
          200: '#FBD5BF',
          300: '#F8B694',
          400: '#F49568',
          500: '#E07A5F',
          600: '#D95D39',
          700: '#B84725',
          800: '#94371D',
          900: '#7A2C17',
        },
        charcoal: {
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(184, 71, 37, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft': '0 4px 20px -2px rgba(184, 71, 37, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(184, 71, 37, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
