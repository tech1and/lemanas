import Layout from '../../components/Layout';
import Link from 'next/link';
import { blogAPI } from '../../lib/api';

export default function BlogPage({ posts, categories }) {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Блог — Рейтинг магазинов Лемана Про",
    "url": "https://lemanas.ru/blog",
    "description": "Полезные статьи, советы и актуальные рейтинги магазинов Лемана Про",
  };

  return (
    <Layout
      title="Блог — Рейтинг магазинов Лемана Про"
      description="Полезные статьи, советы и актуальные рейтинги магазинов Лемана Про. Читайте о выборе товаров, ремонте и обустройстве дома."
      canonical="https://lemanas.ru/blog"
      schema={blogSchema}
    >
      <div className="container py-5">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-lg-8">
            <span className="badge bg-warning text-dark mb-3">📰 Блог</span>
            <h1 className="display-5 fw-bold mb-3">
              Блог о магазинах Лемана Про
            </h1>
            <p className="lead text-muted mb-0">
              Полезные статьи, советы и актуальные рейтинги для покупателей
            </p>
          </div>
        </div>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-4">
            <span className="fw-semibold text-muted me-2">Категории:</span>
            {categories.map(cat => (
              <span key={cat.id} className="badge bg-warning text-dark px-3 py-2">
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <div className="row g-4">
          {posts.map(post => (
            <div key={post.id} className="col-md-6 col-lg-4">
              <div className="store-card blog-card h-100">
                {post.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.image}`}
                    alt={post.title}
                    className="card-img-top"
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: 200, fontSize: '4rem' }}
                  >
                    🏪
                  </div>
                )}
                <div className="card-body p-4">
                  {post.category && (
                    <span className="badge bg-warning text-dark mb-2">
                      {post.category.name}
                    </span>
                  )}
                  <h2 className="h6 card-title fw-bold">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-dark text-decoration-none"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="card-text text-muted small">
                    {post.excerpt?.slice(0, 120)}...
                  </p>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1"></i>
                      {new Date(post.created_at).toLocaleDateString('ru-RU')}
                    </small>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="btn btn-sm btn-outline-warning"
                    >
                      Читать →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-journal-x fs-1 d-block mb-3"></i>
            <p>Статей пока нет</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [postsRes, categoriesRes] = await Promise.all([
      blogAPI.getPosts(),
      blogAPI.getCategories(),
    ]);
    return {
      props: {
        posts: postsRes.data.results || postsRes.data,
        categories: categoriesRes.data.results || categoriesRes.data,
      },
    };
  } catch (err) {
    return {
      props: { posts: [], categories: [] },
    };
  }
}