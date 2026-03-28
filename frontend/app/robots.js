// frontend/app/robots.js
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lemanas.ru'

/**
 * Генерация robots.txt
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/static/',
          '/*?city=',      // Дубли с фильтрами
          '/*?params=',
          '/*?sort=',
          '/*?page=',
          '/go/',          // Партнёрские редиректы
        ]
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/*?city=',
          '/*?params=',
        ],
        crawlDelay: 2  // Для Яндекса
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
        ]
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL
  }
}