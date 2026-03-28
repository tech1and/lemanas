import { fetchCityBySlug, fetchTopProductsByCity } from '@/lib/api'
import { ProductCard } from '@/components/catalog/ProductCard'
import { StoreMap } from '@/components/geo/StoreMap'

/**
 * Страница города — товары + магазины
 * @param {{ params: { city: string } }} props
 */
export async function generateMetadata({ params }) {
  const city = await fetchCityBySlug(params.city)
  return {
    title: `Лемана Про ${city.name} — Каталог, цены, наличие в магазинах`,
    description: `Товары Лемана Про в городе ${city.name}. ${city.stores_count || 0} магазинов, отзывы покупателей, актуальные цены.`
  }
}

export default async function CityPage({ params }) {
  const city = await fetchCityBySlug(params.city)
  const topProducts = await fetchTopProductsByCity(city.id, 12)

  return (
    <div className="container">
      {/* Заголовок города */}
      <section className="mb-5">
        <div className="d-flex align-items-center gap-3 mb-3">
          <i className="bi bi-geo-alt-fill text-primary fs-2"></i>
          <div>
            <h1 className="h2 mb-0">{city.name}</h1>
            <p className="text-muted mb-0">
              {city.stores_count || 0} магазинов Лемана Про
            </p>
          </div>
        </div>
      </section>

      {/* Карта магазинов */}
      <section className="mb-5">
        <h2 className="h3 mb-4">📍 Магазины в {city.name}</h2>
        <StoreMap cityId={city.id} latitude={city.latitude} longitude={city.longitude} />
      </section>

      {/* Популярные товары в городе */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3">🔥 Популярно в {city.name}</h2>
          <a href={`/city/${city.slug}/catalog`} className="text-decoration-none">
            Все товары →
          </a>
        </div>
        <div className="row g-4">
          {topProducts.map(product => (
            <div key={product.id} className="col-md-3 col-sm-6">
              <ProductCard product={product} cityId={city.id} />
            </div>
          ))}
        </div>
      </section>

      {/* Информация о доставке */}
      <section className="bg-light rounded-3 p-4 mb-5">
        <h3 className="h4 mb-3">🚚 Доставка и самовывоз в {city.name}</h3>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex gap-3">
              <i className="bi bi-truck fs-4 text-primary"></i>
              <div>
                <h5 className="h6 mb-1">Доставка</h5>
                <p className="text-muted small mb-0">
                  от 299 ₽, 1-3 дня
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex gap-3">
              <i className="bi bi-shop fs-4 text-primary"></i>
              <div>
                <h5 className="h6 mb-1">Самовывоз</h5>
                <p className="text-muted small mb-0">
                  Бесплатно из любого магазина
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex gap-3">
              <i className="bi bi-clock fs-4 text-primary"></i>
              <div>
                <h5 className="h6 mb-1">Режим работы</h5>
                <p className="text-muted small mb-0">
                  09:00 — 21:00 ежедневно
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}