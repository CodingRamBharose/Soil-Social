import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disable ESLint during production builds
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    serverComponentsExternalPackages: ['cloudinary'],
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
