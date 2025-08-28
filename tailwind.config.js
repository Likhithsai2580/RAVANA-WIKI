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
        'bounce-in': 'bounceIn 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'rotate-in': 'rotateIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
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
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(99, 102, 241, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-10deg) scale(0.8)', opacity: '0' },
          '100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  // Add dark mode support
  darkMode: 'class',
}