/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        urbandark: {
          800: '#1c2331',
          900: '#0a0e17',
        },
        urbanyellow: '#ffff64',
      }
    },
  },
  plugins: [],
}
