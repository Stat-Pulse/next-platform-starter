module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],
  safelist: [
    'bg-primary',
    'text-primary',
    'border-primary'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E30613',
        neutralAccent: '#F3F4F6',
      },
      container: {
        center: true,
        padding: '2rem',
      },
      letterSpacing: {
        widest: '.12em',
      },
    },
  },
  plugins: [],
}