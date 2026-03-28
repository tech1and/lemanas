import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Получить топ товаров
 * @param {number} limit
 */
export async function fetchTopProducts(limit = 12) {
  const { data } = await api.get('/products/', {
    params: { limit, ordering: '-likes_count' }
  })
  return data.results || data
}

/**
 * Получить товары по городу
 * @param {number} cityId
 * @param {number} limit
 */
export async function fetchTopProductsByCity(cityId, limit = 12) {
  const { data } = await api.get('/products/', {
    params: { city: cityId, limit, ordering: '-views_count' }
  })
  return data.results || data
}

/**
 * Получить товар по слагy
 * @param {string} slug
 */
export async function fetchProductBySlug(slug) {
  const { data } = await api.get(`/products/${slug}/`)
  return data
}

/**
 * Получить категорию по слагy
 * @param {string} slug
 */
export async function fetchCategoryBySlug(slug) {
  const { data } = await api.get(`/categories/${slug}/`)
  return data
}

/**
 * Получить товары категории
 * @param {string} categorySlug
 * @param {Object} filters
 */
export async function fetchProductsByCategory(categorySlug, filters = {}) {
  const { data } = await api.get(`/categories/${categorySlug}/products/`, { params: filters })
  return data
}

/**
 * Получить все города
 */
export async function fetchCities() {
  const { data } = await api.get('/cities/')
  return data.results || data
}

/**
 * Получить город по слагy
 * @param {string} slug
 */
export async function fetchCityBySlug(slug) {
  const { data } = await api.get(`/cities/${slug}/`)
  return data
}

/**
 * Получить магазин по слагy
 * @param {string} slug
 */
export async function fetchStoreBySlug(slug) {
  const { data } = await api.get(`/stores/${slug}/`)
  return data
}

/**
 * Получить похожие товары
 * @param {number} productId
 * @param {number} limit
 */
export async function fetchRelatedProducts(productId, limit = 4) {
  const { data } = await api.get(`/products/${productId}/related/`, { params: { limit } })
  return data
}

export default api