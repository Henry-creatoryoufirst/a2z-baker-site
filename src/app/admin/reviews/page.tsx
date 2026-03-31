'use client'

import { useEffect, useState } from 'react'
import { Star, Trash2, MessageSquareQuote, TrendingUp, Filter, X } from 'lucide-react'
import type { Review } from '@/lib/types'
import PageHeader from '@/components/admin/PageHeader'
import StarRating from '@/components/admin/StarRating'

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchReviews() {
    const res = await fetch('/api/reviews')
    const data = await res.json()
    setReviews(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  async function deleteReview(id: string) {
    setDeleting(true)
    await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
    setDeleteConfirm(null)
    setDeleting(false)
    fetchReviews()
  }

  const filtered = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const now = new Date()
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const thisMonth = reviews.filter(r => new Date(r.created_at) > monthAgo).length

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: reviews.filter(rev => rev.rating === r).length,
    pct: reviews.length > 0 ? Math.round((reviews.filter(rev => rev.rating === r).length / reviews.length) * 100) : 0,
  }))

  function relativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Reviews" subtitle="Loading..." />
        <div className="loading-grid">
          {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
        </div>
        <style jsx>{`
          .loading-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
          .skeleton-card { height: 120px; background: linear-gradient(90deg, #f0ebe5 25%, #e8e2db 50%, #f0ebe5 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 12px; }
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </div>
    )
  }

  return (
    <div className="reviews-admin">
      <PageHeader
        title="Reviews"
        subtitle={`${reviews.length} total reviews`}
      />

      {/* Stats Overview */}
      <div className="stats-row">
        <div className="review-stat">
          <div className="stat-icon star-icon">
            <Star size={20} />
          </div>
          <div>
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
        <div className="review-stat">
          <div className="stat-icon msg-icon">
            <MessageSquareQuote size={20} />
          </div>
          <div>
            <div className="stat-value">{reviews.length}</div>
            <div className="stat-label">Total Reviews</div>
          </div>
        </div>
        <div className="review-stat">
          <div className="stat-icon trend-icon">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value">{thisMonth}</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="distribution-card">
        <h3>Rating Distribution</h3>
        <div className="distribution-bars">
          {ratingCounts.map(({ rating, count, pct }) => (
            <button
              key={rating}
              className={`dist-row ${filterRating === rating ? 'active' : ''}`}
              onClick={() => setFilterRating(filterRating === rating ? null : rating)}
            >
              <span className="dist-label">{rating} star{rating !== 1 ? 's' : ''}</span>
              <div className="dist-bar-bg">
                <div className="dist-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="dist-count">{count}</span>
            </button>
          ))}
        </div>
        {filterRating && (
          <button className="clear-filter" onClick={() => setFilterRating(null)}>
            <X size={14} /> Clear filter
          </button>
        )}
      </div>

      {/* Filter indicator */}
      {filterRating && (
        <div className="filter-badge">
          <Filter size={14} />
          Showing {filtered.length} review{filtered.length !== 1 ? 's' : ''} with {filterRating} star{filterRating !== 1 ? 's' : ''}
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <MessageSquareQuote size={48} strokeWidth={1} />
            <h3>No reviews {filterRating ? `with ${filterRating} stars` : 'yet'}</h3>
            <p>{filterRating ? 'Try a different filter' : 'Reviews will appear here when customers leave feedback'}</p>
          </div>
        ) : (
          filtered.map((review, i) => (
            <div
              key={review.id}
              className="review-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="review-header">
                <div className="review-avatar">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div className="review-meta">
                  <strong>{review.name}</strong>
                  <span className="review-time">{relativeTime(review.created_at)}</span>
                </div>
                <div className="review-rating">
                  <StarRating rating={review.rating} size={16} />
                </div>
              </div>

              <div className="review-body">
                <span className="quote-mark">&ldquo;</span>
                <p>{review.message}</p>
              </div>

              <div className="review-actions">
                {deleteConfirm === review.id ? (
                  <div className="delete-confirm">
                    <span>Delete this review?</span>
                    <button onClick={() => deleteReview(review.id)} disabled={deleting} className="btn-yes">
                      {deleting ? 'Deleting...' : 'Yes, delete'}
                    </button>
                    <button onClick={() => setDeleteConfirm(null)} className="btn-no">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(review.id)} className="btn-delete">
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .reviews-admin { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .review-stat {
          background: white;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(61,43,31,0.04);
          border: 1px solid rgba(61,43,31,0.06);
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .star-icon { background: rgba(201,169,110,0.12); color: #C9A96E; }
        .msg-icon { background: rgba(196,144,124,0.12); color: #C4907C; }
        .trend-icon { background: rgba(16,185,129,0.12); color: #10b981; }
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #3D2B1F;
          line-height: 1;
        }
        .stat-label { font-size: 0.8rem; color: #5a4638; margin-top: 2px; }

        .distribution-card {
          background: white;
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(61,43,31,0.04);
          border: 1px solid rgba(61,43,31,0.06);
        }
        .distribution-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: #3D2B1F;
          margin-bottom: 16px;
        }
        .distribution-bars { display: flex; flex-direction: column; gap: 8px; }
        .dist-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 8px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .dist-row:hover { background: #FBF7F2; }
        .dist-row.active { background: rgba(196,144,124,0.08); }
        .dist-label { font-size: 0.8rem; color: #5a4638; width: 56px; text-align: right; }
        .dist-bar-bg {
          flex: 1;
          height: 8px;
          background: #f0ebe5;
          border-radius: 4px;
          overflow: hidden;
        }
        .dist-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A96E, #C4907C);
          border-radius: 4px;
          transition: width 0.6s ease;
        }
        .dist-count { font-size: 0.8rem; color: #3D2B1F; font-weight: 600; width: 24px; }
        .clear-filter {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 12px;
          padding: 4px 10px;
          border: none;
          background: rgba(196,144,124,0.1);
          color: #C4907C;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }

        .filter-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(196,144,124,0.08);
          border: 1px solid rgba(196,144,124,0.2);
          border-radius: 20px;
          font-size: 0.8rem;
          color: #C4907C;
          margin-bottom: 16px;
        }

        .reviews-list { display: flex; flex-direction: column; gap: 12px; }
        .review-card {
          background: white;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(61,43,31,0.04);
          border: 1px solid rgba(61,43,31,0.06);
          animation: cardIn 0.4s ease forwards;
          opacity: 0;
          transition: box-shadow 0.2s;
        }
        .review-card:hover { box-shadow: 0 4px 16px rgba(61,43,31,0.08); }

        .review-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .review-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C4907C, #C9A96E);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        .review-meta { flex: 1; }
        .review-meta strong { display: block; font-size: 0.95rem; color: #3D2B1F; }
        .review-time { font-size: 0.8rem; color: #999; }

        .review-body {
          position: relative;
          padding-left: 20px;
          margin-bottom: 16px;
        }
        .quote-mark {
          position: absolute;
          left: 0;
          top: -8px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          color: rgba(196,144,124,0.25);
          line-height: 1;
        }
        .review-body p {
          font-size: 0.95rem;
          color: #5a4638;
          line-height: 1.7;
          font-style: italic;
        }

        .review-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 12px;
          border-top: 1px solid rgba(61,43,31,0.04);
        }
        .btn-delete {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border: 1px solid rgba(239,68,68,0.15);
          background: transparent;
          color: #ef4444;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: all 0.2s;
        }
        .btn-delete:hover { background: #fef2f2; border-color: rgba(239,68,68,0.3); }

        .delete-confirm {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #5a4638;
        }
        .btn-yes {
          padding: 6px 14px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }
        .btn-yes:disabled { opacity: 0.6; }
        .btn-no {
          padding: 6px 14px;
          background: #f5f0eb;
          color: #5a4638;
          border: none;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }

        .empty-state {
          text-align: center;
          padding: 60px 24px;
          color: #999;
          background: white;
          border-radius: 14px;
          border: 1px solid rgba(61,43,31,0.06);
        }
        .empty-state h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          color: #3D2B1F;
          margin: 16px 0 8px;
        }
        .empty-state p { font-size: 0.9rem; }

        @media (max-width: 768px) {
          .stats-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
