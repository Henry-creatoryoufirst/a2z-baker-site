'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/shop/CartProvider'

interface ShopProduct {
  id: number
  name: string
  thumbnail_url: string
  variants: number
  price: string | null
}

export default function ShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toggleCart, itemCount } = useCart()

  useEffect(() => {
    fetch('/api/shop/products')
      .then(r => r.json())
      .then(data => {
        if (data.message) {
          setError(data.message)
          setProducts([])
        } else if (Array.isArray(data)) {
          setProducts(data)
        } else {
          setProducts([])
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load products')
        setLoading(false)
      })
  }, [])

  return (
    <div className="shop-container">
      {/* Header */}
      <header className="shop-header">
        <div className="shop-header-inner">
          <Link href="/" className="shop-back-link">
            &larr; Back to A2Z Bakerie
          </Link>
          <h1 className="shop-title">Merch Shop</h1>
          <button className="shop-cart-btn" onClick={toggleCart}>
            Cart ({itemCount})
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="shop-main">
        <div className="shop-intro">
          <h2>A2Z Bakerie Merchandise</h2>
          <p>Wear your love for baking! Browse our collection of bakery-themed merchandise.</p>
        </div>

        {loading && (
          <div className="shop-loading">Loading products...</div>
        )}

        {error && (
          <div className="shop-message">{error}</div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="shop-message">No products available yet. Check back soon!</div>
        )}

        {!loading && products.length > 0 && (
          <div className="products-grid">
            {products.map(product => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="product-card"
              >
                <div className="product-image">
                  {product.thumbnail_url ? (
                    <img src={product.thumbnail_url} alt={product.name} />
                  ) : (
                    <div className="product-placeholder">No Image</div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  {product.price && (
                    <div className="product-price">From ${product.price}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        .shop-container {
          min-height: 100vh;
        }
        .shop-header {
          background: #3D2B1F;
          padding: 0 24px;
        }
        .shop-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .shop-back-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .shop-back-link:hover {
          color: white;
        }
        .shop-title {
          font-family: 'Cormorant Garamond', serif;
          color: white;
          font-size: 1.5rem;
          margin: 0;
        }
        .shop-cart-btn {
          background: #C4907C;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background 0.2s;
        }
        .shop-cart-btn:hover {
          background: #b07d6a;
        }
        .shop-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        .shop-intro {
          text-align: center;
          margin-bottom: 40px;
        }
        .shop-intro h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          color: #3D2B1F;
          margin-bottom: 8px;
        }
        .shop-intro p {
          color: #5a4638;
          font-size: 1.05rem;
        }
        .shop-loading {
          text-align: center;
          padding: 60px 0;
          color: #5a4638;
          font-size: 1.1rem;
        }
        .shop-message {
          text-align: center;
          padding: 60px 0;
          color: #5a4638;
          font-size: 1rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(61, 43, 31, 0.06);
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }
        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          box-shadow: 0 2px 12px rgba(61, 43, 31, 0.06);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(61, 43, 31, 0.12);
        }
        .product-image {
          aspect-ratio: 1;
          overflow: hidden;
          background: #f0ebe5;
        }
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 0.9rem;
        }
        .product-info {
          padding: 16px;
        }
        .product-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: #3D2B1F;
          margin: 0 0 6px;
        }
        .product-price {
          color: #C4907C;
          font-weight: 600;
          font-size: 1rem;
        }
        @media (max-width: 600px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
          }
          .shop-intro h2 {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  )
}
