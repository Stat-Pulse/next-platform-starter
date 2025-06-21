// postcss.config.js  (CommonJS)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},   // NEW – replaces 'tailwindcss'
    autoprefixer: {},            // keep if you still target older browsers
  },
};