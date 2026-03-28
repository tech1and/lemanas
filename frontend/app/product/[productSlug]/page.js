import { fetchProductBySlug, fetchRelatedProducts } from '@/lib/api'
import { ProductGallery } from '@/components/catalog/ProductGallery'
import { ProductParams } from '@/components/catalog/ProductParams'
import { ProductRating } from '@/components/catalog/ProductRating'
import { PartnerButton } from '@/components/catalog/PartnerButton'
import { AvailabilityBadge } from '@/components/geo/AvailabilityBadge'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

/**
 * Карточка товара — полная информация + партнёрская кнопка
 * @param {{ params: { productSlug: string }, searchParams: { city?: string } }} props
 */
export async function generateMetadata({ params }) {
  const product = await fetchProductBySlug(params.productSlug)
  return {
    title: `${product.name} — Цена, отзывы, наличие | Лемана Про Каталог`,
    description: product.description?.slice(0, 160) || `Купить ${product.name} в Лемана Про. Характеристики, отзывы, наличие в магазинах.`
  }
}

export default async function ProductPage({ params, searchParams }) {
  const product = await fetchProductBySlug(params.productSlug)
  const relatedProducts = await fetchRelatedProducts(product.id, 4)

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    ...product.categories.slice(0, 2).map(cat => ({
      label: cat.name,
      href: `/catalog/${cat.slug}`
    })),
    { label: product.name, href: `/product/${product.slug}` }
  ]

  const jsonLdData = {
    product: {
      name: product.name,
      description: product.description,
      image: product.images,
      offers: {
        price: product.price.toString(),
        priceCurrency: product.currency,
        availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: product.url
      },
      aggregateRating: product.avg_rating ? {
        ratingValue: product.avg_rating,
        reviewCount: product.reviews_count
      } : null,
      brand: product.params?.Бренд || 'Лемана Про',
      sku: product.xml_id
    }
  }

  return (
    <div className="container">
      <JsonLd data={jsonLdData} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="row g-5 mt-4">
        {/* Галерея */}
        <div className="col-md-6">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Информация о товаре */}
        <div className="col-md-6">
          <h1 className="h2 mb-3">{product.name}</h1>

          {/* Рейтинг */}
          <ProductRating 
            avgRating={product.avg_rating} 
            reviewCount={product.reviews_count}
          />

          {/* Цена */}
          <div className="display-6 fw-bold my-3">
            {Math.floor(product.price)} ₽
          </div>

          {/* Наличие */}
          <AvailabilityBadge 
            inStock={product.in_stock}
            cities={product.available_in_cities}
            cityId={searchParams.city}
          />

          {/* Партнёрская кнопка */}
          <div className="my-4">
            <PartnerButton
              productId={product.id}
              productXmlId={product.xml_id}
              basePartnerUrl={product.url}
              cityId={searchParams.city ? parseInt(searchParams.city) : null}
              price={product.price}
            />
          </div>

          {/* Краткие характеристики */}
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title h6 mb-3">Основные характеристики</h5>
              <ProductParams params={product.params} limit={5} />
            </div>
          </div>
        </div>
      </div>

      {/* Полное описание */}
      <section className="mt-5">
        <h2 className="h3 mb-3">📋 Описание</h2>
        <div className="card">
          <div className="card-body">
            <p className="card-text">{product.description}</p>
          </div>
        </div>
      </section>

      {/* Все параметры */}
      <section className="mt-5">
        <h2 className="h3 mb-3">⚙️ Все характеристики</h2>
        <ProductParams params={product.params} />
      </section>

      {/* Отзывы */}
      <section className="mt-5">
        <h2 className="h3 mb-3">💬 Отзывы покупателей</h2>
        <ProductRating 
          avgRating={product.avg_rating} 
          reviewCount={product.reviews_count}
          reviews={product.recent_reviews}
          productId={product.id}
        />
      </section>

      {/* Похожие товары */}
      <section className="mt-5 mb-5">
        <h2 className="h3 mb-4">🔍 Похожие товары</h2>
        <div className="row g-4">
          {relatedProducts.map(p => (
            <div key={p.id} className="col-md-3 col-sm-6">
              <ProductCard product={p} cityId={searchParams.city} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}