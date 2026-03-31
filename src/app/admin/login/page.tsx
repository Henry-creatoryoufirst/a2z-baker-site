'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLogin />
    </Suspense>
  )
}

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Login failed')
        return
      }

      const redirect = searchParams.get('redirect') || '/admin'
      router.push(redirect)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <img src="/images/logo.png" alt="A2Z Bakerie" />
        </div>
        <h1>Admin Dashboard</h1>
        <p className="admin-login-subtitle">Sign in to manage A2Z Bakerie</p>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FBF7F2;
          padding: 24px;
        }
        .admin-login-card {
          background: white;
          border-radius: 16px;
          padding: 48px;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(61, 43, 31, 0.08);
          text-align: center;
        }
        .admin-login-logo img {
          height: 64px;
          margin: 0 auto 24px;
        }
        h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          color: #3D2B1F;
          margin-bottom: 8px;
        }
        .admin-login-subtitle {
          color: #5a4638;
          font-size: 0.95rem;
          margin-bottom: 32px;
        }
        .admin-login-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        .admin-form-group {
          margin-bottom: 20px;
          text-align: left;
        }
        .admin-form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: #3D2B1F;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .admin-form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(61, 43, 31, 0.15);
          border-radius: 8px;
          font-size: 1rem;
          font-family: 'Outfit', sans-serif;
          background: #FBF7F2;
          color: #3D2B1F;
          transition: border-color 0.3s;
        }
        .admin-form-group input:focus {
          outline: none;
          border-color: #C4907C;
        }
        .admin-login-btn {
          width: 100%;
          padding: 14px;
          background: #C4907C;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .admin-login-btn:hover { background: #3D2B1F; }
        .admin-login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
