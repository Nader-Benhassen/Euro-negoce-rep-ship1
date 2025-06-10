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
    domains: ['euronegoceglobal.com', 'www.euronegoceglobal.com'],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'euronegoceglobal.com',
          },
        ],
        destination: 'https://www.euronegoceglobal.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
