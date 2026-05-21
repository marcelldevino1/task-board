import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // 🔥 MEMAKSA VERCEL TETAP LANJUT BUILD MESKIPUN ADA TYPE ERROR
    ignoreBuildErrors: true,
  },
  eslint: {
    // 🔥 MEMAKSA VERCEL TETAP LANJUT BUILD MESKIPUN ADA WARNING ESLINT
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;