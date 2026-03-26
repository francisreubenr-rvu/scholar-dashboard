'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ScheduleBlock from '@/components/ScheduleBlock'
import { DAYS, TASKS, COLORS, type Block, nextExam } from '@/lib/data'
import ThemeToggle from '@/components/ThemeToggle'
import BottomNav from '@/components/BottomNav'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

interface Props {
  dayIdx: number
  greeting: string
  quote: { q: string; a: string }
  avgAtt: string
  collegeTT: Block[]
  personalSchedule: Block[]
  customBlocks: (Block & { id: string })[]
  doneMap: Record<string, boolean>
  userId: string
  dateKey: string
}

export default function TodayClient({
  dayIdx, greeting, quote, avgAtt,
  collegeTT, personalSchedule, customBlocks,
  doneMap: initialDone, userId, dateKey,
}: Props) {
  const [done, setDone]     = useState(initialDone)
  const [nextUp, setNextUp] = useState<(Block & { status: string }) | null>(null)
  const exam                = nextExam()
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const supabase            = createClient()
  const d                   = new Date()
  const tasks               = TASKS[dayIdx]
  const count               = tasks.filter(t => done[t.id]).length
  const pct                 = tasks.length ? Math.round(count / tasks.length * 100) : 0

  useEffect(() => {
    function update() {
      const cur = new Date().getHours() * 60 + new Date().getMinutes()
      for (const b of personalSchedule) {
        const [sh, sm] = b.s.split(':').map(Number)
        const [eh, em] = b.e.split(':').map(Number)
        if (cur >= sh * 60 + sm && cur < eh * 60 + em) { setNextUp({ ...b, status: 'now' }); return }
      }
      for (const b of personalSchedule) {
        const [sh, sm] = b.s.split(':').map(Number)
        if (sh * 60 + sm > cur) { setNextUp({ ...b, status: 'next' }); return }
      }
      setNextUp(null)
    }
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [personalSchedule])

  async function toggleTask(taskId: string) {
    const newVal = !done[taskId]
    setDone(prev => ({ ...prev, [taskId]: newVal }))
    setSaving(taskId)
    const { error: err } = await supabase.from('checkins').upsert(
      { user_id: userId, date: dateKey, task_id: taskId, done: newVal },
      { onConflict: 'user_id,date,task_id' }
    )
    if (err) {
      setDone(prev => ({ ...prev, [taskId]: !newVal }))
      setError('Failed to save. Check your connection.')
    }
    setSaving(null)
  }

  const allPersonal = [...personalSchedule, ...customBlocks].sort((a, b) => a.s.localeCompare(b.s))

  return (
    <>
    <div className="page-wrap">
      {/* HERO */}
      <div className="glass" style={{ padding:'32px 30px 28px', marginBottom:14, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,var(--amber),var(--steel),transparent)', borderRadius:'16px 16px 0 0' }} />
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--amber)', marginBottom:10 }}>{greeting}</div>
        <div className="serif" style={{ fontSize:'clamp(64px,15vw,104px)', fontWeight:700, lineHeight:.88, color:'var(--txt)' }}>{d.getDate()}</div>
        <div className="serif" style={{ fontSize:'clamp(18px,4vw,26px)', fontStyle:'italic', color:'var(--txt2)', marginTop:10 }}>{DAYS[dayIdx]}, {MONTHS[d.getMonth()]}</div>
        <div className="mono" style={{ fontSize:10.5, color:'var(--muted)', marginTop:5, letterSpacing:'.08em' }}>{d.getFullYear()} · RV University</div>
      </div>

      {/* STOIC */}
      <div className="glass" style={{ padding:'24px 28px 22px', marginBottom:14, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'linear-gradient(180deg,var(--amber),var(--steel))', borderRadius:'16px 0 0 16px' }} />
        <div style={{ position:'absolute', top:2, left:14, fontFamily:'Cormorant Garamond,serif', fontSize:90, fontWeight:700, color:'rgba(200,146,42,.08)', lineHeight:1, pointerEvents:'none' }}>&ldquo;</div>
        <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--amber)', marginBottom:10 }}>✦ Stoic of the Day</div>
        <div className="serif" style={{ fontSize:'clamp(15px,3.2vw,20px)', fontStyle:'italic', lineHeight:1.7, color:'var(--txt)', paddingLeft:8, position:'relative', zIndex:1 }}>
          &ldquo;{quote.q}&rdquo;
        </div>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', color:'var(--amber)', marginTop:12, paddingLeft:8 }}>— {quote.a}</div>
      </div>

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
        {[{ n: pct+'%', l:'Today Done' },{ n: exam.days+'d', l:'Days to '+exam.label },{ n: avgAtt, l:'Avg Attend.' }].map(({ n, l }) => (
          <div key={l} className="glass" style={{ padding:'16px 14px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,var(--steel),transparent)' }} />
            <div className="serif" style={{ fontSize:30, fontWeight:700, color:'var(--amber2)', lineHeight:1, marginBottom:5 }}>{n}</div>
            <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:'.13em', textTransform:'uppercase', color:'var(--muted)' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* NEXT UP */}
      {nextUp && (
        <div className="glass" style={{ padding:'14px 18px', marginBottom:14, display:'flex', alignItems:'center', gap:14, borderLeft:'3px solid var(--amber)' }}>
          <div style={{ width:9, height:9, borderRadius:'50%', background:COLORS[nextUp.cat]?.c ?? 'var(--amber)', flexShrink:0, animation:'pulse 2.4s ease infinite' }} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase', color:'var(--amber)', marginBottom:3 }}>{nextUp.status === 'now' ? '● Now' : '▷ Next'}</div>
            <div style={{ fontWeight:600, fontSize:15, color:'var(--txt)', lineHeight:1.2 }}>{nextUp.title}</div>
            <div className="mono" style={{ fontSize:10, color:'var(--muted)', marginTop:3 }}>{nextUp.s} – {nextUp.e}</div>
          </div>
        </div>
      )}

      {/* CHECKLIST */}
      <div className="section-line">Daily Check-in · {count}/{tasks.length}</div>
      {tasks.map((t, i) => {
        const isDone = !!done[t.id]
        return (
          <div key={t.id} className={`task-item${isDone ? ' done' : ''}`} style={{ animationDelay:`${i*28}ms` }} onClick={() => toggleTask(t.id)}>
            <div className={`task-cb${isDone ? ' on' : ''}`}>{saving === t.id ? <span style={{fontSize:9,color:'var(--muted)'}}>…</span> : null}</div>
            <div>
              <div className="task-lbl">{t.l}</div>
              {t.s && <div className="task-sub">{t.s}</div>}
            </div>
          </div>
        )
      })}

      {/* COLLEGE TT */}
      <div className="section-line">College Timetable</div>
      {collegeTT.length
        ? collegeTT.map((b, i) => <ScheduleBlock key={i} {...b} delay={i * 32} isNow={nextUp?.s === b.s && nextUp?.status === 'now'} />)
        : <p style={{ color:'var(--muted)', fontSize:13, padding:'8px 0' }}>No classes today.</p>}

      {/* PERSONAL PLAN */}
      <div className="section-line">Study & Life Plan</div>
      {allPersonal.map((b, i) => <ScheduleBlock key={i} {...b} delay={i * 22} isNow={nextUp?.s === b.s && nextUp?.status === 'now'} />)}
    </div>
    {error && (
      <div style={{position:'fixed',top:16,left:'50%',transform:'translateX(-50%)',zIndex:3000,background:'rgba(176,80,64,0.95)',color:'#fff',padding:'10px 18px',borderRadius:10,fontSize:13,fontWeight:600,display:'flex',gap:12,alignItems:'center',boxShadow:'0 4px 20px rgba(0,0,0,0.4)'}}>
        {error}
        <button onClick={() => setError(null)} style={{background:'none',border:'none',color:'#fff',cursor:'pointer',fontSize:16,lineHeight:1}}>✕</button>
      </div>
    )}
    <ThemeToggle />
    <BottomNav />
    </>
  )
}
