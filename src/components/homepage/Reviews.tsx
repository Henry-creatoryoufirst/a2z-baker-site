'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ScrollReveal from './ScrollReveal';

const SUPABASE_URL = 'https://mtikaozamvbnxoxhzdca.supabase.co';

interface Review {
  id?: number;
  name: string;
  message: string;
  rating: number;
  created_at: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
      if (Array.isArray(data)) setReviews(data);
    } catch (e) {
      console.error('Failed to load reviews', e);
    }
  }, [getHeaders]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  function updateScrollButtons() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [reviews]);

  function scrollBy(dir: number) {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  }

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await fetch(SUPABASE_URL + '/rest/v1/reviews', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: name.trim(), message: message.trim(), rating: selectedRating }),
      });
      setName(''); setMessage(''); setSelectedRating(5);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      loadReviews();
    } catch (e) {
      console.error('Failed to post review', e);
    }
    setSubmitting(false);
  };

  return (
    <section className="rv-section" id="reviews">
      <div className="rv-container">
        <ScrollReveal>
          <div className="rv-header">
            <span className="rv-label">What People Are Saying</span>
            <h2 className="rv-title">Love Notes</h2>
            <div className="rv-divider" />
          </div>
        </ScrollReveal>

        {/* Horizontal Scroll Reviews */}
        <div className="rv-scroll-wrap">
          {canScrollLeft && (
            <button className="rv-arrow rv-arrow-left" onClick={() => scrollBy(-1)} aria-label="Scroll left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
          )}
          <div className="rv-scroll" ref={scrollRef}>
            {reviews.length === 0 ? (
              <div className="rv-empty-card">
                <p>Be the first to leave a love note!</p>
              </div>
            ) : (
              reviews.map((r, i) => {
                const date = new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <div className="rv-card" key={r.id || i}>
                    <div className="rv-card-stars">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= r.rating ? '#C9A96E' : '#e0d5ca'} stroke="none">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p className="rv-card-quote">&ldquo;{r.message}&rdquo;</p>
                    <div className="rv-card-footer">
                      <div className="rv-card-avatar">{r.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <span className="rv-card-name">{r.name}</span>
                        <span className="rv-card-date">{date}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {canScrollRight && reviews.length > 2 && (
            <button className="rv-arrow rv-arrow-right" onClick={() => scrollBy(1)} aria-label="Scroll right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          )}
        </div>

        {/* Leave a Review Form */}
        <ScrollReveal>
          <div className="rv-form-card">
            <h3>Leave a Love Note</h3>
            <div className="rv-form-inner">
              <div className="rv-star-picker">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className="rv-star-btn"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24"
                      fill={(hoverRating || selectedRating) >= star ? '#C9A96E' : '#e0d5ca'}
                      stroke="none"
                      style={{ transition: 'fill 0.15s ease, transform 0.15s ease', transform: (hoverRating || selectedRating) >= star ? 'scale(1.1)' : 'scale(1)' }}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="rv-form-fields">
                <input
                  type="text"
                  placeholder="Your first name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="rv-input"
                />
                <textarea
                  placeholder="What did you love about your order?"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className="rv-textarea"
                />
              </div>
              <button className="rv-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Posting...' : 'Post My Review'}
              </button>
              {showSuccess && (
                <p className="rv-success">Thank you for your kind words! ❤️</p>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <style jsx>{`
        .rv-section {
          padding: 100px 0;
          position: relative;
          z-index: 2;
          background: var(--cream, #FBF7F2);
        }
        .rv-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .rv-header { text-align: center; margin-bottom: 48px; }
        .rv-label {
          font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--rose, #C4907C);
          display: block; margin-bottom: 12px;
        }
        .rv-title {
          font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 5vw, 3.2rem);
          color: var(--brown, #3D2B1F); font-weight: 600; margin-bottom: 16px; line-height: 1.2;
        }
        .rv-divider { width: 60px; height: 2px; background: var(--gold, #C9A96E); margin: 0 auto; }

        /* Horizontal Scroll */
        .rv-scroll-wrap {
          position: relative;
          margin: 0 -24px;
          padding: 0 24px;
        }
        .rv-scroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 8px 0 24px;
          scrollbar-width: none;
        }
        .rv-scroll::-webkit-scrollbar { display: none; }

        .rv-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: white;
          color: var(--brown, #3D2B1F);
          box-shadow: 0 4px 16px rgba(61, 43, 31, 0.12);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.25s ease;
        }
        .rv-arrow:hover {
          background: var(--brown, #3D2B1F);
          color: white;
          transform: translateY(-50%) scale(1.05);
        }
        .rv-arrow-left { left: 8px; }
        .rv-arrow-right { right: 8px; }

        /* Review Card */
        .rv-card {
          flex: 0 0 320px;
          background: white;
          border-radius: 18px;
          padding: 28px;
          scroll-snap-align: start;
          border: 1px solid rgba(61, 43, 31, 0.05);
          box-shadow: 0 2px 12px rgba(61, 43, 31, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .rv-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(61, 43, 31, 0.1);
        }

        .rv-card-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 16px;
        }
        .rv-card-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-style: italic;
          font-weight: 400;
          color: var(--brown, #3D2B1F);
          line-height: 1.65;
          flex: 1;
          margin-bottom: 20px;
        }
        .rv-card-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid rgba(61, 43, 31, 0.06);
        }
        .rv-card-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--rose, #C4907C), var(--gold, #C9A96E));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        .rv-card-name {
          display: block;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--brown, #3D2B1F);
        }
        .rv-card-date {
          display: block;
          font-size: 0.75rem;
          color: rgba(61, 43, 31, 0.4);
        }

        .rv-empty-card {
          flex: 0 0 320px;
          background: white;
          border-radius: 18px;
          padding: 40px;
          text-align: center;
          border: 2px dashed rgba(61, 43, 31, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rv-empty-card p {
          color: rgba(61, 43, 31, 0.4);
          font-style: italic;
        }

        /* Form Card */
        .rv-form-card {
          max-width: 600px;
          margin: 48px auto 0;
          background: white;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid rgba(61, 43, 31, 0.05);
          box-shadow: 0 2px 12px rgba(61, 43, 31, 0.04);
          text-align: center;
        }
        .rv-form-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--brown, #3D2B1F);
          margin-bottom: 20px;
        }
        .rv-form-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; }

        .rv-star-picker {
          display: flex;
          gap: 4px;
        }
        .rv-star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          line-height: 1;
        }

        .rv-form-fields {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .rv-input, .rv-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid rgba(61, 43, 31, 0.08);
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          background: var(--cream, #FBF7F2);
          color: var(--brown, #3D2B1F);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .rv-input::placeholder, .rv-textarea::placeholder { color: rgba(61, 43, 31, 0.25); }
        .rv-input:focus, .rv-textarea:focus {
          outline: none;
          border-color: var(--rose, #C4907C);
          box-shadow: 0 0 0 3px rgba(196, 144, 124, 0.12);
        }
        .rv-textarea { resize: vertical; }

        .rv-submit {
          padding: 14px 40px;
          background: linear-gradient(135deg, var(--rose, #C4907C) 0%, #b37d6a 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(196, 144, 124, 0.25);
        }
        .rv-submit:hover {
          background: linear-gradient(135deg, var(--brown, #3D2B1F) 0%, #2a1d14 100%);
          transform: translateY(-1px);
        }
        .rv-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .rv-success {
          color: #059669;
          font-size: 0.9rem;
          animation: fadeUp 0.3s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .rv-section { padding: 72px 0; }
          .rv-card { flex: 0 0 280px; padding: 22px; }
          .rv-arrow { display: none; }
          .rv-form-card { padding: 24px; }
          .rv-input, .rv-textarea { font-size: 16px; }
        }
      `}</style>
    </section>
  );
}
