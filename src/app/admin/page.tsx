'use client'

import { useEffect, useState } from 'react'
import type { Order, Review } from '@/lib/types'

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/reviews').then(r => r.json()),
    ]).then(([ordersData, reviewsData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setReviews(Array.isArray(reviewsData) ? reviewsData : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const newOrders = orders.filter(o => new Date(o.created_at) > weekAgo)
  const pendingOrders = orders.filter(o => o.status === 'new')

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-subtitle">Welcome back! Here&apos;s what&apos;s happening with A2Z Bakerie.</p>

      <div className="admin-stats-grid">
        <StatCard label="New Orders (This Week)" value={newOrders.length} color="#C4907C" />
        <StatCard label="Pending Orders" value={pendingOrders.length} color="#C9A96E" />
        <StatCard label="Total Reviews" value={reviews.length} color="#5a4638" />
        <StatCard label="Total Orders" value={orders.length} color="#3D2B1F" />
      </div>

      <div className="admin-dashboard-sections">
        <div className="admin-card">
          <h3>Recent Orders</h3>
          {pendingOrders.length === 0 ? (
            <p className="admin-empty">No pending orders</p>
          ) : (
            <div className="admin-list">
              {pendingOrders.slice(0, 5).map(order => (
                <div key={order.id} className="admin-list-item">
                  <div>
                    <strong>{order.name}</strong>
                    <span className="admin-list-detail">{order.order_details.substring(0, 60)}...</span>
                  </div>
                  <span className="admin-badge badge-new">New</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card">
          <h3>Recent Reviews</h3>
          {reviews.length === 0 ? (
            <p className="admin-empty">No reviews yet</p>
          ) : (
            <div className="admin-list">
              {reviews.slice(0, 5).map(review => (
                <div key={review.id} className="admin-list-item">
                  <div>
                    <strong>{review.name}</strong>
                    <span className="admin-list-detail">{'⭐'.repeat(review.rating)} — {review.message.substring(0, 50)}...</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #3D2B1F;
          margin-bottom: 4px;
        }
        .admin-page-subtitle {
          color: #5a4638;
          margin-bottom: 32px;
          font-size: 0.95rem;
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        .admin-dashboard-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .admin-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(61, 43, 31, 0.06);
        }
        .admin-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          color: #3D2B1F;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(61, 43, 31, 0.08);
        }
        .admin-empty {
          color: #999;
          font-size: 0.9rem;
          text-align: center;
          padding: 20px;
        }
        .admin-list { display: flex; flex-direction: column; gap: 12px; }
        .admin-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #FBF7F2;
          border-radius: 8px;
        }
        .admin-list-item strong {
          display: block;
          font-size: 0.95rem;
          color: #3D2B1F;
        }
        .admin-list-detail {
          display: block;
          font-size: 0.85rem;
          color: #5a4638;
          margin-top: 2px;
        }
        .admin-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .badge-new { background: #fef3c7; color: #92400e; }
        .admin-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #5a4638;
          font-size: 1.1rem;
        }
        @media (max-width: 768px) {
          .admin-dashboard-sections {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 12px rgba(61, 43, 31, 0.06)',
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ fontSize: '2rem', fontWeight: 700, color, fontFamily: "'Outfit', sans-serif" }}>
        {value}
      </div>
      <div style={{ fontSize: '0.85rem', color: '#5a4638', marginTop: '4px' }}>
        {label}
      </div>
    </div>
  )
}
