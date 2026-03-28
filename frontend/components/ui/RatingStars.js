// frontend/components/ui/RatingStars.js

/**
 * Компонент отображения рейтинга звёздами
 * @param {{ rating?: number, size?: 'sm' | 'md' | 'lg', showValue?: boolean }} props
 */
export function RatingStars({ rating, size = 'md', showValue = true }) {
  const stars = []
  const numericRating = parseFloat(rating) || 0
  const fullStars = Math.floor(numericRating)
  const hasHalfStar = numericRating % 1 >= 0.5
  
  // Размеры иконок
  const sizeClasses = {
    sm: 'fs-6',
    md: 'fs-5',
    lg: 'fs-3'
  }
  
  // Генерация полных звёзд
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <i 
        key={`full-${i}`} 
        className={`bi bi-star-fill text-warning ${sizeClasses[size]}`}
        aria-hidden="true"
      />
    )
  }
  
  // Половина звезды (если нужно)
  if (hasHalfStar) {
    stars.push(
      <i 
        key="half" 
        className={`bi bi-star-half text-warning ${sizeClasses[size]}`}
        aria-hidden="true"
      />
    )
  }
  
  // Пустые звёзды до 5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <i 
        key={`empty-${i}`} 
        className={`bi bi-star text-muted ${sizeClasses[size]}`}
        aria-hidden="true"
      />
    )
  }
  
  return (
    <div className="d-flex align-items-center gap-2">
      <div className="d-flex" role="img" aria-label={`Рейтинг ${numericRating} из 5`}>
        {stars}
      </div>
      {showValue && numericRating > 0 && (
        <span className={`text-muted ${size === 'sm' ? 'small' : ''}`}>
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}