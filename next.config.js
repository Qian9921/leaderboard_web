/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // In dev, do NOT set basePath, otherwise visiting "/" will 404.
  // In production (GitHub Pages), the repo name is used as basePath.
  ...(isProd
    ? {
        basePath: "/leaderboard_web",
        assetPrefix: "/leaderboard_web/",
      }
    : {}),
}

module.exports = nextConfig

