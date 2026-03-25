'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { id:'today',   label:'Today',    href:'/dashboard' },
  { id:'week',    label:'Week',     href:'/dashboard/week' },
  { id:'checkin', label:'Check-in', href:'/dashboard/checkin' },
  { id:'att',     label:'Attend.',  href:'/dashboard/attendance' },
  { id:'editor',  label:'Edit',     href:'/dashboard/editor' },
]

export default function DashboardClient({ children, userName, avatarUrl }: {
  children: React.ReactNode; userName: string; avatarUrl: string | null
}) {
  const [theme, setTheme] = useState<'dark'|'light'>('dark')
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const applyTheme = useCallback(async (t: 'dark'|'light') => {
    document.documentElement.setAttribute('data-theme', t)
    setTheme(t)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('preferences').upsert({ user_id: user.id, theme: t }, { onConflict: 'user_id' })
  }, [supabase])

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('preferences').select('theme').eq('user_id', user.id).single()
      if (data?.theme) applyTheme(data.theme as 'dark'|'light')
    })()
  }, [supabase, applyTheme])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const activeId = pathname === '/dashboard' ? 'today'
    : NAV.find(n => n.href !== '/dashboard' && pathname.startsWith(n.href))?.id ?? 'today'

  return (
    <>
      {/* Theme button */}
      <button className="theme-btn" onClick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* User badge */}
      <div style={{ position:'fixed', top:20, left:20, zIndex:999, display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:50, background:'var(--glass)', backdropFilter:'blur(24px)', border:'1px solid var(--glass-b)', boxShadow:'var(--shadow)' }}>
        <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(200,146,42,.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'var(--amber2)', flexShrink:0 }}>
          {avatarUrl
            ? <img src={avatarUrl} alt="" style={{ width:24, height:24, borderRadius:'50%', objectFit:'cover' }} />
            : userName[0]?.toUpperCase()}
        </div>
        <span style={{ fontSize:11, fontWeight:600, color:'var(--txt)', maxWidth:90, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userName}</span>
        <button onClick={signOut} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:9.5, fontWeight:700, letterSpacing:'.08em', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>OUT</button>
      </div>

      {children}

      {/* Bottom nav */}
      <nav className="bottom-nav">
        {NAV.map(({ id, label, href }) => (
          <a key={id} href={href} className={`nav-btn${activeId === id ? ' active' : ''}`}>
            <NavIcon id={id} />
            {label}
          </a>
        ))}
      </nav>
    </>
  )
}

function NavIcon({ id }: { id: string }) {
  if (id === 'today')   return <svg viewBox="0 0 24 24" style={ico}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></svg>
  if (id === 'week')    return <svg viewBox="0 0 24 24" style={ico}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  if (id === 'checkin') return <svg viewBox="0 0 24 24" style={ico}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  if (id === 'att')     return <svg viewBox="0 0 24 24" style={ico}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  return <svg viewBox="0 0 24 24" style={ico}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}

const ico: React.CSSProperties = { width:18, height:18, stroke:'currentColor', fill:'none', strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' }
