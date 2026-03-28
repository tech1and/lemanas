// frontend/components/geo/StoreMap.js
'use client'

import { useEffect, useRef } from 'react'

/**
 * Карта магазинов (заглушка с возможностью расширения)
 * @param {{ cityId: number, latitude?: number, longitude?: number }} props
 */
export function StoreMap({ cityId, latitude, longitude }) {
  const mapRef = useRef(null)

  useEffect(() => {
    // Здесь можно подключить Яндекс.Карты или Leaflet
    // Пока показываем заглушку
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
          <i class="bi bi-geo-alt-fill fs-1 mb-2"></i>
          <p class="mb-0">Карта магазинов в ${cityId ? 'этом городе' : 'вашем регионе'}</p>
          <small class="text-muted">Загрузка карты...</small>
        </div>
      `
    }
  }, [cityId])

  return (
    <div 
      ref={mapRef}
      className="bg-light rounded-3 d-flex align-items-center justify-content-center"
      style={{ height: '400px', minHeight: '300px' }}
      aria-label="Карта магазинов Лемана Про"
    />
  )
}