import Layout from '../components/Layout';
import RatingList from '../components/RatingList';

export default function RatingPage() {
  const ratingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Рейтинг магазинов Лемана Про — Все магазины",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/rating`,
    "description": "Полный рейтинг всех магазинов Лемана Про. Сравнивайте, выбирайте лучший магазин.",
  };

  return (
    <Layout
      title="Рейтинг магазинов Лемана Про 2026 — Все магазины"
      description="Полный рейтинг всех магазинов Лемана Про. Сравнивайте цены, читайте отзывы, выбирайте лучший магазин."
      canonical={`${process.env.NEXT_PUBLIC_SITE_URL}/rating`}
      schema={ratingSchema}
    >
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-lg-8">
            <span className="badge bg-warning text-dark mb-3">🏆 Полный рейтинг</span>
            <h1 className="display-5 fw-bold mb-3">
              Все магазины Лемана Про
            </h1>
            <p className="lead text-muted mb-0">
              Полный рейтинг магазинов Лемана Про по мнению пользователей.
              Сравнивайте цены, читайте отзывы, выбирайте лучший магазин.
            </p>
          </div>
        </div>

        <RatingList />
      </div>
    </Layout>
  );
}