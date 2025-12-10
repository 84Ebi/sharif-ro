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
  // Enable Turbopack configuration (Next.js 16+)
  turbopack: {},
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
};

export default withPWA(nextConfig);
