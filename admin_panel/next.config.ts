import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/admin',
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

export default nextConfig;
