'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

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
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => { setMounted(true) }, [])

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
    <div className="login-page">
      <div className="login-bg" />

      <div className={`login-card ${mounted ? 'visible' : ''}`}>
        <div className={`login-logo ${mounted ? 'fade-in' : ''}`}>
          <img src="/images/logo.png" alt="A2Z Bakerie" />
        </div>

        <h1 className="login-heading">Welcome Back</h1>
        <p className="login-subtitle">Sign in to manage your bakery</p>

        {error && (
          <div className="login-error" key={error}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5M8 10.5h.007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="login-footer">A2Z Bakerie Admin</p>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* ─── Background ─── */
        .login-bg {
          position: fixed;
          inset: 0;
          background:
            linear-gradient(
              160deg,
              rgba(61, 43, 31, 0.85) 0%,
              rgba(42, 29, 20, 0.75) 50%,
              rgba(196, 144, 124, 0.5) 100%
            ),
            url('/images/hero.jpg') center / cover no-repeat;
          filter: blur(2px);
          transform: scale(1.05);
          z-index: 0;
        }

        /* ─── Card ─── */
        .login-card {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 48px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
          text-align: center;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .login-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ─── Logo ─── */
        .login-logo {
          margin-bottom: 28px;
          opacity: 0;
          transition: opacity 0.8s ease 0.2s;
        }
        .login-logo.fade-in {
          opacity: 1;
        }
        .login-logo img {
          height: 56px;
          width: auto;
        }

        /* ─── Heading ─── */
        .login-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          color: #3D2B1F;
          margin: 0 0 8px;
          line-height: 1.2;
        }
        .login-subtitle {
          font-family: 'Outfit', sans-serif;
          font-size: 0.925rem;
          color: rgba(61, 43, 31, 0.5);
          margin: 0 0 32px;
        }

        /* ─── Error ─── */
        .login-error {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 24px;
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ─── Form ─── */
        .form-group {
          margin-bottom: 22px;
          text-align: left;
        }
        .form-group label {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(61, 43, 31, 0.6);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid rgba(61, 43, 31, 0.1);
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: 'Outfit', sans-serif;
          background: #FBF7F2;
          color: #3D2B1F;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .form-group input::placeholder {
          color: rgba(61, 43, 31, 0.3);
        }
        .form-group input:focus {
          outline: none;
          border-color: #C4907C;
          box-shadow: 0 0 0 3px rgba(196, 144, 124, 0.15);
          background: white;
        }

        /* ─── Password ─── */
        .password-wrapper {
          position: relative;
        }
        .password-wrapper input {
          padding-right: 48px;
        }
        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(61, 43, 31, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 4px;
          transition: color 0.2s;
        }
        .password-toggle:hover {
          color: #C4907C;
        }

        /* ─── Submit Button ─── */
        .login-btn {
          width: 100%;
          padding: 14px;
          background: #C4907C;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 4px;
        }
        .login-btn:hover:not(:disabled) {
          background: #3D2B1F;
        }
        .login-btn:active:not(:disabled) {
          transform: scale(0.985);
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* ─── Spinner ─── */
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ─── Footer ─── */
        .login-footer {
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          color: rgba(61, 43, 31, 0.3);
          margin: 32px 0 0;
          letter-spacing: 0.05em;
        }

        /* ─── Mobile ─── */
        @media (max-width: 480px) {
          .login-card {
            padding: 36px 28px;
            border-radius: 16px;
          }
          .login-heading {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  )
}
