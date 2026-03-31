'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'

export default function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotal, itemCount } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={toggleCart} />

      {/* Sidebar */}
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Your Cart ({itemCount})</h2>
          <button className="cart-close" onClick={toggleCart} aria-label="Close cart">
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <button className="cart-continue" onClick={toggleCart}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.variantId} className="cart-item">
                  <div className="cart-item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} />
                    ) : (
                      <div className="cart-item-placeholder" />
                    )}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.productName}</div>
                    <div className="cart-item-variant">{item.variantName}</div>
                    <div className="cart-item-price">${item.price.toFixed(2)}</div>
                    <div className="cart-item-qty">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      >
                        &minus;
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(item.variantId)}
                    aria-label="Remove item"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <Link href="/shop/checkout" className="cart-checkout-btn" onClick={toggleCart}>
                Checkout
              </Link>
            </div>
          </>
        )}

        <style jsx>{`
          .cart-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 998;
          }
          .cart-sidebar {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 400px;
            max-width: 90vw;
            background: #FBF7F2;
            z-index: 999;
            display: flex;
            flex-direction: column;
            box-shadow: -4px 0 24px rgba(61, 43, 31, 0.15);
            animation: slideIn 0.3s ease;
          }
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(61, 43, 31, 0.1);
          }
          .cart-header h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.4rem;
            color: #3D2B1F;
            margin: 0;
          }
          .cart-close {
            background: none;
            border: none;
            font-size: 1.8rem;
            color: #3D2B1F;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
          }
          .cart-empty {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            color: #5a4638;
          }
          .cart-continue {
            padding: 10px 24px;
            background: #C4907C;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Outfit', sans-serif;
            font-size: 0.95rem;
          }
          .cart-continue:hover {
            background: #b07d6a;
          }
          .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 16px 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .cart-item {
            display: flex;
            gap: 12px;
            background: white;
            border-radius: 10px;
            padding: 12px;
            position: relative;
          }
          .cart-item-image {
            width: 72px;
            height: 72px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
            background: #f0ebe5;
          }
          .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .cart-item-placeholder {
            width: 100%;
            height: 100%;
            background: #e8e0d8;
          }
          .cart-item-info {
            flex: 1;
            min-width: 0;
          }
          .cart-item-name {
            font-weight: 600;
            font-size: 0.9rem;
            color: #3D2B1F;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .cart-item-variant {
            font-size: 0.8rem;
            color: #5a4638;
            margin-top: 2px;
          }
          .cart-item-price {
            font-size: 0.9rem;
            color: #C4907C;
            font-weight: 600;
            margin-top: 4px;
          }
          .cart-item-qty {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 6px;
          }
          .qty-btn {
            width: 26px;
            height: 26px;
            border-radius: 6px;
            border: 1px solid rgba(61, 43, 31, 0.2);
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: #3D2B1F;
          }
          .qty-btn:hover {
            background: #f0ebe5;
          }
          .cart-item-remove {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            font-size: 1.2rem;
            color: #999;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
          }
          .cart-item-remove:hover {
            color: #c44;
          }
          .cart-footer {
            padding: 20px 24px;
            border-top: 1px solid rgba(61, 43, 31, 0.1);
          }
          .cart-total {
            display: flex;
            justify-content: space-between;
            font-size: 1.1rem;
            font-weight: 600;
            color: #3D2B1F;
            margin-bottom: 16px;
          }
          .cart-checkout-btn {
            display: block;
            width: 100%;
            padding: 14px;
            background: #3D2B1F;
            color: white;
            text-align: center;
            border-radius: 10px;
            font-family: 'Outfit', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.2s;
          }
          .cart-checkout-btn:hover {
            background: #5a4638;
          }
        `}</style>
      </div>
    </>
  )
}
