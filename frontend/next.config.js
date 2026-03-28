// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешаем изображения с CDN Лемана Про
  images: {
    domains: ['cdn.lemanapro.ru'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.lemanapro.ru',
        pathname: '/lmru/image/**',
      },
    ],
  },
  
  // Переменные окружения
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Кэширование для API-запросов в sitemap
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig