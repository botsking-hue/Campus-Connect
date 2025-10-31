/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    MAIN_ADMIN_ID: process.env.MAIN_ADMIN_ID,
  },
}

module.exports = nextConfig
