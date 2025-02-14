import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   output: 'export',
  images: {
    domains: ["localhost"], 
  },
};

export default nextConfig;
