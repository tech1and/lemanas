import Layout from '../components/Layout';
import RatingList from '../components/RatingList';
import Link from 'next/link';
import { taxiparksAPI, blogAPI } from '../lib/api';

export default function HomePage({ topTaxiparks, latestPosts, stats }) {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Рейтинг магазинов Лемана Про",
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    "description": "Независимый рейтинг лучших магазинов Лемана Про 2026",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Layout
      title="Рейтинг магазинов Лемана Про 2026 — Топ-20 лучших"
      description="Независимый рейтинг 20 лучших магазинов Лемана Про. Сравнивайте цены, читайте отзывы, выбирайте лучший магазин."
      canonical={process.env.NEXT_PUBLIC_SITE_URL}
      schema={homeSchema}
    >
      {/* Hero */}
      <section className="py-5 bg-gradient-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark mb-3">🏆 Рейтинг 2026</span>
              <h1 className="display-4 fw-bold mb-3">
                Лучшие магазины<br />Лемана Про
              </h1>
              <p className="lead mb-4">
                Независимый рейтинг 20 ведущих магазинов Лемана Про.
                Реальные отзывы, актуальные цены и честные оценки.
              </p>
              <Link href="#rating" className="btn btn-warning btn-lg me-3">
                Смотреть рейтинг
              </Link>
              <Link href="/blog" className="btn btn-outline-light btn-lg">
                Статьи
              </Link>
            </div>
            <div className="col-lg-5 text-center d-none d-lg-block">
              <div style={{ fontSize: '10rem', lineHeight: 1 }}>🏪</div>
              <p className="text-white-50">Рейтинг обновляется ежедневно</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-4 bg-white shadow-sm">
        <div className="container">
          <div className="row text-center g-0">
            <div className="col-4 stat-item border-end">
              <div className="stat-value">{stats?.total || 20}+</div>
              <div className="stat-label">Магазинов</div>
            </div>
            <div className="col-4 stat-item border-end">
              <div className="stat-value">{stats?.reviews || '500'}+</div>
              <div className="stat-label">Отзывов</div>
            </div>
            <div className="col-4 stat-item">
              <div className="stat-value">{stats?.views || '10K'}+</div>
              <div className="stat-label">Посетителей</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Section */}
      <section id="rating" className="py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="fw-bold mb-1">
                <i className="bi bi-trophy-fill text-warning me-2"></i>
                Рейтинг магазинов Лемана Про
              </h2>
              <p className="text-muted mb-0">
                Топ-20 лучших магазинов по мнению пользователей
              </p>
            </div>
            <Link href="/rating" className="btn btn-outline-warning d-none d-md-block">
              Все магазины
            </Link>
          </div>

          <RatingList />
        </div>
      </section>

      {/* Blog Preview */}
      {latestPosts && latestPosts.length > 0 && (
        <section className="py-5 bg-white">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="fw-bold mb-1">
                  <i className="bi bi-journal-text text-primary me-2"></i>
                  Полезные статьи
                </h2>
                <p className="text-muted mb-0">Советы и рейтинги для выбора магазина</p>
              </div>
              <Link href="/blog" className="btn btn-outline-primary d-none d-md-block">
                Все статьи
              </Link>
            </div>

            <div className="row g-4">
              {latestPosts.slice(0, 3).map(post => (
                <div key={post.id} className="col-md-4">
                  <div className="taxi-card blog-card h-100">
                    {post.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${post.image}`}
                        alt={post.title}
                        className="card-img-top"
                        style={{ height: 180, objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="card-img-top d-flex align-items-center justify-content-center bg-light"
                        style={{ height: 180, fontSize: '3rem' }}
                      >
                        🏪
                      </div>
                    )}
                    <div className="card-body p-3">
                      {post.category && (
                        <span className="badge bg-warning text-dark mb-2">
                          {post.category.name}
                        </span>
                      )}
                      <h5 className="card-title fw-bold" style={{ fontSize: '1rem' }}>
                        <Link href={`/blog/${post.slug}`} className="text-dark text-decoration-none">
                          {post.title}
                        </Link>
                      </h5>
                      <p className="card-text text-muted small">
                        {post.excerpt?.slice(0, 100)}...
                      </p>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <small className="text-muted">
                          {new Date(post.created_at).toLocaleDateString('ru-RU')}
                        </small>
                        <small className="text-muted">
                          <i className="bi bi-eye me-1"></i>{post.views_count}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO текст */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-4">О рейтинге магазинов Лемана Про</h2>
              <p className="text-muted">
                Наш сайт предоставляет независимый рейтинг магазинов Лемана Про, 
                основанный на реальных отзывах покупателей и объективных данных. 
                Мы анализируем качество обслуживания, ассортимент товаров, 
                ценовую политику и удобство расположения каждого магазина.
              </p>
              <p className="text-muted">
                В нашем рейтинге представлены магазины Лемана Про в разных районах, 
                предлагающие широкий выбор товаров для дома и ремонта. 
                Рейтинг формируется на основе лайков, отзывов и просмотров 
                страниц магазинов.
              </p>
              <div className="row g-3 mt-2">
                {[
                  { icon: '⭐', title: 'Объективный рейтинг', text: 'Основан на реальных данных покупателей' },
                  { icon: '🔄', title: 'Ежедневное обновление', text: 'Рейтинг обновляется каждый день' },
                  { icon: '🔍', title: 'Детальный анализ', text: 'Подробные страницы каждого магазина' },
                  { icon: '💬', title: 'Реальные отзывы', text: 'Комментарии проходят модерацию' },
                ].map(item => (
                  <div key={item.title} className="col-sm-6">
                    <div className="d-flex gap-3 align-items-start">
                      <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p className="small text-muted mb-0">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [taxiRes, blogRes] = await Promise.all([
      taxiparksAPI.getList({ ordering: '-rating', page_size: 20 }),
      blogAPI.getPosts({ page_size: 3 }),
    ]);
    const taxiData = taxiRes.data;
    const blogData = blogRes.data;

    const topTaxiparks = taxiData.results || taxiData;
    const latestPosts = blogData.results || blogData;

    const totalViews = topTaxiparks.reduce((sum, p) => sum + (p.views_count || 0), 0);

    return {
      props: {
        topTaxiparks: topTaxiparks.slice(0, 20),
        latestPosts: latestPosts.slice(0, 3),
        stats: {
          total: topTaxiparks.length,
          reviews: 500,
          views: totalViews > 1000 ? `${Math.floor(totalViews / 1000)}K` : totalViews,
        },
      },
    };
  } catch (err) {
    console.error('SSR Error:', err.message);
    return {
      props: {
        topTaxiparks: [],
        latestPosts: [],
        stats: { total: 20, reviews: 500, views: '10K' },
      },
    };
  }
}