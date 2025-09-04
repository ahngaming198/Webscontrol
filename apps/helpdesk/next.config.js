/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    MEILISEARCH_URL: process.env.MEILISEARCH_URL || 'http://localhost:7700',
    MEILISEARCH_API_KEY: process.env.MEILISEARCH_API_KEY || 'your-meilisearch-key',
  },
}

module.exports = nextConfig
