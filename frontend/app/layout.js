import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { GeoProvider } from '@/hooks/useGeoLocation'
import { MetaTags } from '@/components/seo/MetaTags'

/**
 * Корневой layout приложения
 */
export const metadata = {
  title: 'Рейтинг товаров Лемана Про — Отзывы, Цены, Наличие',
  description: 'Независимый каталог товаров Лемана Про с отзывами покупателей, сравнением цен и наличием в 112 магазинах России',
  keywords: 'лемана про, каталог, цены, отзывы, стройматериалы, дача, сад',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Лемана Про Каталог'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <MetaTags />
        <link rel="preconnect" href="https://cdn.lemanapro.ru" />
      </head>
      <body>
        <GeoProvider>
          <header className="bg-dark text-white py-3">
            <div className="container">
              <nav className="d-flex justify-content-between align-items-center">
                <a href="/" className="text-white text-decoration-none fs-4">
                  🏠 Лемана Про Каталог
                </a>
                <div className="d-flex gap-3">
                  <a href="/catalog" className="text-white text-decoration-none">Каталог</a>
                  <a href="/city/moskva" className="text-white text-decoration-none">Города</a>
                  <a href="/reviews" className="text-white text-decoration-none">Отзывы</a>
                </div>
              </nav>
            </div>
          </header>

          <main className="py-4">{children}</main>

          <footer className="bg-light py-4 mt-5">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <p className="text-muted">
                    © 2026 Независимый каталог товаров Лемана Про. 
                    Не является официальным сайтом.
                  </p>
                  <p className="text-muted small">
                    *Партнёрские ссылки помечены соответствующим образом. 
                    Мы получаем комиссию за переходы.
                  </p>
                </div>
                <div className="col-md-6 text-md-end">
                  <a href="/about" className="text-muted text-decoration-none me-3">О проекте</a>
                  <a href="/privacy" className="text-muted text-decoration-none">Конфиденциальность</a>
                </div>
              </div>
            </div>
          </footer>
        </GeoProvider>
      </body>
    </html>
  )
}