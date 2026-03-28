'use client'

import { useState, useEffect } from 'react'
import { useGeoLocation } from '@/hooks/useGeoLocation'
import { fetchCities } from '@/lib/api'

/**
 * Выбор города с автоопределением
 */
export function CitySelector() {
  const { city: detectedCity, setCity } = useGeoLocation()
  const [cities, setCities] = useState([])
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchCities().then(setCities)
  }, [])

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (city) => {
    setCity(city)
    setIsOpen(false)
    if (window.location.pathname !== `/${city.slug}`) {
      window.location.href = `/${city.slug}`
    }
  }

  return (
    <div className="dropdown position-relative">
      <button 
        className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <i className="bi bi-geo-alt" />
        {detectedCity?.name || 'Ваш город'}
      </button>
      
      {isOpen && (
        <div className="dropdown-menu dropdown-menu-end p-3" style={{minWidth: '320px', maxHeight: '400px', overflow: 'auto'}}>
          <input
            type="text"
            className="form-control form-control-sm mb-2"
            placeholder="Поиск города..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="list-group list-group-flush">
            {filteredCities.slice(0, 10).map(city => (
              <button
                key={city.id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => handleSelect(city)}
              >
                {city.name}
                {detectedCity?.id === city.id && (
                  <span className="badge bg-success">выбран</span>
                )}
              </button>
            ))}
          </div>
          <small className="text-muted d-block mt-2">
            Показано {filteredCities.length} из {cities.length} городов
          </small>
        </div>
      )}
    </div>
  )
}