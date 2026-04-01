'use client';

import { useState, useEffect } from 'react';

interface ShopProduct {
  id: number;
  name: string;
  thumbnail_url: string | null;
  variants: number;
  price: string | null;
}

export default function Shop() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/shop/products')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Don't render section if no products and not loading
  if (!loading && (products.length === 0 || error)) {
    return null;
  }

  return (
    <section className="section shop-section" id="shop">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Merch</span>
          <h2 className="section-title">Rep the Bakerie</h2>
          <div className="section-divider" />
          <p className="shop-subtitle">
            Show your love for A2Z Bakerie with our premium apparel. Every purchase supports a small business.
          </p>
        </div>

        {loading ? (
          <div className="shop-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="shop-skeleton">
                <div className="skeleton-img" />
                <div className="skeleton-text" />
                <div className="skeleton-price" />
              </div>
            ))}
          </div>
        ) : (
          <div className="shop-grid">
            {products.map((product, i) => (
              <a
                key={product.id}
                href={`/shop/${product.id}`}
                className="shop-card"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="shop-card-image">
                  {product.thumbnail_url ? (
                    <img src={product.thumbnail_url} alt={product.name} />
                  ) : (
                    <div className="shop-card-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.38 3.46 16 2 12 3.5 8 2 3.62 3.46a2 2 0 0 0-1.34 1.89v14.3a2 2 0 0 0 2.16 2l4.39-.87L12 22l3.17-1.22 4.39.87a2 2 0 0 0 2.16-2V5.35a2 2 0 0 0-1.34-1.89Z" />
                        <path d="M12 22V3.5" />
                      </svg>
                    </div>
                  )}
                  <div className="shop-card-overlay">
                    <span className="shop-card-cta">View Details →</span>
                  </div>
                </div>
                <div className="shop-card-info">
                  <h3>{product.name}</h3>
                  {product.price && (
                    <span className="shop-card-price">From ${product.price}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="shop-footer">
          <a href="/shop" className="shop-link">
            Browse All Merch →
          </a>
        </div>
      </div>

      <style jsx>{`
        .shop-section {
          background: var(--white);
          position: relative;
          z-index: 2;
        }

        .shop-subtitle {
          font-size: 1.02rem;
          color: var(--brown-light);
          max-width: 500px;
          margin: 16px auto 0;
          line-height: 1.7;
          text-align: center;
        }

        .shop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
          max-width: 960px;
          margin: 0 auto;
        }

        /* Product Card */
        .shop-card {
          background: var(--cream);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          border: 1px solid rgba(61, 43, 31, 0.06);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          animation: shopCardIn 0.5s ease forwards;
          opacity: 0;
        }
        .shop-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 36px rgba(61, 43, 31, 0.12);
        }

        @keyframes shopCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .shop-card-image {
          position: relative;
          height: 300px;
          overflow: hidden;
          background: #f5f0eb;
        }
        .shop-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .shop-card:hover .shop-card-image img {
          transform: scale(1.05);
        }

        .shop-card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(61, 43, 31, 0.15);
        }

        .shop-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(61, 43, 31, 0.7) 0%, transparent 50%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 24px;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .shop-card:hover .shop-card-overlay {
          opacity: 1;
        }
        .shop-card-cta {
          color: white;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 10px 24px;
          border: 1.5px solid rgba(255, 255, 255, 0.6);
          border-radius: 50px;
          transition: all 0.25s ease;
        }
        .shop-card:hover .shop-card-cta {
          background: rgba(255, 255, 255, 0.15);
          border-color: white;
        }

        .shop-card-info {
          padding: 20px 24px 24px;
          text-align: center;
        }
        .shop-card-info h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--brown);
          margin-bottom: 6px;
        }
        .shop-card-price {
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--rose);
        }

        /* Footer link */
        .shop-footer {
          text-align: center;
          margin-top: 48px;
        }
        .shop-link {
          display: inline-block;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--rose);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 12px 32px;
          border: 1.5px solid var(--rose);
          border-radius: 50px;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .shop-link:hover {
          background: var(--rose);
          color: var(--white);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(196, 144, 124, 0.3);
        }

        /* Skeleton loading */
        .shop-skeleton {
          border-radius: 16px;
          overflow: hidden;
          background: var(--cream);
        }
        .skeleton-img {
          height: 300px;
          background: linear-gradient(90deg, #f0ebe5 25%, #e8e2db 50%, #f0ebe5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-text {
          height: 20px;
          width: 60%;
          margin: 20px auto 8px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f0ebe5 25%, #e8e2db 50%, #f0ebe5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-price {
          height: 16px;
          width: 30%;
          margin: 0 auto 24px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f0ebe5 25%, #e8e2db 50%, #f0ebe5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 600px) {
          .shop-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .shop-card-image { height: 260px; }
        }
      `}</style>
    </section>
  );
}
