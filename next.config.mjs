/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Cloudflare Pages用の静的エクスポート
  trailingSlash: true,
  images: {
    unoptimized: true, // 静的エクスポート時は最適化無効
  },
  env: {
    SITE_URL: process.env.SITE_URL || 'https://your-site.com',
    SITE_NAME: process.env.SITE_NAME || 'PR-KING',
  },
};

export default nextConfig;
