import Link from 'next/link'
import { RatingStars } from '@/components/ui/RatingStars'

/**
 * Карточка товара в списке
 * @param {{ product: Object, cityId?: number }} props
 */
export function ProductCard({ product, cityId }) {
  const imageUrl = product.images?.[0] || 'https://cdn.lemanapro.ru/lmru/image/upload/d_photoiscoming.png'
  
  return (
    <div className="card h-100 hover-shadow">
      <Link href={`/product/${product.slug}${cityId ? `?city=${cityId}` : ''}`} className="text-decoration-none">
        <img 
          src={imageUrl} 
          className="card-img-top" 
          alt={product.name}
          loading="lazy"
          style={{ height: '200px', objectFit: 'contain' }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <Link 
          href={`/product/${product.slug}${cityId ? `?city=${cityId}` : ''}`}
          className="text-decoration-none text-dark mb-2"
        >
          <h5 className="card-title h6">{product.name}</h5>
        </Link>
        
        {product.brand && (
          <p className="text-muted small mb-2">
            <i className="bi bi-tag me-1"></i>
            {product.brand}
          </p>
        )}

        <div className="mb-2">
          <RatingStars rating={product.avg_rating} size="sm" />
          <small className="text-muted ms-2">
            ({product.reviews_count || 0})
          </small>
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fs-5 fw-bold text-primary">
              {Math.floor(product.price)} ₽
            </span>
            {product.in_stock ? (
              <span className="badge bg-success">В наличии</span>
            ) : (
              <span className="badge bg-secondary">Нет в наличии</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}