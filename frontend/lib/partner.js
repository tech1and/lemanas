import api from './api'

/**
 * Трекинг клика по партнёрской ссылке
 * @param {{ productId: number, cityId?: number, price?: number, clickId: string }} params
 */
export async function trackPartnerClick({ productId, cityId, price, clickId }) {
  const { data } = await api.post(`/products/${productId}/track-click/`, {
    city_id: cityId,
    price,
    click_id: clickId
  })
  return data
}

/**
 * Генерация партнёрской ссылки с UTM
 * @param {string} baseUrl
 * @param {{ productId: number, cityId?: number }} params
 */
export function generatePartnerUrl(baseUrl, { productId, cityId }) {
  const url = new URL(baseUrl)
  url.searchParams.set('utm_source', 'affiliate')
  url.searchParams.set('utm_medium', 'referral')
  url.searchParams.set('utm_campaign', `product_${productId}`)
  if (cityId) {
    url.searchParams.set('utm_city', cityId.toString())
  }
  return url.toString()
}