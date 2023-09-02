/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ts$/,
      exclude: /src\/api/,
    });
    return config;
  },
};

