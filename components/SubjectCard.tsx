'use client'
import { useState } from 'react'
import AttModal from './AttModal'
import { attColor } from '@/lib/data'

interface Props {
  id: string; name: string; code: string; cr: number
  attended: number; total: number; userId: string
}

export default function SubjectCard({ id, name, code, cr, attended, total, userId }: Props) {
  const [a, setA] = useState(attended)
  const [t, setT] = useState(total)
  const [modal, setModal] = useState(false)

  const pct   = t > 0 ? Math.round((a / t) * 100) : null
  const color = pct !== null ? attColor(pct) : 'var(--muted)'
  const needed = t > 0 && pct !== null && pct < 75
    ? Math.ceil((0.75 * t - a) / 0.25)
    : null

  return (
    <>
      <div className="glass" style={{ padding:'18px 20px', cursor:'pointer', transition:'all .2s' }}
        onClick={() => setModal(true)}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
          <div>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4 }}>{code} · {cr}cr</div>
            <div style={{ fontWeight:600, fontSize:14, color:'var(--txt)', lineHeight:1.3 }}>{name}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="serif" style={{ fontSize:26, fontWeight:700, color, lineHeight:1 }}>{pct !== null ? pct+'%' : '—'}</div>
            <div style={{ fontSize:10, color:'var(--muted)', marginTop:2 }}>{a}/{t}</div>
          </div>
        </div>
        <div className="att-bar-bg" style={{ marginBottom: needed ? 8 : 0 }}>
          <div className="att-bar-fill" style={{ width:`${Math.min(pct ?? 0, 100)}%`, background: color }} />
        </div>
        {needed && <div style={{ fontSize:10, color:'#b05040' }}>⚠ Attend {needed} more to reach 75%</div>}
        {pct !== null && pct >= 85 && <div style={{ fontSize:10, color:'#3a8a6a' }}>✓ Safe — can miss {Math.floor((a - 0.75*t)/0.25)} class{Math.floor((a - 0.75*t)/0.25) !== 1 ? 'es' : ''}</div>}
      </div>
      {modal && <AttModal subjectId={id} subjectName={name} attended={a} total={t} userId={userId}
        onClose={() => setModal(false)} onSave={(na, nt) => { setA(na); setT(nt) }} />}
    </>
  )
}
