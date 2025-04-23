/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'glow-yellow': '0 0 8px rgba(253, 224, 71, 0.7)',
        'glow-orange': '0 0 8px rgba(253, 186, 116, 0.7)',
        'glow-blue': '0 0 8px rgba(96, 165, 250, 0.7)',
        'glow-purple': '0 0 8px rgba(167, 139, 250, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'slow-ping': {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
};