// frontend/app/sitemap.js
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lemanas.ru'
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Безопасный fetch для sitemap
async function safeApiFetch(endpoint, fallback = []) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { 
      next: { revalidate: 3600 } // ISR кэширование
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.results || data || fallback
  } catch (error) {
    console.warn(`⚠️ Sitemap API error for ${endpoint}:`, error.message)
    return fallback
  }
}

export default async function sitemap() {
  const urls = []
  
  // 1. Статические страницы (всегда добавляем)
  urls.push(
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/catalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 }
  )
  
  // 2. Города (с защитой от ошибок)
  try {
    const cities = await safeApiFetch('/cities/', [])
    for (const city of cities) {
      urls.push({
        url: `${BASE_URL}/city/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9
      })
    }
    console.log(`✓ Cities: ${cities.length}`)
  } catch (e) {
    console.warn('⚠️ Could not fetch cities for sitemap')
  }
  
  // 3. Категории
  try {
    const categories = await safeApiFetch('/categories/', [])
    for (const cat of categories) {
      urls.push({
        url: `${BASE_URL}/catalog/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
      })
    }
    console.log(`✓ Categories: ${categories.length}`)
  } catch (e) {
    console.warn('⚠️ Could not fetch categories for sitemap')
  }
  
  // 4. Товары (только топ-100 для sitemap)
  try {
    const products = await safeApiFetch('/products/?limit=100&ordering=-updated_at', [])
    for (const product of products) {
      urls.push({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: new Date(product.updated_at || Date.now()),
        changeFrequency: 'daily',
        priority: 0.7
      })
    }
    console.log(`✓ Products: ${products.length}`)
  } catch (e) {
    console.warn('⚠️ Could not fetch products for sitemap')
  }
  
  console.log(`✅ Sitemap generated: ${urls.length} URLs`)
  return urls
}