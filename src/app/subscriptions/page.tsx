'use client'

import { useEffect, useState } from 'react'
import type { SubscriptionClub } from '@/lib/types'

export default function SubscriptionsPage() {
  const [clubs, setClubs] = useState<SubscriptionClub[]>([])
  const [loading, setLoading] = useState(true)
  const [signupClub, setSignupClub] = useState<SubscriptionClub | null>(null)
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/subscriptions')
      .then(r => r.json())
      .then(data => {
        setClubs(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!signupClub) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/subscriptions/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          club_id: signupClub.id,
          name: formName,
          email: formEmail,
          phone: formPhone || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to sign up')
        setSubmitting(false)
        return
      }

      setSuccess(`You're signed up for ${signupClub.name}! We'll be in touch soon.`)
      setSignupClub(null)
      setFormName('')
      setFormEmail('')
      setFormPhone('')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className="subs-page">
      <nav className="subs-nav">
        <a href="/" className="subs-back">← Back to A2Z Bakerie</a>
      </nav>

      <div className="subs-hero">
        <span className="subs-label">Subscription Clubs</span>
        <h1>Join the Club</h1>
        <p>Sign up for our subscription clubs and get fresh, handcrafted baked goods delivered on a regular schedule. No commitment — just great baking!</p>
      </div>

      {success && (
        <div className="subs-success">
          <p>{success}</p>
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      <div className="subs-container">
        {loading ? (
          <div className="subs-loading">Loading clubs...</div>
        ) : clubs.length === 0 ? (
          <div className="subs-empty">
            <h3>Coming Soon!</h3>
            <p>We&apos;re working on some exciting subscription options. Check back soon!</p>
          </div>
        ) : (
          <div className="subs-grid">
            {clubs.map(club => (
              <div key={club.id} className="sub-card">
                {club.image_url && (
                  <div className="sub-image">
                    <img src={club.image_url} alt={club.name} />
                  </div>
                )}
                <div className="sub-content">
                  <h3>{club.name}</h3>
                  <div className="sub-price">
                    <span className="sub-amount">${club.price}</span>
                    <span className="sub-freq">/ {club.frequency}</span>
                  </div>
                  <p>{club.description}</p>
                  {club.items.length > 0 && (
                    <div className="sub-items">
                      <strong>What&apos;s Included:</strong>
                      <ul>
                        {club.items.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  <button onClick={() => setSignupClub(club)} className="sub-signup-btn">
                    Sign Up
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signup Modal */}
      {signupClub && (
        <div className="signup-overlay" onClick={() => setSignupClub(null)}>
          <div className="signup-modal" onClick={e => e.stopPropagation()}>
            <button className="signup-close" onClick={() => setSignupClub(null)}>×</button>
            <h3>Join {signupClub.name}</h3>
            <p className="signup-subtitle">${signupClub.price} / {signupClub.frequency}</p>

            {error && <div className="signup-error">{error}</div>}

            <form onSubmit={handleSignup}>
              <div className="signup-field">
                <label>Name</label>
                <input value={formName} onChange={e => setFormName(e.target.value)} required />
              </div>
              <div className="signup-field">
                <label>Email</label>
                <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} required />
              </div>
              <div className="signup-field">
                <label>Phone (optional)</label>
                <input type="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)} />
              </div>
              <button type="submit" disabled={submitting} className="signup-submit">
                {submitting ? 'Signing up...' : 'Join the Club'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .subs-page { min-height: 100vh; background: #FBF7F2; }
        .subs-nav { padding: 20px 24px; }
        .subs-back { color: #C4907C; font-size: 0.9rem; font-weight: 500; }
        .subs-hero {
          text-align: center; padding: 60px 24px; max-width: 600px; margin: 0 auto;
        }
        .subs-label {
          font-size: 0.8rem; font-weight: 500; letter-spacing: 0.2em;
          text-transform: uppercase; color: #C4907C; display: block; margin-bottom: 12px;
        }
        .subs-hero h1 {
          font-family: 'Cormorant Garamond', serif; font-size: 3rem; color: #3D2B1F; margin-bottom: 16px;
        }
        .subs-hero p { color: #5a4638; font-size: 1.05rem; line-height: 1.7; }
        .subs-container { max-width: 1000px; margin: 0 auto; padding: 0 24px 80px; }
        .subs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .sub-card {
          background: white; border-radius: 16px; overflow: hidden;
          box-shadow: 0 4px 20px rgba(61,43,31,0.08); transition: transform 0.3s, box-shadow 0.3s;
        }
        .sub-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(61,43,31,0.12); }
        .sub-image { height: 200px; overflow: hidden; }
        .sub-image img { width: 100%; height: 100%; object-fit: cover; }
        .sub-content { padding: 24px; }
        .sub-content h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: #3D2B1F; margin-bottom: 8px; }
        .sub-price { margin-bottom: 12px; }
        .sub-amount { font-size: 1.5rem; font-weight: 600; color: #C4907C; }
        .sub-freq { font-size: 0.9rem; color: #5a4638; }
        .sub-content p { color: #5a4638; font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px; }
        .sub-items { margin-bottom: 20px; }
        .sub-items strong { font-size: 0.85rem; color: #3D2B1F; display: block; margin-bottom: 6px; }
        .sub-items ul { list-style: none; }
        .sub-items li { font-size: 0.85rem; color: #5a4638; padding: 2px 0; }
        .sub-items li::before { content: '✓ '; color: #C4907C; font-weight: 600; }
        .sub-signup-btn {
          width: 100%; padding: 12px; background: #C4907C; color: white; border: none;
          border-radius: 8px; font-family: 'Outfit', sans-serif; font-size: 0.95rem;
          font-weight: 500; cursor: pointer; transition: background 0.3s;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .sub-signup-btn:hover { background: #3D2B1F; }
        .signup-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000;
          display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .signup-modal {
          background: white; border-radius: 16px; padding: 32px; max-width: 420px;
          width: 100%; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .signup-close {
          position: absolute; top: 12px; right: 16px; background: none; border: none;
          font-size: 1.5rem; cursor: pointer; color: #999;
        }
        .signup-modal h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: #3D2B1F; margin-bottom: 4px; }
        .signup-subtitle { color: #C4907C; font-size: 1rem; margin-bottom: 20px; }
        .signup-error { background: #fef2f2; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 16px; }
        .signup-field { margin-bottom: 16px; }
        .signup-field label { display: block; font-size: 0.8rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #3D2B1F; margin-bottom: 4px; }
        .signup-field input {
          width: 100%; padding: 10px 12px; border: 1px solid rgba(61,43,31,0.15);
          border-radius: 8px; font-family: 'Outfit', sans-serif; font-size: 0.95rem;
          background: #FBF7F2; color: #3D2B1F;
        }
        .signup-field input:focus { outline: none; border-color: #C4907C; }
        .signup-submit {
          width: 100%; padding: 12px; background: #C4907C; color: white; border: none;
          border-radius: 8px; font-family: 'Outfit', sans-serif; font-size: 0.95rem;
          font-weight: 500; cursor: pointer; transition: background 0.3s;
        }
        .signup-submit:hover { background: #3D2B1F; }
        .signup-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .subs-success {
          max-width: 600px; margin: 0 auto 24px; background: #d1fae5; color: #065f46;
          padding: 16px 20px; border-radius: 8px; display: flex; justify-content: space-between;
          align-items: center;
        }
        .subs-success button { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #065f46; }
        .subs-loading, .subs-empty { text-align: center; padding: 60px 24px; color: #5a4638; }
        .subs-empty h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: #3D2B1F; margin-bottom: 8px; }
      `}</style>
    </div>
  )
}
