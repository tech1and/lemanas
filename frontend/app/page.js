import { fetchTopProducts, fetchCities } from '@/lib/api'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CitySelector } from '@/components/geo/CitySelector'

/**
 * Главная страница — рейтинг товаров + города
 */
export const metadata = {
  title: 'Лемана Про Каталог — Рейтинг товаров, отзывы, цены 2026',
  description: 'Топ товаров Лемана Про по отзывам покупателей. Сравнение цен, наличие в 112 магазинах России.'
}

export default async function HomePage() {
  const topProducts = await fetchTopProducts(12)
  const cities = await fetchCities()

  return (
    <div className="container">
      {/* Hero-блок */}
      <section className="bg-primary text-white rounded-3 p-5 mb-5">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="display-5 fw-bold mb-3">
              Независимый рейтинг товаров Лемана Про
            </h1>
            <p className="lead mb-4">
              Отзывы покупателей, сравнение цен, наличие в 112 магазинах России
            </p>
            <div className="d-flex gap-3">
              <a href="/catalog" className="btn btn-light btn-lg">
                Смотреть каталог
              </a>
              <CitySelector />
            </div>
          </div>
          <div className="col-md-4 text-center">
            <i className="bi bi-shop display-1"></i>
          </div>
        </div>
      </section>

      {/* Топ товаров */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3">🔥 Топ-12 товаров недели</h2>
          <a href="/catalog" className="text-decoration-none">Все товары →</a>
        </div>
        <div className="row g-4">
          {topProducts.map(product => (
            <div key={product.id} className="col-md-3 col-sm-6">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Популярные города */}
      <section className="mb-5">
        <h2 className="h3 mb-4">📍 Популярные города</h2>
        <div className="row g-3">
          {cities.slice(0, 8).map(city => (
            <div key={city.id} className="col-md-3 col-sm-6">
              <a 
                href={`/city/${city.slug}`}
                className="card text-decoration-none h-100 hover-shadow"
              >
                <div className="card-body text-center">
                  <i className="bi bi-geo-alt-fill text-primary fs-3"></i>
                  <h5 className="card-title mt-2">{city.name}</h5>
                  <p className="card-text text-muted small">
                    {city.stores_count || 0} магазинов
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Сезонные подборки */}
      <section className="mb-5">
        <h2 className="h3 mb-4">🌿 Сезонные подборки</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Товары для дачи весной</h5>
                <p className="card-text text-muted">
                  Садовый инвентарь, семена, рассада, системы полива
                </p>
                <a href="/catalog/dacha-i-sad" className="btn btn-outline-primary">
                  Смотреть подборку
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Подготовка к зиме</h5>
                <p className="card-text text-muted">
                  Утеплители, отопительное оборудование, инструмент
                </p>
                <a href="/catalog/otopitelnoe-oborudovanie" className="btn btn-outline-primary">
                  Смотреть подборку
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Ремонт и стройка</h5>
                <p className="card-text text-muted">
                  Стройматериалы, инструмент, крепёж, электрика
                </p>
                <a href="/catalog/stroymaterialy" className="btn btn-outline-primary">
                  Смотреть подборку
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}