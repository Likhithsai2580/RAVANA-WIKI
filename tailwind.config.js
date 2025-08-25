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
        'wiki-blue': '#3b82f6',
        'wiki-blue-dark': '#2563eb',
        'wiki-dark-bg': '#0f172a',
        'wiki-content-bg': '#1e293b',
        'wiki-content-bg-hover': '#334155',
        'wiki-text-light': '#f1f5f9',
        'wiki-text-muted': '#94a3b8',
        'wiki-border': '#334155',
        'wiki-accent': '#8b5cf6',
      },
    },
  },
  plugins: [],
}