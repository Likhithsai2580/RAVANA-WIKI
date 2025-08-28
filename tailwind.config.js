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
        'primary': '#6366f1',
        'primary-focus': '#4f46e5',
        'primary-content': '#ffffff',

        'secondary': '#f97316',
        'secondary-focus': '#ea580c',
        'secondary-content': '#ffffff',

        'accent': '#8b5cf6',
        'accent-focus': '#7c3aed',
        'accent-content': '#ffffff',

        'neutral': '#1e293b',
        'neutral-focus': '#334155',
        'neutral-content': '#cbd5e1',

        'base-100': '#0f172a',
        'base-200': '#1e293b',
        'base-300': '#334155',
        'base-content': '#f1f5f9',

        'info': '#22d3ee',
        'success': '#4ade80',
        'warning': '#facc15',
        'error': '#f87171',

        'wiki-blue': '#3b82f6',
        'wiki-blue-dark': '#2563eb',
        'wiki-bg': '#0a1122',
        'wiki-dark-bg': '#0f172a',
        'wiki-content-bg': '#1e293b',
        'wiki-content-bg-hover': '#334155',
        'wiki-text-light': '#f1f5f9',
        'wiki-text-muted': '#94a3b8',
        'wiki-border': '#334155',
        'wiki-accent': '#8b5cf6',
        
        // Light theme colors
        'light-base-100': '#ffffff',
        'light-base-200': '#f8fafc',
        'light-base-300': '#e2e8f0',
        'light-base-content': '#0f172a',
        'light-wiki-content-bg': '#f1f5f9',
        'light-wiki-content-bg-hover': '#e2e8f0',
        'light-wiki-text-light': '#0f172a',
        'light-wiki-text-muted': '#64748b',
        'light-wiki-border': '#cbd5e1',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'smooth-slide-down': 'smoothSlideDown 0.3s ease-out forwards',
        'smooth-slide-up': 'smoothSlideUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        smoothSlideDown: {
          '0%': { 'max-height': '0', opacity: '0' },
          '100%': { 'max-height': '500px', opacity: '1' },
        },
        smoothSlideUp: {
          '0%': { 'max-height': '500px', opacity: '1' },
          '100%': { 'max-height': '0', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
  // Add dark mode support
  darkMode: 'class',
}