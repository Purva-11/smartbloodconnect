/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563eb',
          'blue-dark': '#1746b2',
          sky: '#38bdf8',
          cyan: '#06d9ff',
          red: '#e11d48',
          coral: '#fb5b63',
          green: '#10b981',
          amber: '#f59e0b',
          navy: '#081426',
          'dark-blue': '#10213b',
          slate: '#536780',
          bg: '#eaf7ff',
          'bg-secondary': '#f5fbff',
          'dark-bg': '#06101e',
          'dark-bg-sec': '#091727'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        'xl': '30px',
        'lg': '22px',
        'md': '16px',
        'sm': '11px',
      },
      boxShadow: {
        'glass': '0 20px 60px rgba(40,95,150,.12)',
        'glass-hover': '0 28px 75px rgba(37,99,235,.19)',
        'dark-glass': '0 25px 70px rgba(0,0,0,.34)',
      },
      backdropBlur: {
        'xs': '2px',
        'md': '12px',
        'lg': '20px',
      }
    },
  },
  plugins: [],
}
