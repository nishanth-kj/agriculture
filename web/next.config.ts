import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"], // Allow images from GitHub's avatar service
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
