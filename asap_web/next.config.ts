import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    domains: ["localhost"], 
  },
  // Add this if you're using rewrites or redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home', 
        permanent: true,
      },
    ]
  },
};

export default nextConfig;