// frontend/lib/api.js
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})

/**
 * Безопасный запрос с fallback при ошибке (критично для SSG!)
 * @param {string} url 
 * @param {Object} config 
 * @param {any} fallback 
 */
async function safeFetch(url, config = {}, fallback = []) {
  try {
    const { data } = await api.get(url, config)
    return data.results || data || fallback
  } catch (error) {
    // Логируем, но НЕ падаем — важно для npm run build
    console.warn(`⚠️ API fallback for ${url}:`, error.message)
    return fallback
  }
}

/**
 * Получить топ товаров (с защитой от падения сборки)
 */
export async function fetchTopProducts(limit = 12) {
  return safeFetch('/products/', {
    params: { limit, ordering: '-likes_count' }
  }, []) // fallback: пустой массив
}

/**
 * Получить товары по городу
 */
export async function fetchTopProductsByCity(cityId, limit = 12) {
  return safeFetch('/products/', {
    params: { city: cityId, limit, ordering: '-views_count' }
  }, [])
}

/**
 * Получить товар по slug
 */
export async function fetchProductBySlug(slug) {
  try {
    const { data } = await api.get(`/products/${slug}/`)
    return data
  } catch (error) {
    console.warn(`⚠️ Product not found: ${slug}`)
    return null // fallback: null
  }
}

/**
 * Получить все города (для sitemap)
 */
export async function fetchCities() {
  return safeFetch('/cities/', {}, [])
}

/**
 * Получить город по slug
 */
export async function fetchCityBySlug(slug) {
  try {
    const { data } = await api.get(`/cities/${slug}/`)
    return data
  } catch (error) {
    console.warn(`⚠️ City not found: ${slug}`)
    return null
  }
}

/**
 * Получить категорию по slug
 */
export async function fetchCategoryBySlug(slug) {
  try {
    const { data } = await api.get(`/categories/${slug}/`)
    return data
  } catch (error) {
    console.warn(`⚠️ Category not found: ${slug}`)
    return null
  }
}

/**
 * Получить товары категории
 */
export async function fetchProductsByCategory(categorySlug, filters = {}) {
  return safeFetch(`/categories/${categorySlug}/products/`, { params: filters }, { results: [], count: 0 })
}

/**
 * Получить магазин по slug
 */
export async function fetchStoreBySlug(slug) {
  try {
    const { data } = await api.get(`/stores/${slug}/`)
    return data
  } catch (error) {
    console.warn(`⚠️ Store not found: ${slug}`)
    return null
  }
}

/**
 * Получить похожие товары
 */
export async function fetchRelatedProducts(productId, limit = 4) {
  return safeFetch(`/products/${productId}/related/`, { params: { limit } }, [])
}

export default api