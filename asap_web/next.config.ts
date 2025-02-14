// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {  
//   images: {
//     domains: ["localhost"], 
//   },
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
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
