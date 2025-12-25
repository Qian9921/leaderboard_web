/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/leaderboard_web',
  assetPrefix: '/leaderboard_web/',
}

module.exports = nextConfig

