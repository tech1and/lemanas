// frontend/components/catalog/ProductGallery.js
'use client'

import { useState } from 'react'

/**
 * Галерея изображений товара
 * @param {{ images: string[], name: string }} props
 */
export function ProductGallery({ images, name }) {
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Заглушка если нет изображений
  const defaultImage = 'https://cdn.lemanapro.ru/lmru/image/upload/d_photoiscoming.png'
  const imageList = images?.length ? images : [defaultImage]

  return (
    <div>
      {/* Основное изображение */}
      <div className="card mb-3">
        <img 
          src={imageList[activeIndex] || defaultImage} 
          className="card-img-top" 
          alt={name}
          style={{ 
            height: '400px', 
            objectFit: 'contain',
            backgroundColor: '#f8f9fa'
          }}
        />
      </div>

      {/* Миниатюры */}
      {imageList.length > 1 && (
        <div className="d-flex gap-2 overflow-auto pb-2">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              className={`border rounded p-1 ${activeIndex === idx ? 'border-primary' : 'border-secondary'}`}
              onClick={() => setActiveIndex(idx)}
              style={{ width: '80px', height: '80px', flexShrink: 0 }}
              aria-label={`Показать изображение ${idx + 1}`}
            >
              <img 
                src={img} 
                alt={`${name} - вид ${idx + 1}`}
                className="w-100 h-100"
                style={{ objectFit: 'contain' }}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}