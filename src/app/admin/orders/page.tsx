'use client'

import { useEffect, useState } from 'react'
import type { Order } from '@/lib/types'

const STATUS_OPTIONS = ['new', 'confirmed', 'completed', 'cancelled'] as const
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new: { bg: '#fef3c7', color: '#92400e' },
  confirmed: { bg: '#dbeafe', color: '#1e40af' },
  completed: { bg: '#d1fae5', color: '#065f46' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function fetchOrders() {
    const res = await fetch('/api/orders')
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  async function updateOrder(id: string, updates: Partial<Order>) {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
    fetchOrders()
  }

  if (loading) return <div className="admin-loading">Loading orders...</div>

  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      <p className="admin-page-subtitle">{orders.length} total orders</p>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="admin-empty-state">No orders yet. They&apos;ll appear here when customers submit the order form.</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                <div className="order-info">
                  <strong>{order.name}</strong>
                  <span className="order-email">{order.email}</span>
                  <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="order-actions">
                  <span
                    className="order-status"
                    style={{
                      background: STATUS_COLORS[order.status]?.bg,
                      color: STATUS_COLORS[order.status]?.color,
                    }}
                  >
                    {order.status}
                  </span>
                  <span className="order-expand">{expandedId === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedId === order.id && (
                <div className="order-details">
                  <div className="order-detail-grid">
                    <div>
                      <label>Order Details</label>
                      <p>{order.order_details}</p>
                    </div>
                    {order.date_needed && (
                      <div>
                        <label>Date Needed</label>
                        <p>{new Date(order.date_needed).toLocaleDateString()}</p>
                      </div>
                    )}
                    {order.phone && (
                      <div>
                        <label>Phone</label>
                        <p>{order.phone}</p>
                      </div>
                    )}
                    {order.allergies && (
                      <div>
                        <label>Allergies / Special Requests</label>
                        <p>{order.allergies}</p>
                      </div>
                    )}
                  </div>

                  <div className="order-controls">
                    <div>
                      <label>Status</label>
                      <select
                        value={order.status}
                        onChange={e => updateOrder(order.id, { status: e.target.value as Order['status'] })}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="order-notes-group">
                      <label>Admin Notes</label>
                      <textarea
                        defaultValue={order.admin_notes || ''}
                        placeholder="Add notes..."
                        onBlur={e => {
                          if (e.target.value !== (order.admin_notes || '')) {
                            updateOrder(order.id, { admin_notes: e.target.value } as Partial<Order>)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
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
          margin-bottom: 24px;
          font-size: 0.95rem;
        }
        .orders-list { display: flex; flex-direction: column; gap: 12px; }
        .order-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(61,43,31,0.06);
          overflow: hidden;
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .order-header:hover { background: #FBF7F2; }
        .order-info { display: flex; align-items: center; gap: 16px; }
        .order-info strong { color: #3D2B1F; font-size: 1rem; }
        .order-email { color: #5a4638; font-size: 0.85rem; }
        .order-date { color: #999; font-size: 0.8rem; }
        .order-actions { display: flex; align-items: center; gap: 12px; }
        .order-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .order-expand { color: #999; font-size: 0.8rem; }
        .order-details {
          padding: 0 20px 20px;
          border-top: 1px solid rgba(61,43,31,0.06);
        }
        .order-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding-top: 16px;
        }
        .order-detail-grid label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #C4907C;
          display: block;
          margin-bottom: 4px;
        }
        .order-detail-grid p {
          font-size: 0.9rem;
          color: #3D2B1F;
          line-height: 1.5;
        }
        .order-controls {
          display: flex;
          gap: 16px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(61,43,31,0.06);
        }
        .order-controls label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #C4907C;
          display: block;
          margin-bottom: 4px;
        }
        .order-controls select {
          padding: 8px 12px;
          border: 1px solid rgba(61,43,31,0.15);
          border-radius: 6px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          background: #FBF7F2;
          color: #3D2B1F;
        }
        .order-notes-group { flex: 1; }
        .order-notes-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid rgba(61,43,31,0.15);
          border-radius: 6px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          background: #FBF7F2;
          color: #3D2B1F;
          resize: vertical;
          min-height: 60px;
        }
        .admin-empty-state {
          text-align: center;
          padding: 48px;
          color: #999;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(61,43,31,0.06);
        }
        .admin-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #5a4638;
        }
        @media (max-width: 768px) {
          .order-info { flex-direction: column; align-items: flex-start; gap: 4px; }
          .order-detail-grid { grid-template-columns: 1fr; }
          .order-controls { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}
