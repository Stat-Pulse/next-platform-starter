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
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    if (isServer) {
      config.externals.push({ net: 'commonjs net', tls: 'commonjs tls' });
    }
    return config;
  },
};
