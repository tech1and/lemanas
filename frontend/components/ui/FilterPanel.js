// frontend/components/ui/FilterPanel.js
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Панель фильтров для каталога
 * @param {{ category: Object, cityId?: string, currentSort?: string }} props
 */
export function FilterPanel({ category, cityId, currentSort }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Пример параметров для фильтрации (из <param> в XML)
  const filterGroups = [
    {
      name: 'Бренд',
      key: 'Бренд',
      values: ['ПОЛИТЭК', 'LARVIJ', 'Другие']
    },
    {
      name: 'Материал',
      key: 'Материал',
      values: ['Полипропилен', 'Пластик', 'Металл', 'Дерево']
    },
    {
      name: 'Страна',
      key: 'Страна производства',
      values: ['Россия', 'Китай', 'Турция']
    }
  ]

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Простая логика: добавляем/удаляем фильтр
    const currentParams = params.get('params') || ''
    const newParam = `${key}:${value}`
    
    if (currentParams.includes(newParam)) {
      // Удаляем фильтр
      const updated = currentParams.split(';').filter(p => p !== newParam).join(';')
      if (updated) params.set('params', updated)
      else params.delete('params')
    } else {
      // Добавляем фильтр
      const updated = currentParams ? `${currentParams};${newParam}` : newParam
      params.set('params', updated)
    }
    
    router.push(`?${params.toString()}`)
  }

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`?${params.toString()}`)
  }

  const handlePriceChange = (min, max) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min) params.set('price_min', min)
    else params.delete('price_min')
    if (max) params.set('price_max', max)
    else params.delete('price_max')
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">🔍 Фильтры</h5>
        <button 
          className="btn btn-sm btn-outline-secondary d-md-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Скрыть' : 'Показать'}
        </button>
      </div>
      
      <div className={`card-body ${isOpen ? '' : 'd-none d-md-block'}`}>
        {/* Сортировка */}
        <div className="mb-4">
          <label className="form-label small text-muted">Сортировка</label>
          <select 
            className="form-select form-select-sm"
            value={currentSort || 'rating'}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="rating">По рейтингу</option>
            <option value="price_asc">Сначала дешёвые</option>
            <option value="price_desc">Сначала дорогие</option>
            <option value="likes">По популярности</option>
          </select>
        </div>

        {/* Фильтры по параметрам */}
        {filterGroups.map(group => (
          <div key={group.key} className="mb-4">
            <label className="form-label small text-muted">{group.name}</label>
            <div className="d-flex flex-column gap-1">
              {group.values.map(value => (
                <label key={value} className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input"
                    onChange={() => handleFilterChange(group.key, value)}
                  />
                  <span className="form-check-label small">{value}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Фильтр по цене */}
        <div className="mb-4">
          <label className="form-label small text-muted">Цена, ₽</label>
          <div className="d-flex gap-2">
            <input 
              type="number" 
              className="form-control form-control-sm" 
              placeholder="От"
              min="0"
              onChange={(e) => handlePriceChange(e.target.value, null)}
            />
            <input 
              type="number" 
              className="form-control form-control-sm" 
              placeholder="До"
              min="0"
              onChange={(e) => handlePriceChange(null, e.target.value)}
            />
          </div>
        </div>

        {/* Кнопка сброса */}
        <button 
          className="btn btn-outline-secondary btn-sm w-100"
          onClick={() => router.push(window.location.pathname)}
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  )
}