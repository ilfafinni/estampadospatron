/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (siteUrl ? '' : '/estampadospatron');

const nextConfig = {
  ...(isGitHubPages
    ? {
        output: 'export',
        ...(basePath
          ? {
              basePath,
              assetPrefix: `${basePath}/`,
            }
          : {}),
        trailingSlash: true,
      }
    : {}),
  images: {
    unoptimized: isGitHubPages,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
