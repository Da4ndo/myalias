/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals = config.externals || [];
    config.externals.push(path.resolve(__dirname, 'src/api')); // Path to your Nest.js code

    return config;
  },
};

