/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#70263F',
          50: '#FDF5F8',
          100: '#F8E9EF',
          200: '#EFC8D6',
          300: '#E0A7BD',
          400: '#D98FA8',
          500: '#70263F',
          600: '#5E1F35',
          700: '#4A172B',
          800: '#3A1121',
          900: '#2B0C19',
        },
        charcoal: '#30252B',
        muted: '#897D83',
        ivory: '#FFFCFD',
        blush: '#F8E9EF',
        palepink: '#FDF5F8',
        dustyrose: '#D98FA8',
        success: {
          DEFAULT: '#4F9D69',
          50: '#EDF8F0',
          100: '#D4EDDB',
        },
        warning: {
          DEFAULT: '#C8862E',
          50: '#FBF3E6',
          100: '#F5E2C2',
        },
        danger: {
          DEFAULT: '#A3344A',
          50: '#FAEDEF',
          100: '#F0D2D8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgba(74, 23, 43, 0.06), 0 1px 2px -1px rgba(74, 23, 43, 0.04)',
        card: '0 4px 24px -8px rgba(74, 23, 43, 0.10), 0 2px 8px -4px rgba(74, 23, 43, 0.06)',
        elevated: '0 12px 40px -12px rgba(74, 23, 43, 0.18)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
