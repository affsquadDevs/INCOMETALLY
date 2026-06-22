const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = withNextIntl(nextConfig)

