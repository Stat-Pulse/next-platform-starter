const path = require('path');

module.exports = {
  reactStrictMode: true,
  output: 'standalone', // Enables SSR routing support for Netlify
  experimental: {
    serverActions: { enabled: false }, // Disable server actions
  },
  images: {
    domains: ['espn.com', 'wikipedia.org', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};
