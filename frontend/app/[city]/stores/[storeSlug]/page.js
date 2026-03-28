import { fetchStoreBySlug } from '@/lib/api'
import { ProductCard } from '@/components/catalog/ProductCard'

/**
 * Страница конкретного магазина
 * @param {{ params: { city: string, storeSlug: string } }} props
 */
export async function generateMetadata({ params }) {
  const store = await fetchStoreBySlug(params.storeSlug)
  return {
    title: `Лемана Про ${store.name} — Адрес, товары, отзывы`,
    description: `Магазин Лемана Про по адресу: ${store.address}. Режим работы, телефон, популярные товары.`
  }
}

export default async function StorePage({ params }) {
  const store = await fetchStoreBySlug(params.storeSlug)

  return (
    <div className="container">
      {/* Информация о магазине */}
      <section className="mb-5">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <h1 className="h2 mb-3">{store.name}</h1>
                <div className="mb-3">
                  <i className="bi bi-geo-alt text-muted me-2"></i>
                  <span>{store.address}</span>
                </div>
                {store.phone && (
                  <div className="mb-3">
                    <i className="bi bi-telephone text-muted me-2"></i>
                    <a href={`tel:${store.phone}`}>{store.phone}</a>
                  </div>
                )}
                <div className="mb-3">
                  <i className="bi bi-clock text-muted me-2"></i>
                  <span>09:00 — 21:00 ежедневно</span>
                </div>
                <div className="d-flex gap-3">
                  <span className="badge bg-success">
                    ★ {store.avg_rating || 'N/A'}
                  </span>
                  <span className="badge bg-primary">
                    👍 {store.likes_count}
                  </span>
                  <span className="badge bg-info">
                    💬 {store.reviews_count} отзывов
                  </span>
                </div>
              </div>
              <div className="col-md-4 text-center">
                <i className="bi bi-shop display-1 text-primary"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Товары в наличии */}
      <section>
        <h2 className="h3 mb-4">📦 Популярные товары в этом магазине</h2>
        <div className="row g-4">
          {store.top_products?.slice(0, 8).map(product => (
            <div key={product.id} className="col-md-3 col-sm-6">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}