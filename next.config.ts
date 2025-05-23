import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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