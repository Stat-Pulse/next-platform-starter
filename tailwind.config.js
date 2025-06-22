// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    // Remove './app/**/*.{js,ts,jsx,tsx}' if you have completely deleted the 'app' directory.
    // If you plan to use 'app' directory pages later, you can keep it, but it's best to be consistent.
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}', // Make sure this path is correct if utils has components
    './public/**/*.html',
  ],

  // ... rest of your theme and plugins are fine for v3
  theme: {
    extend: {
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

        // Ensure these basic Tailwind colors are also covered if you use them directly (e.g., bg-purple-900)
        purple: {
          900: '#2A1A3D', // Example, confirm actual hex if these are custom
          800: '#3A1E5D', // Example
        },
        teal: {
          800: '#1E4D4D', // Example
        },
        gray: { // If you use text-gray-100 or bg-gray-800 from default Tailwind palette
          100: '#F3F4F6', // Default Tailwind gray-100
          300: '#D1D5DB', // Default Tailwind gray-300
          400: '#9CA3AF', // Default Tailwind gray-400
          700: '#374151', // Default Tailwind gray-700
          800: '#1F2937', // Default Tailwind gray-800
        },
        red: { // If you use text-red-600, bg-red-600
          600: '#DC2626', // Default Tailwind red-600
          700: '#B91C1C', // Default Tailwind red-700
        },
        black: '#000000', // If you use text-black literally
        white: '#FFFFFF', // If you use text-white literally
      },
      fontFamily: {
        // Ensure this includes your Google Font 'Inter' and fallbacks
        sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'],
      },
      // ... rest of extend
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // Make sure this plugin is also installed: npm install tailwind-scrollbar-hide
  ],
};