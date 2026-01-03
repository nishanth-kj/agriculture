import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"], // Allow images from GitHub's avatar service
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    // Read from API_URL and append /api, expose as NEXT_PUBLIC_API_URL for client-side
    NEXT_PUBLIC_API_URL: process.env.API_URL
      ? `${process.env.API_URL}/api`
      : 'http://localhost:8000/api',
  },
};

export default nextConfig;
