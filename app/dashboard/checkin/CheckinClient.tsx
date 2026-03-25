'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DAYS, TASKS, todayIdx } from '@/lib/data'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function CheckinClient({
  initialDone,
  userId,
}: {
  initialDone: Record<string, boolean>
  userId: string
}) {
  const [done, setDone]         = useState(initialDone)
  const [saving, setSaving]     = useState<string | null>(null)
  const supabase                = createClient()
  const di                      = todayIdx()
  const today                   = new Date()
  const dateKey                 = today.toISOString().split('T')[0]
  const tasks                   = TASKS[di]
  const doneCount               = tasks.filter(t => done[t.id]).length
  const pct                     = tasks.length ? Math.round(doneCount / tasks.length * 100) : 0
  const circ                    = 2 * Math.PI * 70  // 439.82
  const offset                  = circ * (1 - pct / 100)

  const toggleTask = useCallback(async (taskId: string) => {
    const newVal = !done[taskId]
    setDone(prev => ({ ...prev, [taskId]: newVal }))
    setSaving(taskId)
    await supabase.from('checkins').upsert(
      { user_id: userId, date: dateKey, task_id: taskId, done: newVal },
      { onConflict: 'user_id,date,task_id' }
    )
    setSaving(null)
  }, [done, supabase, userId, dateKey])

  return (
    <div className="page-wrap">
      <h2 className="serif" style={{ fontSize: 'clamp(30px,7vw,48px)', fontWeight: 700, color: 'var(--txt)' }}>
        Daily Check-in
      </h2>
      <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, marginTop: 4, letterSpacing: '.05em' }}>
        {DAYS[di]} · {today.getDate()} {MONTHS[today.getMonth()]} {today.getFullYear()}
      </div>

      {/* PROGRESS RING */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 8px' }}>
        <svg width="168" height="168" viewBox="0 0 168 168" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c8922a" />
              <stop offset="100%" stopColor="#4a7fa5" />
            </linearGradient>
          </defs>
          <circle cx="84" cy="84" r="70" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
          <circle
            cx="84" cy="84" r="70" fill="none"
            stroke="url(#rg)" strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '84px 84px', transition: 'stroke-dashoffset .8s cubic-bezier(.34,1.2,.64,1)' }}
          />
          <text x="84" y="78" textAnchor="middle" dominantBaseline="middle"
            fontFamily="Cormorant Garamond,serif" fontSize="32" fontWeight="700" fill="var(--txt)">
            {pct}%
          </text>
          <text x="84" y="102" textAnchor="middle"
            fontFamily="JetBrains Mono,monospace" fontSize="10" fill="rgba(168,184,200,0.6)">
            {doneCount} / {tasks.length} done
          </text>
        </svg>
      </div>

      {/* CELEBRATION */}
      {pct === 100 && (
        <div className="glass" style={{ textAlign: 'center', padding: '38px 28px', marginBottom: 16, animation: 'celebPop .5s cubic-bezier(.34,1.56,.64,1) both' }}>
          <div className="serif" style={{ fontSize: 22, fontStyle: 'italic', color: 'var(--txt)', marginBottom: 8 }}>
            All blocks complete.
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>You showed up. Every single one.</div>
        </div>
      )}

      {/* TASKS */}
      {tasks.map((t, i) => (
        <div
          key={t.id}
          className={`task-item ${done[t.id] ? 'done' : ''}`}
          style={{ animationDelay: `${i * 28}ms`, opacity: saving === t.id ? 0.6 : undefined }}
          onClick={() => toggleTask(t.id)}
        >
          <div className={`task-cb ${done[t.id] ? 'on' : ''}`} />
          <div style={{ flex: 1 }}>
            <div className="task-lbl">{t.l}</div>
            {t.s && <div className="task-sub">{t.s}</div>}
          </div>
          {saving === t.id && (
            <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--glass-b)', borderTopColor: 'var(--amber)', animation: 'spin .8s linear infinite', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  )
}
