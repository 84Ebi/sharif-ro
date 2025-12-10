import type { NextConfig } from "next";
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Disable CSS optimization to prevent caching
  experimental: {
    optimizeCss: false,
  },
  // Ensure proper CSS chunking and loading
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize build output
  poweredByHeader: false,
  // Force CSS to reload on every page navigation
  webpack: (config) => {
    // Disable CSS caching
    config.module.rules.forEach((rule: any) => {
      if (rule.test && rule.test.toString().includes('css')) {
        rule.use.forEach((use: any) => {
          if (use.loader && use.loader.includes('css-loader')) {
            use.options = {
              ...use.options,
              modules: false,
            };
          }
        });
      }
    });
    return config;
  },
};

export default withPWA(nextConfig);
