// tailwind.config.js 
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // center your containers at ~1200px wide with 2rem padding
      container: {
        center: true,
        padding: '2rem',
      },
      // your red/black brand colors
      colors: {
        primary: '#E30613',      // StatPulse red
        neutralAccent: '#F3F4F6', // light gray for cards/backgrounds
      },
      // tighten up your letter-spacing for uppercase headers
      letterSpacing: {
        widest: '.1em',
      },
    }
  },
  plugins: [],
}
