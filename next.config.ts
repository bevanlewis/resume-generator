import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable turbopack (Next.js 16+ default)
  turbopack: {},
  
  // Allow external images if needed
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
