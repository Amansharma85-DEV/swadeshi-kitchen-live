/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#f97316',
          600: '#ea580c'
        }
      },
      boxShadow: {
        soft: '0 18px 60px rgba(15, 23, 42, 0.14)'
      }
    }
  },
  plugins: []
};
