import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'back-beta-sandy-79.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-psi-gray-53.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const dest = process.env.BACKEND_URL || 'https://backend-psi-gray-53.vercel.app'
    return [
      {
        source: '/api/:path*',
        destination: `${dest}/:path*`,
      },
    ]
  },
};

export default nextConfig;
