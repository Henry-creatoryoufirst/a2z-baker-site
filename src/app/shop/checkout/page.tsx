'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/shop/CartProvider'

export default function CheckoutPage() {
  const { items, getTotal, clearCart, toggleCart, itemCount } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    address1: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  function updateField(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (items.length === 0) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            variantId: item.variantId,
            productName: item.productName,
            variantName: item.variantName,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
          shipping: form,
          totalCents: Math.round(getTotal() * 100),
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to place order')
      } else {
        setSuccess(true)
        clearCart()
      }
    } catch {
      setError('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="shop-container">
        <header className="shop-header">
          <div className="shop-header-inner">
            <Link href="/shop" className="shop-back-link">&larr; Back to Shop</Link>
            <span className="shop-title">Checkout</span>
            <div />
          </div>
        </header>
        <main className="checkout-main">
          <div className="success-card">
            <div className="success-icon">&#10003;</div>
            <h2>Order Placed!</h2>
            <p>Thank you for your order. We&apos;ll be in touch once your items ship.</p>
            <p className="success-note">
              Note: Payment integration is coming soon. Your order has been saved and we&apos;ll reach out regarding payment.
            </p>
            <Link href="/shop" className="success-btn">Continue Shopping</Link>
          </div>
        </main>
        <style jsx>{`${allStyles}`}</style>
      </div>
    )
  }

  return (
    <div className="shop-container">
      <header className="shop-header">
        <div className="shop-header-inner">
          <Link href="/shop" className="shop-back-link">&larr; Back to Shop</Link>
          <span className="shop-title">Checkout</span>
          <button className="shop-cart-btn" onClick={toggleCart}>Cart ({itemCount})</button>
        </div>
      </header>

      <main className="checkout-main">
        {items.length === 0 && !success ? (
          <div className="checkout-empty">
            <p>Your cart is empty.</p>
            <Link href="/shop" className="success-btn">Go to Shop</Link>
          </div>
        ) : (
          <div className="checkout-grid">
            {/* Order Summary */}
            <div className="checkout-summary">
              <h2>Order Summary</h2>
              <div className="summary-items">
                {items.map(item => (
                  <div key={item.variantId} className="summary-item">
                    <div className="summary-item-image">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} />
                      ) : (
                        <div className="summary-item-placeholder" />
                      )}
                    </div>
                    <div className="summary-item-info">
                      <div className="summary-item-name">{item.productName}</div>
                      <div className="summary-item-variant">{item.variantName}</div>
                      <div className="summary-item-meta">
                        Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="summary-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Form */}
            <div className="checkout-form-wrapper">
              <h2>Shipping Information</h2>
              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => updateField('name', e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => updateField('email', e.target.value)}
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    required
                    value={form.address1}
                    onChange={e => updateField('address1', e.target.value)}
                    placeholder="123 Baker Street"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={e => updateField('city', e.target.value)}
                      placeholder="Portland"
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      required
                      value={form.state}
                      onChange={e => updateField('state', e.target.value)}
                      placeholder="OR"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={form.zip}
                      onChange={e => updateField('zip', e.target.value)}
                      placeholder="97201"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <select
                      value={form.country}
                      onChange={e => updateField('country', e.target.value)}
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="checkout-note">
                  Stripe payment integration coming soon. Orders are saved for manual processing.
                </div>

                <button
                  type="submit"
                  className="checkout-submit"
                  disabled={submitting || items.length === 0}
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`${allStyles}`}</style>
    </div>
  )
}

const allStyles = `
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
  .shop-back-link:hover { color: white; }
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
  }
  .shop-cart-btn:hover { background: #b07d6a; }
  .checkout-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 24px;
  }
  .checkout-empty {
    text-align: center;
    padding: 80px 0;
    color: #5a4638;
  }
  .checkout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
  }
  .checkout-summary, .checkout-form-wrapper {
    background: white;
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 2px 16px rgba(61, 43, 31, 0.06);
  }
  .checkout-summary h2, .checkout-form-wrapper h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    color: #3D2B1F;
    margin: 0 0 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(61, 43, 31, 0.08);
  }
  .summary-items {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
  }
  .summary-item {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .summary-item-image {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    overflow: hidden;
    background: #f0ebe5;
    flex-shrink: 0;
  }
  .summary-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .summary-item-placeholder {
    width: 100%;
    height: 100%;
    background: #e8e0d8;
  }
  .summary-item-info { flex: 1; min-width: 0; }
  .summary-item-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: #3D2B1F;
  }
  .summary-item-variant {
    font-size: 0.8rem;
    color: #5a4638;
  }
  .summary-item-meta {
    font-size: 0.8rem;
    color: #999;
    margin-top: 2px;
  }
  .summary-item-total {
    font-weight: 600;
    color: #3D2B1F;
    font-size: 0.95rem;
  }
  .summary-total {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: 700;
    color: #3D2B1F;
    padding-top: 16px;
    border-top: 2px solid rgba(61, 43, 31, 0.1);
  }
  .checkout-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .form-group label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #3D2B1F;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .form-group input, .form-group select {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid rgba(61, 43, 31, 0.2);
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    color: #3D2B1F;
    background: white;
    box-sizing: border-box;
  }
  .form-group input:focus, .form-group select:focus {
    outline: none;
    border-color: #C4907C;
    box-shadow: 0 0 0 3px rgba(196, 144, 124, 0.15);
  }
  .form-error {
    background: #fef2f2;
    color: #991b1b;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 0.9rem;
  }
  .checkout-note {
    background: #FBF7F2;
    padding: 14px 16px;
    border-radius: 10px;
    font-size: 0.85rem;
    color: #5a4638;
    border-left: 3px solid #C9A96E;
  }
  .checkout-submit {
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
    transition: background 0.2s;
  }
  .checkout-submit:hover { background: #5a4638; }
  .checkout-submit:disabled { background: #999; cursor: not-allowed; }
  .success-card {
    max-width: 500px;
    margin: 40px auto;
    text-align: center;
    background: white;
    border-radius: 16px;
    padding: 48px 32px;
    box-shadow: 0 2px 16px rgba(61, 43, 31, 0.08);
  }
  .success-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #C4907C;
    color: white;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }
  .success-card h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    color: #3D2B1F;
    margin-bottom: 12px;
  }
  .success-card p {
    color: #5a4638;
    margin-bottom: 8px;
  }
  .success-note {
    font-size: 0.85rem;
    color: #999;
    margin-bottom: 24px;
  }
  .success-btn {
    display: inline-block;
    padding: 12px 32px;
    background: #3D2B1F;
    color: white;
    text-decoration: none;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    transition: background 0.2s;
  }
  .success-btn:hover { background: #5a4638; }
  @media (max-width: 768px) {
    .checkout-grid {
      grid-template-columns: 1fr;
    }
    .form-row {
      grid-template-columns: 1fr;
    }
  }
`
