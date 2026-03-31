'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/components/shop/CartProvider'

interface ProductVariant {
  id: number
  name: string
  retail_price: string
  currency: string
  product: {
    variant_id: number
    product_id: number
    image: string
    name: string
  }
  files: Array<{
    type: string
    preview_url: string
    thumbnail_url: string
  }>
}

interface ProductDetail {
  sync_product: {
    id: number
    name: string
    thumbnail_url: string
  }
  sync_variants: ProductVariant[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { addItem, toggleCart, itemCount } = useCart()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/shop/products?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else if (data.sync_product) {
          setProduct(data)
          if (data.sync_variants?.length > 0) {
            setSelectedVariant(data.sync_variants[0])
          }
        } else {
          setError('Product not found')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load product')
        setLoading(false)
      })
  }, [id])

  function handleAddToCart() {
    if (!selectedVariant || !product) return
    const previewFile = selectedVariant.files?.find(f => f.type === 'preview')
    const imageUrl = previewFile?.preview_url || selectedVariant.product?.image || product.sync_product.thumbnail_url || ''

    addItem({
      variantId: selectedVariant.id,
      productName: product.sync_product.name,
      variantName: selectedVariant.name,
      price: parseFloat(selectedVariant.retail_price),
      imageUrl,
    }, quantity)

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // Get the current display image
  const currentImage = (() => {
    if (selectedVariant) {
      const preview = selectedVariant.files?.find(f => f.type === 'preview')
      if (preview?.preview_url) return preview.preview_url
      if (selectedVariant.product?.image) return selectedVariant.product.image
    }
    return product?.sync_product.thumbnail_url || ''
  })()

  // Extract size/color options from variant names
  const variantOptions = product?.sync_variants || []

  if (loading) {
    return (
      <div className="shop-container">
        <header className="shop-header">
          <div className="shop-header-inner">
            <Link href="/shop" className="shop-back-link">&larr; Back to Shop</Link>
            <span className="shop-title">Merch Shop</span>
            <button className="shop-cart-btn" onClick={toggleCart}>Cart ({itemCount})</button>
          </div>
        </header>
        <div className="detail-loading">Loading product...</div>
        <style jsx>{`${headerStyles}${detailPageStyles}`}</style>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="shop-container">
        <header className="shop-header">
          <div className="shop-header-inner">
            <Link href="/shop" className="shop-back-link">&larr; Back to Shop</Link>
            <span className="shop-title">Merch Shop</span>
            <button className="shop-cart-btn" onClick={toggleCart}>Cart ({itemCount})</button>
          </div>
        </header>
        <div className="detail-error">{error || 'Product not found'}</div>
        <style jsx>{`${headerStyles}${detailPageStyles}`}</style>
      </div>
    )
  }

  return (
    <div className="shop-container">
      <header className="shop-header">
        <div className="shop-header-inner">
          <Link href="/shop" className="shop-back-link">&larr; Back to Shop</Link>
          <span className="shop-title">Merch Shop</span>
          <button className="shop-cart-btn" onClick={toggleCart}>Cart ({itemCount})</button>
        </div>
      </header>

      <main className="detail-main">
        <div className="detail-grid">
          {/* Product Image */}
          <div className="detail-image-section">
            <div className="detail-image">
              {currentImage ? (
                <img src={currentImage} alt={product.sync_product.name} />
              ) : (
                <div className="detail-placeholder">No Image</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="detail-info">
            <h1 className="detail-name">{product.sync_product.name}</h1>

            {selectedVariant && (
              <div className="detail-price">
                ${parseFloat(selectedVariant.retail_price).toFixed(2)}
                <span className="detail-currency">{selectedVariant.currency}</span>
              </div>
            )}

            {/* Variant selector */}
            {variantOptions.length > 1 && (
              <div className="detail-variants">
                <label className="detail-label">Variant</label>
                <select
                  className="detail-select"
                  value={selectedVariant?.id || ''}
                  onChange={e => {
                    const v = variantOptions.find(v => v.id === Number(e.target.value))
                    if (v) setSelectedVariant(v)
                  }}
                >
                  {variantOptions.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} - ${parseFloat(v.retail_price).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div className="detail-quantity">
              <label className="detail-label">Quantity</label>
              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  &minus;
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              className={`add-to-cart-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={!selectedVariant}
            >
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            <div className="detail-description">
              <p>
                High-quality {product.sync_product.name.toLowerCase()} featuring the A2Z Bakerie design.
                Perfect for baking enthusiasts and anyone who loves great pastry.
              </p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`${headerStyles}${detailPageStyles}`}</style>
    </div>
  )
}

const headerStyles = `
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
`

const detailPageStyles = `
  .detail-loading, .detail-error {
    text-align: center;
    padding: 80px 24px;
    color: #5a4638;
    font-size: 1.1rem;
  }
  .detail-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 24px;
  }
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
  }
  .detail-image-section {
    position: sticky;
    top: 24px;
  }
  .detail-image {
    aspect-ratio: 1;
    border-radius: 16px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 16px rgba(61, 43, 31, 0.08);
  }
  .detail-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .detail-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    background: #f0ebe5;
  }
  .detail-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    color: #3D2B1F;
    margin: 0 0 12px;
  }
  .detail-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #C4907C;
    margin-bottom: 24px;
  }
  .detail-currency {
    font-size: 0.85rem;
    font-weight: 400;
    color: #999;
    margin-left: 6px;
  }
  .detail-variants, .detail-quantity {
    margin-bottom: 20px;
  }
  .detail-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #3D2B1F;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .detail-select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid rgba(61, 43, 31, 0.2);
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    color: #3D2B1F;
    background: white;
    cursor: pointer;
    appearance: auto;
  }
  .detail-select:focus {
    outline: none;
    border-color: #C4907C;
  }
  .qty-controls {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .qty-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid rgba(61, 43, 31, 0.2);
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #3D2B1F;
    transition: background 0.2s;
  }
  .qty-btn:hover {
    background: #f0ebe5;
  }
  .qty-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #3D2B1F;
    min-width: 32px;
    text-align: center;
  }
  .add-to-cart-btn {
    width: 100%;
    padding: 16px;
    background: #3D2B1F;
    color: white;
    border: none;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 24px;
    transition: background 0.2s;
  }
  .add-to-cart-btn:hover {
    background: #5a4638;
  }
  .add-to-cart-btn.added {
    background: #C4907C;
  }
  .add-to-cart-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  .detail-description {
    color: #5a4638;
    line-height: 1.6;
    font-size: 0.95rem;
  }
  @media (max-width: 768px) {
    .detail-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .detail-image-section {
      position: static;
    }
    .detail-name {
      font-size: 1.6rem;
    }
  }
`
