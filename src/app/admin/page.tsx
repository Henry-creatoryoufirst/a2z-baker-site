'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Clock, Star, Package, Plus, ExternalLink, Download } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import StatusPill from '@/components/admin/StatusPill'
import StarRating from '@/components/admin/StarRating'
import type { Order, Review } from '@/lib/types'

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning', emoji: '\u2600\uFE0F' }
  if (hour < 17) return { text: 'Good afternoon', emoji: '\uD83C\uDF24\uFE0F' }
  return { text: 'Good evening', emoji: '\uD83C\uDF19' }
}

function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks === 1) return '1w ago'
  return `${weeks}w ago`
}

type ActivityItem =
  | { kind: 'order'; data: Order; ts: number }
  | { kind: 'review'; data: Review; ts: number }

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/reviews').then(r => r.json()),
    ]).then(([ordersData, reviewsData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setReviews(Array.isArray(reviewsData) ? reviewsData : [])
      setLoading(false)
      setTimeout(() => setMounted(true), 50)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 2500)
    return () => clearTimeout(t)
  }, [toastMsg])

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const newOrdersThisWeek = orders.filter(o => new Date(o.created_at) > weekAgo)
  const pendingOrders = orders.filter(o => o.status === 'new')
  const greeting = getGreeting()
  const today = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  // Build unified activity feed
  const activity: ActivityItem[] = [
    ...orders.map(o => ({ kind: 'order' as const, data: o, ts: new Date(o.created_at).getTime() })),
    ...reviews.map(r => ({ kind: 'review' as const, data: r, ts: new Date(r.created_at).getTime() })),
  ]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 8)

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="skeleton-greeting" />
        <div className="skeleton-stats">
          {[0, 1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
        </div>
        <div className="skeleton-actions">
          {[0, 1, 2].map(i => <div key={i} className="skeleton-action" />)}
        </div>
        <div className="skeleton-feed" />
        <style jsx>{`
          .loading-wrap { padding: 0; }
          .skeleton-greeting {
            height: 56px; width: 360px; border-radius: 12px;
            background: linear-gradient(90deg, #f3ebe4 25%, #efe5db 50%, #f3ebe4 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s ease-in-out infinite;
            margin-bottom: 32px;
          }
          .skeleton-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
          .skeleton-card {
            height: 120px; border-radius: 14px;
            background: linear-gradient(90deg, #f3ebe4 25%, #efe5db 50%, #f3ebe4 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s ease-in-out infinite;
          }
          .skeleton-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
          .skeleton-action {
            height: 72px; border-radius: 12px;
            background: linear-gradient(90deg, #f3ebe4 25%, #efe5db 50%, #f3ebe4 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s ease-in-out infinite;
          }
          .skeleton-feed {
            height: 400px; border-radius: 14px;
            background: linear-gradient(90deg, #f3ebe4 25%, #efe5db 50%, #f3ebe4 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s ease-in-out infinite;
          }
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          @media (max-width: 768px) {
            .skeleton-stats { grid-template-columns: repeat(2, 1fr); }
            .skeleton-actions { grid-template-columns: 1fr; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Greeting */}
      <div className={`section greeting ${mounted ? 'visible' : ''}`}>
        <h1>{greeting.text}, Ann! {greeting.emoji}</h1>
        <p className="date-line">{today}</p>
      </div>

      {/* Stats Row */}
      <div className={`section stats-row ${mounted ? 'visible' : ''}`} style={{ animationDelay: '60ms' }}>
        <StatCard
          label="New Orders (This Week)"
          value={newOrdersThisWeek.length}
          icon={<ShoppingBag size={22} />}
          color="#e11d48"
          trend={newOrdersThisWeek.length}
        />
        <StatCard
          label="Pending Orders"
          value={pendingOrders.length}
          icon={<Clock size={22} />}
          color="#d97706"
        />
        <StatCard
          label="Total Reviews"
          value={reviews.length}
          icon={<Star size={22} />}
          color="#ca8a04"
        />
        <StatCard
          label="Total Orders (All Time)"
          value={orders.length}
          icon={<Package size={22} />}
          color="#78350f"
        />
      </div>

      {/* Quick Actions */}
      <div className={`section actions-row ${mounted ? 'visible' : ''}`} style={{ animationDelay: '120ms' }}>
        <Link href="/admin/subscriptions" className="action-card">
          <div className="action-icon" style={{ color: '#e11d48' }}><Plus size={20} /></div>
          <span>New Subscription Club</span>
        </Link>
        <a href="https://a2zbakerie.com" target="_blank" rel="noopener noreferrer" className="action-card">
          <div className="action-icon" style={{ color: '#2563eb' }}><ExternalLink size={20} /></div>
          <span>View Live Site</span>
        </a>
        <button className="action-card" onClick={() => setToastMsg('Export coming soon!')}>
          <div className="action-icon" style={{ color: '#059669' }}><Download size={20} /></div>
          <span>Export Orders</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className={`section activity-card ${mounted ? 'visible' : ''}`} style={{ animationDelay: '180ms' }}>
        <h2>Recent Activity</h2>
        {activity.length === 0 ? (
          <p className="empty-text">No activity yet. Orders and reviews will appear here.</p>
        ) : (
          <div className="timeline">
            {activity.map((item, i) => (
              <div key={`${item.kind}-${item.kind === 'order' ? item.data.id : item.data.id}`} className="timeline-item">
                <div className="timeline-dot-col">
                  <div className={`timeline-dot ${item.kind}`}>
                    {item.kind === 'order' ? <ShoppingBag size={14} /> : <Star size={14} />}
                  </div>
                  {i < activity.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <div className="timeline-row">
                    <div className="timeline-info">
                      <span className="timeline-name">{item.data.name}</span>
                      <span className="timeline-desc">
                        {item.kind === 'order'
                          ? (item.data as Order).order_details.substring(0, 60) + ((item.data as Order).order_details.length > 60 ? '...' : '')
                          : (item.data as Review).message.substring(0, 60) + ((item.data as Review).message.length > 60 ? '...' : '')}
                      </span>
                    </div>
                    <div className="timeline-meta">
                      {item.kind === 'order' ? (
                        <StatusPill status={(item.data as Order).status} onChange={() => {}} disabled />
                      ) : (
                        <StarRating rating={(item.data as Review).rating} size={14} />
                      )}
                      <span className="timeline-time">{relativeTime(item.data.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="toast">{toastMsg}</div>
      )}

      <style jsx>{`
        .dashboard { position: relative; }

        /* Fade-up animation */
        .section {
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.5s ease forwards;
          animation-play-state: paused;
        }
        .section.visible { animation-play-state: running; }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Greeting */
        .greeting { margin-bottom: 28px; }
        .greeting h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          color: #3D2B1F;
          margin: 0 0 4px;
          line-height: 1.2;
        }
        .date-line {
          font-size: 0.9rem;
          color: #8b7355;
          margin: 0;
          font-family: 'Outfit', sans-serif;
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        /* Quick Actions */
        .actions-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .action-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: white;
          border: 1px solid rgba(61, 43, 31, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          color: #3D2B1F;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .action-card:hover {
          border-color: rgba(61, 43, 31, 0.25);
          box-shadow: 0 4px 16px rgba(61, 43, 31, 0.08);
          transform: translateY(-1px);
        }
        .action-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FBF7F2;
          flex-shrink: 0;
        }

        /* Activity Card */
        .activity-card {
          background: white;
          border-radius: 14px;
          padding: 28px;
          box-shadow: 0 2px 16px rgba(61, 43, 31, 0.06);
        }
        .activity-card h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #3D2B1F;
          margin: 0 0 20px;
        }
        .empty-text {
          text-align: center;
          color: #a09080;
          padding: 32px 0;
          font-size: 0.9rem;
        }

        /* Timeline */
        .timeline { display: flex; flex-direction: column; }
        .timeline-item {
          display: flex;
          gap: 16px;
          min-height: 64px;
        }
        .timeline-dot-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 32px;
          flex-shrink: 0;
        }
        .timeline-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .timeline-dot.order {
          background: #fff1f2;
          color: #e11d48;
        }
        .timeline-dot.review {
          background: #fefce8;
          color: #ca8a04;
        }
        .timeline-line {
          width: 2px;
          flex: 1;
          background: linear-gradient(to bottom, rgba(61, 43, 31, 0.1), rgba(61, 43, 31, 0.04));
          margin: 4px 0;
        }
        .timeline-content {
          flex: 1;
          padding-bottom: 16px;
          min-width: 0;
        }
        .timeline-item:last-child .timeline-content { padding-bottom: 0; }
        .timeline-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }
        .timeline-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .timeline-name {
          font-weight: 600;
          color: #3D2B1F;
          font-size: 0.92rem;
        }
        .timeline-desc {
          font-size: 0.83rem;
          color: #8b7355;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 400px;
        }
        .timeline-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .timeline-time {
          font-size: 0.78rem;
          color: #b0a090;
          white-space: nowrap;
        }

        /* Toast */
        .toast {
          position: fixed;
          bottom: 28px;
          right: 28px;
          padding: 12px 24px;
          background: #3D2B1F;
          color: #FBF7F2;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          box-shadow: 0 8px 32px rgba(61, 43, 31, 0.25);
          animation: toastIn 0.3s ease;
          z-index: 100;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .stats-row { grid-template-columns: 1fr; }
          .actions-row { grid-template-columns: 1fr; }
          .timeline-desc { max-width: 180px; }
          .timeline-row { flex-direction: column; gap: 8px; }
          .timeline-meta { align-self: flex-start; }
        }
      `}</style>
    </div>
  )
}
