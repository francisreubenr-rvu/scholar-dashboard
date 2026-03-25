'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')
  const supabase = createClient()

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card glass">
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 8 }}>
            ✦ RV University · B.Tech CSE
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(32px,8vw,52px)', fontWeight: 700, lineHeight: 1, color: 'var(--txt)' }}>
            Scholar
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8, lineHeight: 1.6 }}>
            Your personal academic dashboard. Attendance, schedule, check-ins — synced everywhere.
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
            <div className="serif" style={{ fontSize: 22, fontStyle: 'italic', color: 'var(--txt)', marginBottom: 8 }}>
              Check your inbox
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              We sent a magic link to <strong style={{ color: 'var(--txt)' }}>{email}</strong>.<br />
              Click it to sign in — no password needed.
            </p>
          </div>
        ) : (
          <>
            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: '100%', padding: '13px', marginBottom: 16,
                background: 'var(--glass)', border: '1px solid var(--glass-b)',
                borderRadius: 11, color: 'var(--txt)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all .2s',
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--glass-b)' }} />
              <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.1em', fontWeight: 700 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--glass-b)' }} />
            </div>

            {/* Magic Link */}
            <form onSubmit={handleMagicLink}>
              <label className="form-lbl">Email address</label>
              <input
                type="email" required
                className="form-inp"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              {error && (
                <div style={{ fontSize: 11, color: '#c07070', marginBottom: 10, padding: '8px 12px', background: 'rgba(180,60,60,.10)', borderRadius: 8, border: '1px solid rgba(180,60,60,.18)' }}>
                  {error}
                </div>
              )}
              <button type="submit" className="btn-amber" disabled={loading}>
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
          </>
        )}

        <p style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', marginTop: 24, lineHeight: 1.6 }}>
          By signing in you agree to use this dashboard responsibly.<br />
          Your data is stored securely on Supabase.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
