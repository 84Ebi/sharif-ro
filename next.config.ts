import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Optimize CSS loading
  experimental: {
    optimizeCss: true,
  },
  // Ensure proper CSS chunking and loading
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize build output
  poweredByHeader: false,
};

export default nextConfig;
