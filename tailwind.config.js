// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],

  /* 1️⃣  you rarely need a safelist once colors are tokens;
         keep only if you add classes dynamically with string-concats */
  safelist: [
    'animate-spin-slow', //  example: if you add animations conditionally
  ],

  theme: {
    extend: {
      /* 2️⃣  ———  STATPULSE PALETTE  ——— */
      colors: {
        /* Brand gradient stops */
        primary: {
          600: '#C82020',   // deep StatPulse red
          500: '#D33A3A',
        },
        accent: {
          600: '#FFCB3F',   // bright gold
          500: '#FFD566',
        },

        /* Surfaces / neutrals */
        beige: {
          50:  '#FFFBF3',
          100: '#F5E8C7',
          200: '#EADFBC',
          300: '#DFD2AC',
        },

        /* Burnt-orange family for cards & buttons */
        'burnt-orange': {
          100: '#F8E1D0',
          200: '#F5C6A0',
          300: '#F4A261',
          500: '#E07B3A',
          600: '#D2691E',
        },

        /* Existing futuristic set you had */
        darkBackground: '#1A1A1D',
        mediumBackground: '#2C2C30',
        lightText: '#E0E0E0',
        grayText: '#A0A0A0',
        accentBlue: '#00BFFF',
        warningYellow: '#FFDC00',
      },

      /* 3️⃣  ———  MISC STYLES (unchanged) ——— */
      container: {
        center: true,
        padding: '2rem',
      },
      letterSpacing: {
        widest: '.12em',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'],
      },

      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-border': {
          '0%,100%': { borderColor: 'var(--color-pulse)' },
          '50%': { borderColor: 'transparent' },
        },
        'pulse-mini': { '0%,100%': { opacity: '1' }, '50%': { opacity: '.3' } },
        'ping-once': {
          '0%': { transform: 'scale(0.2)', opacity: '.7' },
          '80%,100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 8s linear infinite',
        'fade-in': 'fade-in .3s ease-out forwards',
        'scale-in': 'scale-in .3s ease-out forwards',
        'pulse-border': 'pulse-border var(--duration-pulse) var(--timing-pulse) infinite',
        'pulse-mini': 'pulse-mini 2s cubic-bezier(.4,0,.6,1) infinite',
        'ping-once': 'ping-once 1s cubic-bezier(0,0,.2,1) forwards',
      },
    },
  },
  plugins: [],
};
