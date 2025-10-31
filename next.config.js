/** @type {import('next').NextConfig} */
const nextConfig = {
  // No need for experimental.appDir in Next.js 13.4+
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    MAIN_ADMIN_ID: process.env.MAIN_ADMIN_ID,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  },
}

module.exports = nextConfig
