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
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
    // Pre-fill email if saved
    const saved = localStorage.getItem('a2z_admin_email')
    if (saved) setEmail(saved)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Login failed')
        return
      }

      // Save email for next time
      if (rememberMe) {
        localStorage.setItem('a2z_admin_email', email)
      } else {
        localStorage.removeItem('a2z_admin_email')
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
        {/* Logo */}
        <div className={`login-logo ${mounted ? 'fade-in' : ''}`}>
          <img src="/images/logo.png" alt="A2Z Bakerie" />
        </div>

        <h1 className="login-heading">Welcome Back</h1>
        <p className="login-subtitle">Sign in to manage your bakery</p>

        {/* Error */}
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
          {/* Email */}
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

          {/* Password */}
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

          {/* Remember Me */}
          <div className="remember-row">
            <button
              type="button"
              className={`remember-toggle ${rememberMe ? 'on' : ''}`}
              onClick={() => setRememberMe(!rememberMe)}
              aria-label="Remember me"
            >
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
            </button>
            <span className="remember-label" onClick={() => setRememberMe(!rememberMe)}>
              Keep me signed in
            </span>
          </div>

          {/* Submit */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <span className="footer-dot" />
          <span>A2Z Bakerie Admin</span>
          <span className="footer-dot" />
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
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
              rgba(61, 43, 31, 0.88) 0%,
              rgba(42, 29, 20, 0.78) 40%,
              rgba(196, 144, 124, 0.55) 100%
            ),
            url('/images/hero.jpg') center / cover no-repeat;
          filter: blur(3px);
          transform: scale(1.08);
          z-index: 0;
        }

        /* ─── Card ─── */
        .login-card {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 52px 44px 40px;
          max-width: 420px;
          width: 100%;
          box-shadow:
            0 25px 60px rgba(0, 0, 0, 0.18),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          text-align: center;
          opacity: 0;
          transform: translateY(16px) scale(0.98);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .login-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ─── Logo ─── */
        .login-logo {
          margin-bottom: 32px;
          opacity: 0;
          transition: opacity 0.8s ease 0.3s;
        }
        .login-logo.fade-in { opacity: 1; }
        .login-logo img {
          height: 52px;
          width: auto;
          margin: 0 auto;
        }

        /* ─── Heading ─── */
        .login-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.1rem;
          font-weight: 600;
          color: #3D2B1F;
          margin: 0 0 6px;
          line-height: 1.15;
        }
        .login-subtitle {
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          color: rgba(61, 43, 31, 0.45);
          margin: 0 0 36px;
          font-weight: 300;
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
          border-radius: 12px;
          font-size: 0.85rem;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 24px;
          animation: slideDown 0.3s ease;
          border: 1px solid rgba(220, 38, 38, 0.1);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ─── Form ─── */
        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }
        .form-group label {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(61, 43, 31, 0.55);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .form-group input {
          width: 100%;
          padding: 15px 18px;
          border: 1.5px solid rgba(61, 43, 31, 0.08);
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          background: #FBF7F2;
          color: #3D2B1F;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .form-group input::placeholder {
          color: rgba(61, 43, 31, 0.25);
          font-weight: 300;
        }
        .form-group input:focus {
          outline: none;
          border-color: #C4907C;
          box-shadow: 0 0 0 4px rgba(196, 144, 124, 0.12);
          background: white;
        }

        /* ─── Password ─── */
        .password-wrapper { position: relative; }
        .password-wrapper input { padding-right: 50px; }
        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(61, 43, 31, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .password-toggle:hover { color: #C4907C; }

        /* ─── Remember Me ─── */
        .remember-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 8px 0 28px;
          text-align: left;
        }
        .remember-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
        }
        .toggle-track {
          display: block;
          width: 42px;
          height: 24px;
          border-radius: 12px;
          background: rgba(61, 43, 31, 0.12);
          position: relative;
          transition: background 0.25s ease;
        }
        .remember-toggle.on .toggle-track {
          background: #C4907C;
        }
        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
          transition: transform 0.25s ease;
        }
        .remember-toggle.on .toggle-thumb {
          transform: translateX(18px);
        }
        .remember-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          color: rgba(61, 43, 31, 0.55);
          cursor: pointer;
          user-select: none;
          font-weight: 400;
        }

        /* ─── Submit ─── */
        .login-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #C4907C 0%, #b37d6a 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 0.88rem;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 16px rgba(196, 144, 124, 0.3);
        }
        .login-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #3D2B1F 0%, #2a1d14 100%);
          box-shadow: 0 4px 20px rgba(61, 43, 31, 0.3);
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) {
          transform: scale(0.985) translateY(0);
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
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ─── Footer ─── */
        .login-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 36px 0 0;
        }
        .login-footer span {
          font-family: 'Outfit', sans-serif;
          font-size: 0.72rem;
          color: rgba(61, 43, 31, 0.25);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .footer-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(61, 43, 31, 0.15);
        }

        /* ─── Mobile ─── */
        @media (max-width: 480px) {
          .login-page { padding: 16px; }
          .login-card {
            padding: 40px 28px 32px;
            border-radius: 20px;
          }
          .login-heading { font-size: 1.85rem; }
          .login-subtitle { margin-bottom: 28px; }
          .login-logo img { height: 44px; }
          .login-logo { margin-bottom: 24px; }
          .form-group input { padding: 14px 16px; font-size: 16px; }
          .login-btn { padding: 15px; }
        }
      `}</style>
    </div>
  )
}
