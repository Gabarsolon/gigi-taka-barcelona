/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          dark: '#0a1d12',
          DEFAULT: '#0f2f1d',
          light: '#16432a',
          line: 'rgba(255, 255, 255, 0.15)'
        },
        gold: {
          light: '#fde047',
          DEFAULT: '#eab308',
          dark: '#ca8a04'
        },
        gigi: {
          red: '#dc2626',
          blue: '#1d4ed8',
          yellow: '#facc15'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Impact', 'Arial Black', 'sans-serif']
      }
    },
  },
  plugins: [],
}
