// frontend/components/catalog/ProductRating.js
'use client'

import { useState } from 'react'
import { RatingStars } from '@/components/ui/RatingStars'

/**
 * Блок рейтинга и отзывов товара
 * @param {{ 
 *   avgRating?: number, 
 *   reviewCount?: number, 
 *   reviews?: Array, 
 *   productId?: number 
 * }} props
 */
export function ProductRating({ avgRating, reviewCount = 0, reviews = [], productId }) {
  const [showAll, setShowAll] = useState(false)
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)
  
  return (
    <div className="card mb-4">
      <div className="card-body">
        {/* Заголовок с рейтингом */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <RatingStars rating={avgRating} size="lg" />
          <div>
            <div className="fs-5 fw-bold">{avgRating?.toFixed(1) || '–'}</div>
            <small className="text-muted">
              {reviewCount} {reviewCount === 1 ? 'отзыв' : reviewCount < 5 ? 'отзыва' : 'отзывов'}
            </small>
          </div>
        </div>
        
        {/* Список отзывов */}
        {displayedReviews.length > 0 && (
          <div className="border-top pt-3">
            {displayedReviews.map(review => (
              <div key={review.id} className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong className="d-block">{review.user_name}</strong>
                    <small className="text-muted">
                      {review.city?.name} • {review.created_at}
                    </small>
                  </div>
                  <RatingStars rating={review.rating} size="sm" showValue={false} />
                </div>
                {review.title && (
                  <h6 className="mt-2 mb-1">{review.title}</h6>
                )}
                <p className="mb-0 small">{review.text}</p>
              </div>
            ))}
            
            {/* Кнопка "Показать все" */}
            {reviews.length > 3 && !showAll && (
              <button 
                className="btn btn-link btn-sm p-0"
                onClick={() => setShowAll(true)}
              >
                Показать все {reviewCount} отзывов →
              </button>
            )}
          </div>
        )}
        
        {/* Форма добавления отзыва (заглушка) */}
        {productId && (
          <div className="border-top pt-3 mt-3">
            <button className="btn btn-outline-primary btn-sm">
              ✍️ Оставить отзыв
            </button>
            <small className="text-muted ms-2">
              *После модерации
            </small>
          </div>
        )}
      </div>
    </div>
  )
}