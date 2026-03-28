'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { fetchCities } from '@/lib/api'

const GeoContext = createContext(null)

/**
 * Провайдер геолокации
 */
export function GeoProvider({ children }) {
  const [city, setCity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Определяем город по IP через API
    fetch('/api/geo/detect')
      .then(res => res.json())
      .then(data => {
        if (data.city) {
          setCity(data.city)
          localStorage.setItem('selected_city', JSON.stringify(data.city))
        }
        setLoading(false)
      })
      .catch(() => {
        // Фоллбэк: первый город из списка
        fetchCities().then(cities => {
          if (cities[0]) {
            setCity(cities[0])
          }
          setLoading(false)
        })
      })
  }, [])

  return (
    <GeoContext.Provider value={{ city, setCity, loading }}>
      {children}
    </GeoContext.Provider>
  )
}

/**
 * Хук для доступа к геолокации
 */
export function useGeoLocation() {
  const context = useContext(GeoContext)
  if (!context) {
    throw new Error('useGeoLocation must be used within GeoProvider')
  }
  return context
}