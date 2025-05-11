/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          DEFAULT: '#4E3629', // or pick your preferred brown
          dark: '#6B3F16',
          light: '#B07D4B',
        },
      },
    },
  },
  plugins: [],
}
