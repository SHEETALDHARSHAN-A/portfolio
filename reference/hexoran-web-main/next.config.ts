import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirect non-www to www (canonical URL)
  async redirects() {
    return [
      // Redirect non-www to www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'hexoran.com',
          },
        ],
        destination: 'https://www.hexoran.com/:path*',
        permanent: true, // 301 redirect - important for SEO
      },
    ];
  },

  // Security headers for better SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
