'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  ShoppingBag,
  Star,
  Repeat,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: Repeat },
]

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning', emoji: '\u2600\uFE0F' }
  if (hour < 17) return { text: 'Good afternoon', emoji: '' }
  return { text: 'Good evening', emoji: '\uD83C\uDF19' }
}

function getPageName(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard'
  const segment = pathname.split('/').pop() || ''
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const greeting = getGreeting()
  const pageName = getPageName(pathname)
  const dateStr = mounted ? formatDate() : ''

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/images/logo.png" alt="A2Z Bakerie" className="logo-img" />
          <span className="logo-text">A2Z Bakerie</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-separator" />

        <div className="sidebar-bottom">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-item view-site"
          >
            <ExternalLink size={18} strokeWidth={1.5} />
            <span>View Site</span>
          </Link>

          <div className="user-section">
            <div className="user-avatar">AZ</div>
            <div className="user-info">
              <span className="user-name">Ann Zoller</span>
              <span className="user-role">Admin</span>
            </div>
          </div>

          <button onClick={handleLogout} className="sign-out-btn">
            <LogOut size={17} strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Top bar */}
      <div className="topbar">
        <button
          className="topbar-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="topbar-breadcrumb">{pageName}</div>
        <div className="topbar-right">
          <span className="topbar-greeting">
            {greeting.text} {greeting.emoji}
          </span>
          <span className="topbar-date">{dateStr}</span>
        </div>
      </div>

      {/* Main content */}
      <main className="admin-main">{children}</main>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8f5f1;
        }

        /* ─── Overlay ─── */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 198;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .sidebar-overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }

        /* ─── Sidebar ─── */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #3D2B1F 0%, #2a1d14 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 200;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
        }

        /* ─── Logo ─── */
        .sidebar-logo {
          padding: 28px 24px 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .logo-img {
          height: 38px;
          width: auto;
          filter: brightness(0) invert(1);
          flex-shrink: 0;
        }
        .logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        /* ─── Navigation ─── */
        .sidebar-nav {
          flex: 1;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 18px;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.925rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          border: none;
          background: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }
        .nav-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.06);
        }
        .nav-item.active {
          color: white;
          background: rgba(196, 144, 124, 0.12);
          font-weight: 500;
        }
        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 22px;
          background: #C4907C;
          border-radius: 0 3px 3px 0;
        }

        /* ─── Separator ─── */
        .sidebar-separator {
          height: 1px;
          margin: 0 24px;
          background: rgba(255, 255, 255, 0.08);
        }

        /* ─── Bottom Section ─── */
        .sidebar-bottom {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .view-site {
          margin-bottom: 8px;
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          margin-bottom: 4px;
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #C4907C;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .user-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.3;
        }
        .user-role {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.3;
        }
        .sign-out-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 18px;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.875rem;
          font-family: 'Outfit', sans-serif;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.2s ease;
        }
        .sign-out-btn:hover {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.06);
        }

        /* ─── Top Bar ─── */
        .topbar {
          position: fixed;
          top: 0;
          left: 280px;
          right: 0;
          height: 64px;
          background: white;
          border-bottom: 1px solid rgba(61, 43, 31, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          z-index: 100;
        }
        .topbar-hamburger {
          display: none;
          background: none;
          border: none;
          color: #3D2B1F;
          cursor: pointer;
          padding: 4px;
          margin-right: 12px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .topbar-hamburger:hover {
          background: rgba(61, 43, 31, 0.06);
        }
        .topbar-breadcrumb {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #3D2B1F;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .topbar-greeting {
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          color: #3D2B1F;
          font-weight: 500;
        }
        .topbar-date {
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          color: rgba(61, 43, 31, 0.45);
        }

        /* ─── Main Content ─── */
        .admin-main {
          flex: 1;
          margin-left: 280px;
          margin-top: 64px;
          padding: 32px;
          min-height: calc(100vh - 64px);
        }

        /* ─── Mobile ─── */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .topbar {
            left: 0;
            padding: 0 16px;
          }
          .topbar-hamburger {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .topbar-date {
            display: none;
          }
          .admin-main {
            margin-left: 0;
            margin-top: 64px;
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  )
}
