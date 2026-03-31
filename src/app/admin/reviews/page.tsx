'use client'

import { useEffect, useState } from 'react'
import type { Review } from '@/lib/types'

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchReviews() {
    const res = await fetch('/api/reviews')
    const data = await res.json()
    setReviews(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  async function deleteReview(id: string) {
    if (!confirm('Delete this review? This cannot be undone.')) return
    await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
    fetchReviews()
  }

  if (loading) return <div className="admin-loading">Loading reviews...</div>

  return (
    <div>
      <h1 className="admin-page-title">Reviews</h1>
      <p className="admin-page-subtitle">{reviews.length} total reviews</p>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="admin-empty-state">No reviews yet.</div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card-admin">
              <div className="review-top">
                <div>
                  <strong>{review.name}</strong>
                  <span className="review-stars">{'⭐'.repeat(review.rating)}</span>
                </div>
                <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <p className="review-message">{review.message}</p>
              <div className="review-actions-admin">
                <button onClick={() => deleteReview(review.id)} className="btn-delete">
                  Delete
                </button>
              </div>
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
        .reviews-list { display: flex; flex-direction: column; gap: 12px; }
        .review-card-admin {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 12px rgba(61,43,31,0.06);
        }
        .review-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .review-top strong {
          color: #3D2B1F;
          margin-right: 8px;
        }
        .review-stars { font-size: 0.9rem; }
        .review-date { color: #999; font-size: 0.8rem; }
        .review-message {
          color: #5a4638;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .review-actions-admin {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .btn-delete {
          padding: 6px 14px;
          border: 1px solid #fee2e2;
          background: #fef2f2;
          color: #991b1b;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: all 0.2s;
        }
        .btn-delete:hover { background: #fee2e2; }
        .admin-empty-state {
          text-align: center;
          padding: 48px;
          color: #999;
          background: white;
          border-radius: 12px;
        }
        .admin-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #5a4638;
        }
      `}</style>
    </div>
  )
}
