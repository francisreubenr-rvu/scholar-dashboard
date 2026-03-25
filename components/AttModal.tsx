'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  subjectId: string
  subjectName: string
  attended: number
  total: number
  userId: string
  onClose: () => void
  onSave: (a: number, t: number) => void
}

export default function AttModal({ subjectId, subjectName, attended, total, userId, onClose, onSave }: Props) {
  const [a, setA] = useState(attended)
  const [t, setT] = useState(total)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function save() {
    setSaving(true)
    await supabase.from('attendance').upsert(
      { user_id: userId, subject_id: subjectId, attended: a, total: t },
      { onConflict: 'user_id,subject_id' }
    )
    onSave(a, t)
    setSaving(false)
    onClose()
  }

  const pct = t > 0 ? Math.round((a / t) * 100) : 0
  const color = pct >= 85 ? '#3a8a6a' : pct >= 75 ? '#c8922a' : '#b05040'

  return (
    <div style={{ position:'fixed', inset:0, zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)' }} onClick={onClose}>
      <div className="glass" style={{ width:'100%', maxWidth:360, padding:'28px 26px', animation:'fadeUp .25s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--amber)', marginBottom:6 }}>Attendance</div>
        <div className="serif" style={{ fontSize:22, fontWeight:700, color:'var(--txt)', marginBottom:20 }}>{subjectName}</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
          {[['Attended', a, setA], ['Total', t, setT]].map(([label, val, setter]: any) => (
            <div key={label}>
              <label className="form-lbl">{label}</label>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <button className="att-btn" onClick={() => setter((v: number) => Math.max(0, v - 1))}>−</button>
                <span style={{ flex:1, textAlign:'center', fontSize:22, fontWeight:700, color:'var(--txt)', fontFamily:'Cormorant Garamond,serif' }}>{val}</span>
                <button className="att-btn" onClick={() => setter((v: number) => v + 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="att-bar-bg" style={{ marginBottom:8 }}>
          <div className="att-bar-fill" style={{ width: `${Math.min(pct,100)}%`, background: color }} />
        </div>
        <div style={{ textAlign:'center', fontSize:28, fontWeight:700, fontFamily:'Cormorant Garamond,serif', color: color, marginBottom:20 }}>{pct}%</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <button className="btn-amber" style={{ background:'var(--glass)', color:'var(--muted)' }} onClick={onClose}>Cancel</button>
          <button className="btn-amber" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}
