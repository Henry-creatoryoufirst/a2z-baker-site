'use client'

import { CartProvider } from '@/components/shop/CartProvider'
import CartSidebar from '@/components/shop/CartSidebar'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="shop-layout">
        {children}
        <CartSidebar />
      </div>

      <style jsx>{`
        .shop-layout {
          min-height: 100vh;
          background: #FBF7F2;
          font-family: 'Outfit', sans-serif;
        }
      `}</style>
    </CartProvider>
  )
}
