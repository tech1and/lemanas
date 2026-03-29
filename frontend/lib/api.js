// frontend/lib/api.js
import axios from 'axios'

// ✅ Правильный baseURL с /api в конце
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
  headers: { 
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'  // Для Django CSRF
  },
  withCredentials: true  // Передавать CSRF cookie
})

/**
 * Безопасный запрос с fallback при ошибке
 */
async function safeFetch(url, config = {}, fallback = []) {
  try {
    const { data } = await api.get(url, config)
    return data.results || data || fallback
  } catch (error) {
    console.warn(`⚠️ API fallback for ${url}:`, error.message)
    return fallback
  }
}

/**
 * Получить топ товаров
 */
export async function fetchTopProducts(limit = 12) {
  return safeFetch('/catalog/products/', {  // ✅ Правильный путь
    params: { limit, ordering: '-likes_count' }
  }, [])
}

/**
 * Получить все города
 */
export async function fetchCities() {
  return safeFetch('/catalog/cities/', {}, [])  // ✅ Правильный путь
}

/**
 * Получить город по slug
 */
export async function fetchCityBySlug(slug) {
  try {
    const { data } = await api.get(`/catalog/cities/${slug}/`)
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
    const { data } = await api.get(`/catalog/categories/${slug}/`)
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
  return safeFetch(`/catalog/categories/${categorySlug}/products/`, { params: filters }, { results: [], count: 0 })
}

/**
 * Получить товар по slug
 */
export async function fetchProductBySlug(slug) {
  try {
    const { data } = await api.get(`/catalog/products/${slug}/`)
    return data
  } catch (error) {
    console.warn(`⚠️ Product not found: ${slug}`)
    return null
  }
}

/**
 * Получить магазин по slug
 */
export async function fetchStoreBySlug(slug) {
  try {
    const { data } = await api.get(`/catalog/stores/${slug}/`)
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
  return safeFetch(`/catalog/products/${productId}/related/`, { params: { limit } }, [])
}

export default api