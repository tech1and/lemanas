// frontend/app/sitemap-index.js
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lemanas.ru'

/**
 * Индекс sitemap для больших каталогов
 */
export default async function sitemapIndex() {
  return [
    {
      url: `${BASE_URL}/sitemap.xml`,
      lastModified: new Date()
    },
    {
      url: `${BASE_URL}/sitemap-cities.xml`,
      lastModified: new Date()
    },
    {
      url: `${BASE_URL}/sitemap-categories.xml`,
      lastModified: new Date()
    },
    {
      url: `${BASE_URL}/sitemap-products-1.xml`,
      lastModified: new Date()
    },
    {
      url: `${BASE_URL}/sitemap-products-2.xml`,
      lastModified: new Date()
    }
    // ... больше чанков для товаров
  ]
}