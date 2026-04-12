import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'bcryptjs', 'jsonwebtoken'],
  images: {
    domains: ["avatars.githubusercontent.com"], // Allow images from GitHub's avatar service
  },
  env: {
    // Read from API_URL and append /api, expose as NEXT_PUBLIC_API_URL for client-side
    NEXT_PUBLIC_API_URL: process.env.API_URL
      ? `${process.env.API_URL}`
      : 'http://localhost:8000/',
  },
};

export default nextConfig;
