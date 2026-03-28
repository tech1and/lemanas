// frontend/app/sitemap.js
import { fetchCities, fetchCategories, fetchProducts } from '@/lib/api'

/**
 * Базовые настройки sitemap
 */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lemanas.ru'
const CHANGE_FREQ = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
}

const PRIORITY = {
  HOME: 1.0,
  CITY: 0.9,
  CATEGORY: 0.8,
  PRODUCT: 0.7,
  STORE: 0.6,
  STATIC: 0.5
}

/**
 * Статические страницы (не меняются часто)
 */
function getStaticPages() {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: CHANGE_FREQ.DAILY,
      priority: PRIORITY.HOME
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: new Date(),
      changeFrequency: CHANGE_FREQ.DAILY,
      priority: PRIORITY.CATEGORY
    },
    {
      url: `${BASE_URL}/reviews`,
      lastModified: new Date(),
      changeFrequency: CHANGE_FREQ.WEEKLY,
      priority: PRIORITY.STATIC
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: CHANGE_FREQ.MONTHLY,
      priority: PRIORITY.STATIC
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: CHANGE_FREQ.YEARLY,
      priority: PRIORITY.STATIC
    }
  ]
}

/**
 * Страницы городов (66 городов)
 * @param {Array} cities
 */
function getCityPages(cities) {
  return cities.map(city => ({
    url: `${BASE_URL}/city/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: CHANGE_FREQ.WEEKLY,
    priority: PRIORITY.CITY
  }))
}

/**
 * Страницы магазинов (112 магазинов)
 * @param {Array} cities
 */
async function getStorePages(cities) {
  const storePages = []
  
  for (const city of cities) {
    try {
      // В реальном проекте — API endpoint для магазинов города
      const response = await fetch(`${BASE_URL}/api/cities/${city.slug}/stores/`)
        .then(res => res.json())
        .catch(() => [])
      
      for (const store of response) {
        storePages.push({
          url: `${BASE_URL}/city/${city.slug}/stores/${store.slug}`,
          lastModified: new Date(),
          changeFrequency: CHANGE_FREQ.WEEKLY,
          priority: PRIORITY.STORE
        })
      }
    } catch (error) {
      console.error(`Error fetching stores for ${city.slug}:`, error)
    }
  }
  
  return storePages
}

/**
 * Страницы категорий (из XML-структуры)
 */
async function getCategoryPages() {
  try {
    const response = await fetch(`${BASE_URL}/api/categories/`)
      .then(res => res.json())
      .catch(() => [])
    
    return response.map(category => ({
      url: `${BASE_URL}/catalog/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: CHANGE_FREQ.WEEKLY,
      priority: PRIORITY.CATEGORY
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Страницы товаров (продукты из каталога)
 * Разбиваем на чанки для производительности
 */
async function getProductPages() {
  const productPages = []
  const limit = 1000  // Максимум товаров в одном sitemap
  const page = 1
  
  try {
    const response = await fetch(
      `${BASE_URL}/api/products/?limit=${limit}&page=${page}&ordering=-updated_at`
    )
      .then(res => res.json())
      .catch(() => ({ results: [] }))
    
    for (const product of response.results || []) {
      productPages.push({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: new Date(product.updated_at || Date.now()),
        changeFrequency: CHANGE_FREQ.DAILY,  // Цены и наличие меняются часто
        priority: PRIORITY.PRODUCT
      })
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }
  
  return productPages
}

/**
 * Главная функция генерации sitemap
 * Next.js App Router требует export async function sitemap()
 */
export default async function sitemap() {
  const startTime = Date.now()
  console.log('🗺️ Generating sitemap...')
  
  // 1. Статические страницы
  const staticPages = getStaticPages()
  
  // 2. Города
  let cityPages = []
  try {
    const cities = await fetchCities()
    cityPages = getCityPages(cities)
    console.log(`✓ Cities: ${cityPages.length}`)
  } catch (error) {
    console.error('Error fetching cities:', error)
  }
  
  // 3. Магазины (опционально, может быть тяжёлым)
  let storePages = []
  try {
    const cities = await fetchCities()
    storePages = await getStorePages(cities)
    console.log(`✓ Stores: ${storePages.length}`)
  } catch (error) {
    console.error('Error fetching stores:', error)
  }
  
  // 4. Категории
  let categoryPages = []
  try {
    categoryPages = await getCategoryPages()
    console.log(`✓ Categories: ${categoryPages.length}`)
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
  
  // 5. Товары (только топ-1000 для основного sitemap)
  let productPages = []
  try {
    productPages = await getProductPages()
    console.log(`✓ Products (top 1000): ${productPages.length}`)
  } catch (error) {
    console.error('Error fetching products:', error)
  }
  
  // Объединяем все страницы
  const allPages = [
    ...staticPages,
    ...cityPages,
    ...storePages,
    ...categoryPages,
    ...productPages
  ]
  
  const endTime = Date.now()
  console.log(`✅ Sitemap generated in ${endTime - startTime}ms`)
  console.log(`📊 Total URLs: ${allPages.length}`)
  
  return allPages
}