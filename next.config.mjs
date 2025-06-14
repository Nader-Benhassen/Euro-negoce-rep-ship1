/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'standalone' as it can cause deployment issues
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization - simplified for deployment
  images: {
    unoptimized: true,
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'euronegocetrade.com',
          },
        ],
        destination: 'https://www.euronegocetrade.com/:path*',
        permanent: true,
      },
    ]
  },
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  
  // Simplified headers to avoid deployment issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig
