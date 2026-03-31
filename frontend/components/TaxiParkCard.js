import Link from 'next/link';
import Image from 'next/image';

export default function StoreCard({ store, rank }) {
  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-other';
  };

  return (
    <div className="store-card d-flex gap-3 p-3 rounded-3 border bg-white h-100">
      {/* Rank */}
      {rank && (
        <div className={`rank-number ${getRankClass(rank)}`}>
          {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
        </div>
      )}

      {/* Logo */}
      <div
        className="flex-shrink-0 d-flex align-items-center justify-content-center bg-light rounded-3"
        style={{ width: 56, height: 56 }}
      >
        {store.logo ? (
          <Image
            src={store.logo}
            alt={store.name}
            width={56}
            height={56}
            className="rounded-3 object-fit-cover"
          />
        ) : (
          <span style={{ fontSize: '1.8rem' }}>🏪</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow-1 min-width-0">
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-2">
          <div>
            <Link
              href={`/stores/${store.slug}`}
              className="text-decoration-none"
            >
              <h3 className="h6 fw-bold mb-1 text-dark hover-primary">
                {store.name}
              </h3>
            </Link>
            {store.district && (
              <span className="badge bg-light text-muted me-2 small">
                <i className="bi bi-geo-alt-fill me-1 text-danger"></i>
                {store.district}
              </span>
            )}
          </div>
          <div className="rating-badge">
            <i className="bi bi-star-fill"></i>
            {Number(store.rating).toFixed(1)}
          </div>
        </div>

        <p className="small text-muted mb-2 mt-1">
          {store.short_description?.slice(0, 120)}
          {store.short_description?.length > 120 ? '...' : ''}
        </p>

        <div className="d-flex flex-wrap align-items-center gap-3">
          {/* Stats */}
          <span className="small text-muted">
            <i className="bi bi-heart-fill text-danger me-1"></i>
            {store.likes_count?.toLocaleString('ru')}
          </span>
          <span className="small text-muted">
            <i className="bi bi-chat-fill text-primary me-1"></i>
            {store.comments_count?.toLocaleString('ru')}
          </span>
          <span className="small text-muted">
            <i className="bi bi-eye-fill text-success me-1"></i>
            {store.views_count?.toLocaleString('ru')}
          </span>

          {/* Price */}
          {store.min_price && (
            <span className="small fw-semibold text-success">
              от {store.min_price} ₽
            </span>
          )}

          {/* CTA */}
          <Link
            href={`/stores/${store.slug}`}
            className="btn btn-sm btn-outline-warning fw-semibold ms-auto"
          >
            Подробнее <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}