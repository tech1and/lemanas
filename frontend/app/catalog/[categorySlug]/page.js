import { fetchCategoryBySlug, fetchProductsByCategory } from '@/lib/api'
import { ProductCard } from '@/components/catalog/ProductCard'
import { FilterPanel } from '@/components/ui/FilterPanel'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

/**
 * Страница категории — рейтинг товаров
 * @param {{ params: { categorySlug: string }, searchParams: { city?: string, sort?: string } }} props
 */
export async function generateMetadata({ params }) {
  const category = await fetchCategoryBySlug(params.categorySlug)
  return {
    title: `${category.name} Лемана Про — Рейтинг, цены, отзывы`,
    description: `Топ товаров категории "${category.name}" в Лемана Про. Сравнение цен, отзывы покупателей, наличие в магазинах.`
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const category = await fetchCategoryBySlug(params.categorySlug)
  const products = await fetchProductsByCategory(params.categorySlug, {
    city: searchParams.city,
    sort: searchParams.sort || 'rating',
    page: searchParams.page || 1
  })

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: category.name, href: `/catalog/${category.slug}` }
  ]

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbs} />

      <div className="row g-4">
        {/* Фильтры */}
        <div className="col-md-3">
          <FilterPanel 
            category={category} 
            cityId={searchParams.city}
            currentSort={searchParams.sort}
          />
        </div>

        {/* Товары */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0">{category.name}</h1>
            <select 
              className="form-select w-auto"
              defaultValue={searchParams.sort || 'rating'}
            >
              <option value="rating">По рейтингу</option>
              <option value="price_asc">Сначала дешёвые</option>
              <option value="price_desc">Сначала дорогие</option>
              <option value="likes">По популярности</option>
            </select>
          </div>

          <div className="row g-4">
            {products.results.map(product => (
              <div key={product.id} className="col-md-4 col-sm-6">
                <ProductCard product={product} cityId={searchParams.city} />
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {products.count > products.results.length && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className="page-item disabled">
                  <span className="page-link">← Назад</span>
                </li>
                <li className="page-item active">
                  <span className="page-link">1</span>
                </li>
                <li className="page-item">
                  <a className="page-link" href="?page=2">2</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="?page=3">Вперёд →</a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}