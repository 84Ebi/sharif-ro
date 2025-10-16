import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // The 'optimizeFonts' and 'swcMinify' options are deprecated in recent versions of Next.js
  // and can be safely removed. Font optimization is now a default feature.
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
