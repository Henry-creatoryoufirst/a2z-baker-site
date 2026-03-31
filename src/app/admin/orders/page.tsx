'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, Download, ChevronDown, ChevronUp, CalendarDays, Phone, AlertTriangle, FileText, Save } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import StatusPill from '@/components/admin/StatusPill'
import type { Order } from '@/lib/types'

const TABS = ['all', 'new', 'confirmed', 'completed', 'cancelled'] as const
type TabValue = (typeof TABS)[number]

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
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks === 1) return '1 week ago'
  if (weeks < 4) return `${weeks} weeks ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const [savingNotes, setSavingNotes] = useState<Record<string, boolean>>({})
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      setOrders([])
    }
    setLoading(false)
    setTimeout(() => setMounted(true), 50)
  }

  useEffect(() => { fetchOrders() }, [])

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(null), 2500)
    return () => clearTimeout(t)
  }, [toastMsg])

  async function updateOrder(id: string, updates: Partial<Order>) {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
    fetchOrders()
  }

  async function saveNotes(id: string) {
    const value = noteDrafts[id]
    if (value === undefined) return
    setSavingNotes(prev => ({ ...prev, [id]: true }))
    await updateOrder(id, { admin_notes: value } as Partial<Order>)
    setSavingNotes(prev => ({ ...prev, [id]: false }))
    setNoteDrafts(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setToastMsg('Notes saved')
  }

  // Counts per status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length, new: 0, confirmed: 0, completed: 0, cancelled: 0 }
    for (const o of orders) {
      if (counts[o.status] !== undefined) counts[o.status]++
    }
    return counts
  }, [orders])

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let list = orders
    if (activeTab !== 'all') {
      list = list.filter(o => o.status === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q)
      )
    }
    return list
  }, [orders, activeTab, searchQuery])

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="skel-header" />
        <div className="skel-tabs" />
        <div className="skel-search" />
        <div className="skel-cards">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="skel-card" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
        <style jsx>{`
          .loading-wrap { padding: 0; }
          .skel-header { height: 48px; width: 200px; border-radius: 10px; background: linear-gradient(90deg, #f3ebe4 25%, #efe5db 50%, #f3ebe4 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; margin-bottom: 24px; }
          .skel-tabs { height: 44px; border-radius: 10px; background: linear-gradient(90deg, #f3ebe4 25%, #efe5db 50%, #f3ebe4 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; margin-bottom: 16px; }
          .skel-search { height: 48px; border-radius: 10px; background: linear-gradient(90deg, #f3ebe4 25%, #efe5db 50%, #f3ebe4 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; margin-bottom: 24px; }
          .skel-cards { display: flex; flex-direction: column; gap: 14px; }
          .skel-card { height: 100px; border-radius: 14px; background: linear-gradient(90deg, #f3ebe4 25%, #efe5db 50%, #f3ebe4 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; }
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} total order${orders.length !== 1 ? 's' : ''}`}
        actions={
          <button className="export-btn" onClick={() => setToastMsg('CSV export coming soon!')}>
            <Download size={16} />
            Export CSV
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="tabs-bar">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="tab-count">{statusCounts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-wrap">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Order Cards */}
      <div className="order-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FileText size={40} strokeWidth={1.2} />
            </div>
            <h3>No orders found</h3>
            <p>
              {searchQuery
                ? `No results matching "${searchQuery}"`
                : activeTab !== 'all'
                  ? `No ${activeTab} orders right now`
                  : 'Orders will appear here when customers submit the order form.'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order, i) => {
            const isExpanded = expandedId === order.id
            const noteValue = noteDrafts[order.id] ?? order.admin_notes ?? ''
            const noteChanged = noteDrafts[order.id] !== undefined && noteDrafts[order.id] !== (order.admin_notes ?? '')

            return (
              <div
                key={order.id}
                className={`order-card ${mounted ? 'visible' : ''}`}
                style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
              >
                {/* Card Header */}
                <div className="card-top">
                  <div className="card-left">
                    <h3 className="customer-name">{order.name}</h3>
                    <p className="customer-email">{order.email}</p>
                    <p className="order-preview">
                      {order.order_details.substring(0, 80)}
                      {order.order_details.length > 80 ? '...' : ''}
                    </p>
                  </div>
                  <div className="card-right">
                    {order.date_needed && (
                      <span className="date-badge">
                        <CalendarDays size={13} />
                        {new Date(order.date_needed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    <StatusPill
                      status={order.status}
                      onChange={(status) => updateOrder(order.id, { status: status as Order['status'] })}
                    />
                    <span className="created-time">{relativeTime(order.created_at)}</span>
                  </div>
                </div>

                {/* Expand Toggle */}
                <button
                  className="expand-btn"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="details-panel">
                    <div className="details-grid">
                      <div className="detail-block full-width">
                        <label>
                          <FileText size={13} />
                          Order Details
                        </label>
                        <p>{order.order_details}</p>
                      </div>
                      {order.phone && (
                        <div className="detail-block">
                          <label>
                            <Phone size={13} />
                            Phone
                          </label>
                          <p>{order.phone}</p>
                        </div>
                      )}
                      {order.date_needed && (
                        <div className="detail-block">
                          <label>
                            <CalendarDays size={13} />
                            Date Needed
                          </label>
                          <p>{new Date(order.date_needed).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      )}
                      {order.allergies && (
                        <div className="detail-block full-width">
                          <label>
                            <AlertTriangle size={13} />
                            Allergies / Special Requests
                          </label>
                          <p className="allergy-text">{order.allergies}</p>
                        </div>
                      )}
                    </div>
                    <div className="notes-section">
                      <label>Admin Notes</label>
                      <textarea
                        value={noteValue}
                        placeholder="Add private notes about this order..."
                        onChange={e => setNoteDrafts(prev => ({ ...prev, [order.id]: e.target.value }))}
                      />
                      <button
                        className={`save-notes-btn ${noteChanged ? 'changed' : ''}`}
                        disabled={!noteChanged || savingNotes[order.id]}
                        onClick={() => saveNotes(order.id)}
                      >
                        <Save size={14} />
                        {savingNotes[order.id] ? 'Saving...' : 'Save Notes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Toast */}
      {toastMsg && <div className="toast">{toastMsg}</div>}

      <style jsx>{`
        .orders-page { position: relative; }

        /* Export Button */
        .export-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid rgba(61, 43, 31, 0.15);
          border-radius: 8px;
          background: white;
          color: #3D2B1F;
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .export-btn:hover {
          border-color: rgba(61, 43, 31, 0.3);
          box-shadow: 0 2px 8px rgba(61, 43, 31, 0.08);
        }

        /* Filter Tabs */
        .tabs-bar {
          display: flex;
          gap: 0;
          border-bottom: 2px solid rgba(61, 43, 31, 0.06);
          margin-bottom: 16px;
          margin-top: 4px;
          overflow-x: auto;
        }
        .tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border: none;
          background: none;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          color: #8b7355;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .tab:hover { color: #3D2B1F; }
        .tab.active {
          color: #e11d48;
          font-weight: 600;
        }
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e11d48;
          border-radius: 2px 2px 0 0;
        }
        .tab-count {
          font-size: 0.72rem;
          font-weight: 600;
          background: rgba(61, 43, 31, 0.06);
          padding: 1px 7px;
          border-radius: 10px;
          color: inherit;
        }
        .tab.active .tab-count {
          background: #fef2f2;
          color: #e11d48;
        }

        /* Search */
        .search-wrap {
          position: relative;
          margin-bottom: 24px;
        }
        .search-wrap :global(.search-icon) {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #b0a090;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border: 1px solid rgba(61, 43, 31, 0.12);
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          color: #3D2B1F;
          background: white;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .search-input::placeholder { color: #c0b0a0; }
        .search-input:focus {
          outline: none;
          border-color: #e11d48;
          box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.08);
        }

        /* Order List */
        .order-list { display: flex; flex-direction: column; gap: 14px; }

        /* Card Animation */
        .order-card {
          opacity: 0;
          transform: translateY(12px);
          animation: fadeUp 0.4s ease forwards;
          animation-play-state: paused;
          background: white;
          border-radius: 14px;
          box-shadow: 0 2px 14px rgba(61, 43, 31, 0.05);
          border: 1px solid rgba(61, 43, 31, 0.04);
          overflow: hidden;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .order-card:hover {
          box-shadow: 0 4px 20px rgba(61, 43, 31, 0.08);
          border-color: rgba(61, 43, 31, 0.1);
        }
        .order-card.visible { animation-play-state: running; }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Card Top */
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 24px 12px;
          gap: 16px;
        }
        .card-left { flex: 1; min-width: 0; }
        .customer-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #3D2B1F;
          margin: 0 0 2px;
        }
        .customer-email {
          font-size: 0.82rem;
          color: #8b7355;
          margin: 0 0 6px;
        }
        .order-preview {
          font-size: 0.85rem;
          color: #6b5b4d;
          margin: 0;
          line-height: 1.45;
        }
        .card-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .date-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: #eff6ff;
          color: #1e40af;
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .created-time {
          font-size: 0.78rem;
          color: #b0a090;
          white-space: nowrap;
        }

        /* Expand Button */
        .expand-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          padding: 10px 24px;
          border: none;
          border-top: 1px solid rgba(61, 43, 31, 0.05);
          background: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          color: #8b7355;
          transition: all 0.2s;
        }
        .expand-btn:hover {
          background: #FBF7F2;
          color: #3D2B1F;
        }

        /* Details Panel */
        .details-panel {
          padding: 0 24px 24px;
          animation: slideDown 0.25s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding-top: 8px;
        }
        .detail-block.full-width { grid-column: 1 / -1; }
        .detail-block label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #C4907C;
          margin-bottom: 6px;
        }
        .detail-block p {
          font-size: 0.88rem;
          color: #3D2B1F;
          line-height: 1.55;
          margin: 0;
        }
        .allergy-text {
          background: #fef3c7;
          padding: 8px 12px;
          border-radius: 8px;
          border-left: 3px solid #d97706;
          font-size: 0.88rem;
          color: #92400e;
        }

        /* Notes Section */
        .notes-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(61, 43, 31, 0.06);
        }
        .notes-section label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #C4907C;
          margin-bottom: 6px;
        }
        .notes-section textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid rgba(61, 43, 31, 0.12);
          border-radius: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          color: #3D2B1F;
          background: #FBF7F2;
          resize: vertical;
          min-height: 72px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .notes-section textarea:focus {
          outline: none;
          border-color: #C4907C;
          box-shadow: 0 0 0 3px rgba(196, 144, 124, 0.1);
        }
        .save-notes-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 8px;
          padding: 7px 16px;
          border: 1px solid rgba(61, 43, 31, 0.12);
          border-radius: 7px;
          background: white;
          color: #8b7355;
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          opacity: 0.5;
        }
        .save-notes-btn.changed {
          opacity: 1;
          border-color: #059669;
          color: #059669;
          background: #ecfdf5;
        }
        .save-notes-btn.changed:hover {
          background: #d1fae5;
        }
        .save-notes-btn:disabled {
          cursor: not-allowed;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 56px 24px;
          background: white;
          border-radius: 14px;
          box-shadow: 0 2px 14px rgba(61, 43, 31, 0.05);
        }
        .empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #FBF7F2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #C4907C;
        }
        .empty-state h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          color: #3D2B1F;
          margin: 0 0 6px;
        }
        .empty-state p {
          font-size: 0.88rem;
          color: #8b7355;
          margin: 0;
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

        @media (max-width: 768px) {
          .card-top { flex-direction: column; }
          .card-right { align-self: flex-start; flex-wrap: wrap; }
          .details-grid { grid-template-columns: 1fr; }
          .tabs-bar { gap: 0; }
          .tab { padding: 10px 12px; font-size: 0.82rem; }
        }
      `}</style>
    </div>
  )
}
