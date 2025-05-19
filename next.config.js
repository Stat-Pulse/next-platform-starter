const path = require('path');

module.exports = {
  reactStrictMode: true,
  output: 'standalone', // Enables SSR routing support for Netlify
  experimental: {
    serverActions: {
      enabled: false, // Disable server actions
    },
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};
