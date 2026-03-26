import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CTT, PSCHED, DAYS, COLORS, todayIdx } from '@/lib/data'
import BottomNav from '@/components/BottomNav'
import ThemeToggle from '@/components/ThemeToggle'

export default async function WeekPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const today = todayIdx()

  return (
    <>
      <div className="page-wrap">
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:'.2em', textTransform:'uppercase', color:'var(--amber)', marginBottom:8 }}>RV University · Sem 2</div>
          <div className="serif" style={{ fontSize:36, fontWeight:700, color:'var(--txt)', lineHeight:1 }}>Week View</div>
        </div>

        {DAYS.map((day, di) => {
          const merged = [...CTT[di], ...PSCHED[di]].sort((a, b) => a.s.localeCompare(b.s))
          return (
            <div key={day} style={{ marginBottom:24 }}>
              <div className="section-line" style={{ color: di === today ? 'var(--amber)' : undefined }}>
                {di === today ? '▶ ' : ''}{day}
                {di === today && <span style={{ fontSize:9, background:'rgba(200,146,42,0.15)', color:'var(--amber)', padding:'2px 8px', borderRadius:20, border:'1px solid rgba(200,146,42,0.3)' }}>Today</span>}
              </div>
              {merged.length === 0
                ? <p style={{ color:'var(--muted)', fontSize:12, padding:'4px 0' }}>Free day.</p>
                : merged.map((b, i) => {
                    const pal = COLORS[b.cat] ?? { c:'#687080', bg:'rgba(104,112,128,0.09)' }
                    return (
                      <div key={i} className="sblock">
                        <div className="sblock-strip" style={{ background: pal.c }} />
                        <div className="sblock-body">
                          <div className="sblock-time">{b.s} – {b.e}</div>
                          <div className="sblock-title">{b.title}</div>
                          {b.note && <div className="sblock-note">{b.note}</div>}
                          {b.room && <div className="sblock-note">📍 {b.room}</div>}
                        </div>
                        <span className="sblock-chip" style={{ background: pal.bg, color: pal.c, borderColor: pal.c+'44' }}>{b.cat}</span>
                      </div>
                    )
                  })
              }
            </div>
          )
        })}
      </div>
      <ThemeToggle />
      <BottomNav />
    </>
  )
}
