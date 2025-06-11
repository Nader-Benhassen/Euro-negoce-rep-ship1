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
    domains: ['euronegocetrade.com', 'www.euronegocetrade.com'],
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
}

export default nextConfig
