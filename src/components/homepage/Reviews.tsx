'use client';

import { useState, useEffect, useCallback } from 'react';
import ScrollReveal from './ScrollReveal';

const SUPABASE_URL = 'https://mtikaozamvbnxoxhzdca.supabase.co';

interface Review {
  id?: number;
  name: string;
  message: string;
  rating: number;
  created_at: string;
}

function escHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getHeaders = useCallback(() => {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
    };
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      const res = await fetch(
        SUPABASE_URL + '/rest/v1/reviews?order=created_at.desc&limit=50',
        { headers: getHeaders() }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (e) {
      console.error('Failed to load reviews', e);
    }
  }, [getHeaders]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await fetch(SUPABASE_URL + '/rest/v1/reviews', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: name.trim(), message: message.trim(), rating: selectedRating }),
      });

      setName('');
      setMessage('');
      setSelectedRating(5);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      loadReviews();
    } catch (e) {
      console.error('Failed to post review', e);
    }
    setSubmitting(false);
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <section className="section reviews-section" id="reviews">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-label">What People Are Saying</span>
            <h2 className="section-title">Love Notes</h2>
            <div className="section-divider"></div>
          </div>
        </ScrollReveal>

        <div className="reviews-grid" id="reviewsGrid">
          {reviews.length === 0 ? (
            <p className="no-reviews" id="noReviews">Be the first to leave a review!</p>
          ) : (
            reviews.map((r, i) => {
              const date = new Date(r.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              return (
                <div className="review-card" key={r.id || i}>
                  <div className="review-stars">{renderStars(r.rating)}</div>
                  <p className="review-message">&ldquo;{r.message}&rdquo;</p>
                  <p className="review-author">{r.name}</p>
                  <p className="review-date">{date}</p>
                </div>
              );
            })
          )}
        </div>

        <ScrollReveal>
          <div className="review-form" id="reviewForm">
            <h3>Leave a Review</h3>
            <div className="star-rating" id="starRating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  data-star={star}
                  className={star <= selectedRating ? 'active' : ''}
                  style={{ color: hoverRating ? (star <= hoverRating ? 'var(--gold)' : '#ddd') : undefined }}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  &#9733;
                </button>
              ))}
            </div>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                id="reviewName"
                placeholder="First name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Your Review</label>
              <textarea
                id="reviewMessage"
                rows={3}
                placeholder="What did you love about your order?"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <button
              className="btn-primary"
              id="submitReview"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Posting...' : 'Post My Review'}
            </button>
            <p
              className="review-success"
              id="reviewSuccess"
              style={{ display: showSuccess ? 'block' : 'none' }}
            >
              Thank you for your kind words!
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
