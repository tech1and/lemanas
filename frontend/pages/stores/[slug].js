import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import LikeButton from '../../components/LikeButton';
import CommentForm from '../../components/CommentForm';
import Link from 'next/link';
import { useState } from 'react';
import { storesAPI } from '../../lib/api';

export default function StorePage({ store, error }) {
  const router = useRouter();
  const [comments, setComments] = useState(store?.comments || []);

  if (router.isFallback) {
    return (
      <Layout title="Загрузка..." description="">
        <div className="container py-5 text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
          <p className="mt-3 text-muted">Загрузка данных магазина...</p>
        </div>
      </Layout>
    );
  }

  if (error || !store) {
    return (
      <Layout
        title="Магазин не найден"
        description="Запрашиваемый магазин не найден"
        canonical="https://lemanas.ru"
      >
        <div className="container py-5 text-center">
          <div style={{ fontSize: '4rem' }}>😞</div>
          <h1 className="fw-bold mb-3">Магазин не найден</h1>
          <p className="text-muted mb-4">
            Возможно, страница была удалена или перемещена.
          </p>
          <Link href="/" className="btn btn-warning btn-lg">
            <i className="bi bi-house me-2"></i>На главную
          </Link>
        </div>
      </Layout>
    );
  }

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const features = [
    store.has_delivery && { icon: '🚚', label: 'Доставка' },
    store.has_installation && { icon: '🔧', label: 'Монтаж' },
    store.has_warranty && { icon: '🛡️', label: 'Гарантия' },
    store.has_credit && { icon: '💳', label: 'Кредит' },
  ].filter(Boolean);

  const siteUrl = 'https://lemanas.ru';
  const canonical = `${siteUrl}/stores/${store.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Рейтинг магазинов", "item": `${siteUrl}/rating` },
      { "@type": "ListItem", "position": 3, "name": store.name, "item": canonical },
    ],
  };

  const combinedSchema = [store.schema_org, breadcrumbSchema].filter(Boolean);

  return (
    <Layout
      title={store.meta_title}
      description={store.meta_description}
      canonical={canonical}
      schema={combinedSchema}
    >
      {/* Breadcrumb */}
      <nav className="container py-3" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none">
              <i className="bi bi-house me-1"></i>Главная
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/rating" className="text-decoration-none">
              Рейтинг магазинов
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {store.name}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: 'white' }} className="py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-auto">
              <div
                className="bg-white rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: 96, height: 96 }}
              >
                {store.logo ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${store.logo}`}
                    alt={store.name}
                    className="rounded-3"
                    style={{ width: 88, height: 88, objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '3rem' }}>🏪</span>
                )}
              </div>
            </div>
            <div className="col">
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="rating-badge">
                  <i className="bi bi-star-fill"></i>
                  {Number(store.rating).toFixed(1)}
                </span>
                {store.district && (
                  <span className="badge bg-white bg-opacity-25">
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    {store.district}
                  </span>
                )}
              </div>
              <h1 className="fw-black fs-2 mb-2">{store.name}</h1>
              <p className="mb-0 opacity-75">{store.short_description}</p>
            </div>
            <div className="col-auto d-none d-md-block">
              <LikeButton
                slug={store.slug}
                initialLikes={store.likes_count}
                initialLiked={store.user_liked}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Stats */}
            <div className="store-card mb-4">
              <div className="row g-0 text-center">
                <div className="col-4 stat-item border-end">
                  <div className="stat-value text-danger">
                    {store.likes_count?.toLocaleString('ru')}
                  </div>
                  <div className="stat-label">Лайков</div>
                </div>
                <div className="col-4 stat-item border-end">
                  <div className="stat-value text-primary">
                    {store.comments_count?.toLocaleString('ru')}
                  </div>
                  <div className="stat-label">Отзывов</div>
                </div>
                <div className="col-4 stat-item">
                  <div className="stat-value text-success">
                    {store.views_count?.toLocaleString('ru')}
                  </div>
                  <div className="stat-label">Просмотров</div>
                </div>
              </div>
            </div>

            {/* Like Button Mobile */}
            <div className="d-md-none mb-4">
              <LikeButton
                slug={store.slug}
                initialLikes={store.likes_count}
                initialLiked={store.user_liked}
              />
            </div>

            {/* Description */}
            <div className="store-card p-4 mb-4">
              <h2 className="h5 fw-bold mb-3">
                <i className="bi bi-info-circle text-primary me-2"></i>
                О магазине
              </h2>
              <div
                className="text-muted"
                style={{ lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: store.description.replace(/\n/g, '<br>') }}
              />
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="store-card p-4 mb-4">
                <h2 className="h5 fw-bold mb-3">
                  <i className="bi bi-check2-circle text-success me-2"></i>
                  Услуги
                </h2>
                <div className="d-flex flex-wrap gap-2">
                  {features.map(f => (
                    <span key={f.label} className="feature-badge">
                      {f.icon} {f.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {store.latitude && store.longitude && (
              <div className="store-card p-4 mb-4">
                <h2 className="h5 fw-bold mb-3">
                  <i className="bi bi-map text-info me-2"></i>
                  Местоположение
                </h2>
                <div className="map-placeholder">
                  <div className="text-center">
                    <i className="bi bi-geo-alt-fill fs-1 text-danger d-block mb-2"></i>
                    <strong>{store.address}</strong>
                    <br />
                    <small className="text-muted">
                      {store.district && `${store.district}, `}{store.city}
                    </small>
                    <br />
                    <a
                      href={`https://maps.yandex.ru/?text=${encodeURIComponent(store.address || store.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary mt-3"
                    >
                      <i className="bi bi-map-fill me-1"></i>
                      Открыть на Яндекс.Картах
                    </a>
                  </div>
                </div>
                <div className="mt-2 small text-muted">
                  <i className="bi bi-crosshair me-1"></i>
                  Координаты: {store.latitude}, {store.longitude}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="store-card p-4 mb-4">
              <h2 className="h5 fw-bold mb-4">
                <i className="bi bi-chat-quote text-warning me-2"></i>
                Отзывы ({comments.length})
              </h2>

              {comments.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-chat-dots fs-2 d-block mb-2"></i>
                  <p>Пока нет отзывов. Будьте первым!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3 mb-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="border rounded-3 p-3 bg-light">
                      <div className="d-flex align-items-start justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-warning d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: 36, height: 36, fontSize: '0.85rem' }}
                          >
                            {comment.author_name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <strong className="small">{comment.author_name}</strong>
                            <div className="small text-muted">
                              {new Date(comment.created_at).toLocaleDateString('ru-RU', {
                                year: 'numeric', month: 'long', day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <div>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i
                              key={i}
                              className={`bi bi-star-fill small ${i < comment.rating ? 'text-warning' : 'text-muted'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mb-0 small">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <CommentForm
                slug={store.slug}
                onCommentAdded={handleCommentAdded}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Info Card */}
            <div className="store-card p-4 mb-4 position-sticky" style={{ top: 20 }}>
              <h3 className="h6 fw-bold mb-3 text-muted text-uppercase" style={{ letterSpacing: 1 }}>
                Информация
              </h3>

              <ul className="list-unstyled">
                {store.phone && (
                  <li className="mb-3">
                    <div className="small text-muted mb-1">Телефон</div>
                    <a href={`tel:${store.phone}`} className="fw-semibold text-dark text-decoration-none">
                      <i className="bi bi-telephone-fill text-success me-2"></i>
                      {store.phone}
                    </a>
                  </li>
                )}

                {store.website && (
                  <li className="mb-3">
                    <div className="small text-muted mb-1">Сайт</div>
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="fw-semibold text-primary text-decoration-none"
                    >
                      <i className="bi bi-globe me-2"></i>
                      {store.website.replace(/https?:\/\//i, '').slice(0, 30)}
                    </a>
                  </li>
                )}

                {store.address && (
                  <li className="mb-3">
                    <div className="small text-muted mb-1">Адрес</div>
                    <span className="fw-semibold">
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                      {store.address}
                    </span>
                  </li>
                )}

                {store.working_hours && (
                  <li className="mb-3">
                    <div className="small text-muted mb-1">Часы работы</div>
                    <span className="fw-semibold">
                      <i className="bi bi-clock-fill text-info me-2"></i>
                      {store.working_hours}
                    </span>
                  </li>
                )}
              </ul>

              {/* Pricing */}
              {(store.min_price || store.price_range) && (
                <>
                  <hr />
                  <h3 className="h6 fw-bold mb-3 text-muted text-uppercase" style={{ letterSpacing: 1 }}>
                    Цены
                  </h3>
                  <div className="d-flex flex-column gap-2">
                    {store.min_price && (
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted">Минимальная цена</span>
                        <span className="badge bg-success fs-6">от {store.min_price} ₽</span>
                      </div>
                    )}
                    {store.price_range && (
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted">Ценовой диапазон</span>
                        <span className="badge bg-primary fs-6">{store.price_range}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* CTA */}
              {store.website && (
                <a
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="btn btn-warning w-100 fw-bold mt-4"
                >
                  <i className="bi bi-box-arrow-up-right me-2"></i>
                  Перейти на сайт
                </a>
              )}

              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="btn btn-outline-success w-100 fw-bold mt-2"
                >
                  <i className="bi bi-telephone me-2"></i>
                  Позвонить
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await storesAPI.getDetail(params.slug);
    return {
      props: {
        store: res.data,
      },
    };
  } catch (err) {
    if (err.response?.status === 404) {
      return { notFound: true };
    }
    return {
      props: {
        store: null,
        error: 'Ошибка загрузки данных',
      },
    };
  }
}