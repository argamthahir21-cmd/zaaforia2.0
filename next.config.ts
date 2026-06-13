import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    webpackMemoryOptimizations: true,
    webpackBuildWorker: false,
    cpus: 1,
  },
  productionBrowserSourceMaps: false,
  webpack: (config: any, { dev }: any) => {
    if (config.optimization) {
      config.optimization.minimize = false;
    }
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
