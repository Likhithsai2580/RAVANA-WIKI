/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wiki-blue': '#1e40af',
        'wiki-light': '#f8fafc',
        'wiki-dark': '#0f172a',
      },
    },
  },
  plugins: [],
}