'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SUBJECTS, attColor } from '@/lib/data'

export default function AttendanceClient({
  initialAtt,
  userId,
}: {
  initialAtt: Record<string, { a: number; t: number }>
  userId: string
}) {
  const [att, setAtt]   = useState<Record<string, { a: number; t: number }>>(() => {
    const map: Record<string, { a: number; t: number }> = {}
    SUBJECTS.forEach(s => { map[s.id] = initialAtt[s.id] ?? { a: 0, t: 0 } })
    return map
  })
  const [saving, setSaving] = useState<string | null>(null)
  const supabase = createClient()

  const adjust = useCallback(async (id: string, field: 'a' | 't', delta: number) => {
    setAtt(prev => {
      const cur = { ...prev[id] }
      cur[field] = Math.max(0, cur[field] + delta)
      if (cur.a > cur.t) { field === 'a' ? cur.t = cur.a : cur.a = cur.t }
      return { ...prev, [id]: cur }
    })
    setSaving(id)
    const updated = { ...att[id] }
    updated[field] = Math.max(0, updated[field] + delta)
    if (updated.a > updated.t) { field === 'a' ? updated.t = updated.a : updated.a = updated.t }
    await supabase.from('attendance').upsert(
      { user_id: userId, subject_id: id, attended: updated.a, total: updated.t },
      { onConflict: 'user_id,subject_id' }
    )
    setSaving(null)
  }, [att, supabase, userId])

  // Overall stats
  const vals = SUBJECTS.map(s => {
    const a = att[s.id]
    return a.t > 0 ? (a.a / a.t) * 100 : null
  }).filter((v): v is number => v !== null)
  const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
  const danger = SUBJECTS.filter(s => { const a = att[s.id]; return a.t > 0 && (a.a / a.t) * 100 < 75 })

  return (
    <div className="page-wrap">
      <h2 className="serif" style={{ fontSize: 'clamp(30px,7vw,48px)', fontWeight: 700, marginBottom: 6, color: 'var(--txt)' }}>
        Attendance
      </h2>
      <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 20 }}>
        RV University requires ≥ 75% per subject
      </div>

      {/* Summary bar */}
      <div className="glass" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div className="serif" style={{ fontSize: 36, fontWeight: 700, color: attColor(avg), lineHeight: 1 }}>{avg}%</div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 3 }}>Overall Average</div>
        </div>
        {danger.length > 0 && (
          <div style={{ fontSize: 11, color: '#c07070', background: 'rgba(180,60,60,.10)', border: '1px solid rgba(180,60,60,.18)', borderRadius: 8, padding: '8px 12px', lineHeight: 1.6 }}>
            ⚠ <strong style={{ color: '#d08080' }}>{danger.length} subject{danger.length > 1 ? 's' : ''}</strong> below 75%:&nbsp;
            {danger.map(s => s.name).join(', ')}
          </div>
        )}
      </div>

      {/* Subject cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 12 }}>
        {SUBJECTS.map(s => {
          const { a, t } = att[s.id]
          const pct      = t > 0 ? Math.round((a / t) * 100) : 0
          const col      = attColor(pct)
          const isSaving = saving === s.id
          return (
            <div key={s.id} className="glass" style={{ padding: 20, position: 'relative', overflow: 'hidden', opacity: isSaving ? 0.75 : 1, transition: 'opacity .15s' }}>
              {/* Accent top line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--amber),var(--steel))' }} />

              <div className="serif" style={{ fontSize: 18, fontWeight: 600, color: 'var(--txt)', marginBottom: 2 }}>{s.name}</div>
              <div className="mono" style={{ fontSize: 9.5, color: 'var(--muted)', marginBottom: 14, letterSpacing: '.05em' }}>{s.code} · {s.cr} cr</div>

              {/* Bar */}
              <div className="att-bar-bg">
                <div className="att-bar-fill" style={{ width: `${pct}%`, background: col }} />
              </div>

              <div className="serif" style={{ fontSize: 32, fontWeight: 700, color: col, lineHeight: 1 }}>{pct}%</div>
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 3, marginBottom: 14 }}>
                {a} present · {t} total
              </div>

              {t > 0 && pct < 75 && (
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', marginBottom: 10, padding: '4px 9px', borderRadius: 5, background: 'rgba(180,60,60,.10)', color: '#c07070', border: '1px solid rgba(180,60,60,.18)', display: 'inline-block' }}>
                  ⚠ Below 75%
                </div>
              )}

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Present</span>
                <button className="att-btn" onClick={() => adjust(s.id, 'a', -1)}>−</button>
                <button className="att-btn" onClick={() => adjust(s.id, 'a', +1)}>+</button>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Total</span>
                <button className="att-btn" onClick={() => adjust(s.id, 't', -1)}>−</button>
                <button className="att-btn" onClick={() => adjust(s.id, 't', +1)}>+</button>
              </div>

              {/* Saving spinner */}
              {isSaving && (
                <div style={{ position: 'absolute', top: 10, right: 10, width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--glass-b)', borderTopColor: 'var(--amber)', animation: 'spin .8s linear infinite' }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
