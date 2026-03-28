// frontend/components/geo/AvailabilityBadge.js
'use client'

import { useGeoLocation } from '@/hooks/useGeoLocation'

/**
 * Бейдж наличия товара в городе пользователя
 * @param {{ 
 *   inStock: boolean, 
 *   cities?: Array<{id: number, name: string}>, 
 *   cityId?: number 
 * }} props
 */
export function AvailabilityBadge({ inStock, cities = [], cityId }) {
  const { city: detectedCity } = useGeoLocation()
  const targetCityId = cityId || detectedCity?.id
  
  // Проверяем наличие в целевом городе
  const availableInCity = targetCityId 
    ? cities.some(c => c.id === targetCityId)
    : inStock
  
  if (!inStock) {
    return (
      <div className="alert alert-secondary py-2 mb-3">
        <i className="bi bi-x-circle me-2"></i>
        <strong>Нет в наличии</strong>
        <small className="d-block text-muted mt-1">
          Товар временно отсутствует на складе
        </small>
      </div>
    )
  }
  
  if (availableInCity && detectedCity) {
    return (
      <div className="alert alert-success py-2 mb-3">
        <i className="bi bi-check-circle-fill me-2"></i>
        <strong>В наличии в {detectedCity.name}</strong>
        <small className="d-block text-muted mt-1">
          <i className="bi bi-truck me-1"></i>
          Доставка: 1-3 дня • Самовывоз: бесплатно
        </small>
      </div>
    )
  }
  
  // Товар есть, но не в городе пользователя
  return (
    <div className="alert alert-info py-2 mb-3">
      <i className="bi bi-info-circle me-2"></i>
      <strong>Доступен для заказа</strong>
      <small className="d-block text-muted mt-1">
        <i className="bi bi-truck me-1"></i>
        Доставка в {detectedCity?.name || 'ваш город'}: 3-7 дней
      </small>
    </div>
  )
}