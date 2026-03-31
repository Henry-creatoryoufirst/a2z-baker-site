'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📋' },
  { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: '🔄' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <div className="admin-layout">
      {/* Mobile header */}
      <div className="admin-mobile-header">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="admin-hamburger">
          ☰
        </button>
        <span className="admin-mobile-title">A2Z Admin</span>
      </div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/images/logo.png" alt="A2Z Bakerie" className="admin-sidebar-logo" />
          <h2>A2Z Admin</h2>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-item" target="_blank">
            🌐 View Site
          </Link>
          <button onClick={handleLogout} className="admin-logout-btn">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="admin-main">
        {children}
      </main>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8f5f1;
        }
        .admin-sidebar {
          width: 260px;
          background: #3D2B1F;
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 100;
          transition: transform 0.3s ease;
        }
        .admin-sidebar-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-sidebar-logo {
          height: 40px;
          width: auto;
          filter: brightness(0) invert(1);
        }
        .admin-sidebar-header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 600;
        }
        .admin-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s;
        }
        .admin-nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .admin-nav-item.active {
          background: rgba(196, 144, 124, 0.3);
          color: white;
        }
        .admin-nav-icon { font-size: 1.1rem; }
        .admin-sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-family: inherit;
          transition: all 0.2s;
        }
        .admin-logout-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .admin-main {
          flex: 1;
          margin-left: 260px;
          padding: 32px;
          min-height: 100vh;
        }
        .admin-mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: #3D2B1F;
          color: white;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
          z-index: 99;
        }
        .admin-hamburger {
          background: none;
          border: none;
          color: white;
          font-size: 1.4rem;
          cursor: pointer;
          padding: 4px;
        }
        .admin-mobile-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
        }
        .admin-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 99;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-main {
            margin-left: 0;
            padding: 72px 16px 16px;
          }
          .admin-mobile-header {
            display: flex;
          }
          .admin-overlay {
            display: block;
          }
        }
      `}</style>
    </div>
  )
}
