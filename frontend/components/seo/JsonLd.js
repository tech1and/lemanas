/**
 * Микроразметка Schema.org для SEO
 * @param {{ data: Object }} props
 */
export function JsonLd({ data }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.product.name,
    description: data.product.description,
    image: data.product.image,
    brand: {
      '@type': 'Brand',
      name: data.product.brand
    },
    sku: data.product.sku,
    offers: {
      '@type': 'Offer',
      url: data.product.offers.url,
      priceCurrency: data.product.offers.priceCurrency,
      price: data.product.offers.price,
      availability: data.product.offers.availability,
      seller: {
        '@type': 'Organization',
        name: 'Лемана ПРО'
      }
    },
    ...(data.product.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.product.aggregateRating.ratingValue,
        reviewCount: data.product.aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1
      }
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}