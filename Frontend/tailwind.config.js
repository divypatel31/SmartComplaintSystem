/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"Nunito"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-md': '0 4px 12px -2px rgba(0,0,0,0.09), 0 2px 6px -2px rgba(0,0,0,0.05)',
        'card-lg': '0 20px 40px -8px rgba(0,0,0,0.10), 0 8px 16px -4px rgba(0,0,0,0.06)',
        'brand':   '0 4px 14px 0 rgba(99,102,241,0.30)',
        'inner-sm':'inset 0 1px 2px rgba(0,0,0,0.05)',
      },
      animation: {
        'fade-in':   'fadeIn 0.35s ease forwards',
        'slide-up':  'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-down':'slideDown 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':  'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-soft':'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                                 to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-10px)' },to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(0.96)' },      to: { opacity: 1, transform: 'scale(1)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } },
      },
    },
  },
  plugins: [],
}
