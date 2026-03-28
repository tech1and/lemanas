// frontend/components/seo/MetaTags.js
import Head from 'next/head'

/**
 * Глобальные мета-теги для SEO
 */
export function MetaTags() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Лемана Про Каталог'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lemanas.ru'
  
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0d6efd" />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Яндекс.Вебмастер верификация (опционально) */}
      {/* <meta name="yandex-verification" content="your-verification-code" /> */}
    </Head>
  )
}