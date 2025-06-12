/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
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
  // Remove all header configurations to avoid route parsing issues
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
}

export default nextConfig
