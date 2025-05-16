const path = require('path');

module.exports = {
  reactStrictMode: true, // ✅ This goes outside the webpack function
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};
