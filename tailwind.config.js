/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color-primary)',
        'primary-focus': 'var(--color-primary-focus)',
        'primary-content': 'var(--color-primary-content)',

        'secondary': 'var(--color-secondary)',
        'secondary-focus': 'var(--color-secondary-focus)',
        'secondary-content': 'var(--color-secondary-content)',

        'accent': 'var(--color-accent)',
        'accent-focus': 'var(--color-accent-focus)',
        'accent-content': 'var(--color-accent-content)',

        'neutral': 'var(--color-neutral)',
        'neutral-focus': 'var(--color-neutral-focus)',
        'neutral-content': 'var(--color-neutral-content)',

        'base-100': 'var(--color-base-100)',
        'base-200': 'var(--color-base-200)',
        'base-300': 'var(--color-base-300)',
        'base-content': 'var(--color-base-content)',

        'info': 'var(--color-info)',
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'error': 'var(--color-error)',

        'wiki-blue': 'var(--color-wiki-blue)',
        'wiki-blue-dark': 'var(--color-wiki-blue-dark)',
        'wiki-dark-bg': 'var(--color-wiki-dark-bg)',
        'wiki-content-bg': 'var(--color-wiki-content-bg)',
        'wiki-content-bg-hover': 'var(--color-wiki-content-bg-hover)',
        'wiki-text-light': 'var(--color-wiki-text-light)',
        'wiki-text-muted': 'var(--color-wiki-text-muted)',
        'wiki-border': 'var(--color-wiki-border)',
        'wiki-accent': 'var(--color-wiki-accent)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in-up': 'slideInUp 0.5s ease-in-out',
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
      },
    },
  },
  plugins: [],
}