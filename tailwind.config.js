// tailwind.config.js

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2rem',
      },
      colors: {
        primary: '#E30613',
        neutralAccent: '#F3F4F6',
      },
      letterSpacing: {
        widest: '.12em',
      },
    },
  },
  plugins: [],
};