import Layout from '../components/Layout';
import Link from 'next/link';

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "О проекте — Рейтинг магазинов Лемана Про",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    "description": "Узнайте больше о нашем независимом рейтинге магазинов Лемана Про",
  };

  return (
    <Layout
      title="О проекте — Рейтинг магазинов Лемана Про"
      description="Узнайте больше о нашем независимом рейтинге магазинов Лемана Про. Как формируется рейтинг, наша миссия и принципы работы."
      canonical={`${process.env.NEXT_PUBLIC_SITE_URL}/about`}
      schema={aboutSchema}
    >
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-lg-8">
            <span className="badge bg-warning text-dark mb-3">ℹ️ О проекте</span>
            <h1 className="display-5 fw-bold mb-3">
              О рейтинге магазинов Лемана Про
            </h1>
            <p className="lead text-muted mb-0">
              Независимый рейтинг магазинов Лемана Про, основанный на реальных отзывах покупателей
            </p>
          </div>
        </div>

        {/* Mission */}
        <section className="mb-5">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">
                <i className="bi bi-bullseye text-primary me-2"></i>
                Наша миссия
              </h2>
              <p className="text-muted">
                Мы создаём прозрачный и честный рейтинг магазинов Лемана Про,
                помогая покупателям делать обоснованный выбор. Все оценки формируются
                на основе реальных отзывов пользователей и объективных данных.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-5">
          <div className="row">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-4">
                <i className="bi bi-gear-fill text-primary me-2"></i>
                Как работает рейтинг?
              </h2>
              <div className="row g-4">
                {[
                  {
                    step: '1',
                    icon: '💬',
                    title: 'Отзывы покупателей',
                    text: 'Пользователи оставляют отзывы о магазинах Лемана Про'
                  },
                  {
                    step: '2',
                    icon: '👍',
                    title: 'Лайки и оценки',
                    text: 'Ставят лайки понравившимся магазинам'
                  },
                  {
                    step: '3',
                    icon: '👁️',
                    title: 'Просмотры страниц',
                    text: 'Просматривают страницы — это также учитывается'
                  },
                  {
                    step: '4',
                    icon: '📊',
                    title: 'Алгоритм рейтинга',
                    text: 'Алгоритм формирует итоговый рейтинг на основе всех данных'
                  },
                ].map(item => (
                  <div key={item.step} className="col-md-6">
                    <div className="d-flex gap-3 p-3 border rounded h-100">
                      <div className="flex-shrink-0">
                        <span className="badge bg-warning text-dark rounded-circle" style={{ width: 40, height: 40, fontSize: '1.2rem' }}>
                          {item.step}
                        </span>
                      </div>
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <span className="me-2" style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                          <strong>{item.title}</strong>
                        </div>
                        <p className="text-muted small mb-0">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-5">
          <div className="row">
            <div className="col-lg-8">
              <div className="p-4 bg-gradient-primary text-white rounded">
                <h3 className="fw-bold mb-3">Готовы выбрать лучший магазин?</h3>
                <p className="mb-4">
                  Смотрите полный рейтинг магазинов Лемана Про и выбирайте лучший вариант для себя
                </p>
                <Link href="/rating" className="btn btn-warning btn-lg">
                  Смотреть рейтинг
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="row">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-4">Почему нам доверяют?</h2>
              <div className="row g-4">
                {[
                  {
                    icon: '⭐',
                    title: 'Объективность',
                    text: 'Рейтинг основан на реальных данных покупателей, а не на платных размещениях'
                  },
                  {
                    icon: '🔄',
                    title: 'Актуальность',
                    text: 'Рейтинг обновляется ежедневно с учётом новых отзывов и оценок'
                  },
                  {
                    icon: '🔍',
                    title: 'Прозрачность',
                    text: 'Мы открыто рассказываем о принципах формирования рейтинга'
                  },
                  {
                    icon: '🛡️',
                    title: 'Модерация',
                    text: 'Все отзывы проходят проверку на достоверность'
                  },
                ].map(item => (
                  <div key={item.title} className="col-sm-6">
                    <div className="d-flex gap-3 align-items-start">
                      <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p className="text-muted small mb-0">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}