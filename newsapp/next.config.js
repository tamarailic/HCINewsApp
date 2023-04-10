/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '*',
        port: '',
        pathname: '**',
      }
    ],
  },
}

module.exports = nextConfig