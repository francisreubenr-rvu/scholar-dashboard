'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DAYS, COLORS } from '@/lib/data'

interface Block {
  id: string; day: number; cat: string
  start_time: string; end_time: string; title: string; note: string
}

const CATS = [
  'DS','DBMS','OS','LA','ESM','EEX','LEETCODE','COURSERA','REVISION','MISC'
]

export default function EditorClient({
  initialBlocks,
  userId,
}: {
  initialBlocks: Block[]
  userId: string
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const supabase = createClient()

  // Form state
  const [day,   setDay]   = useState('0')
  const [cat,   setCat]   = useState('DS')
  const [start, setStart] = useState('19:00')
  const [end,   setEnd]   = useState('20:00')
  const [title, setTitle] = useState('')
  const [note,  setNote]  = useState('')

  const addBlock = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('Please enter a title.'); return }
    if (start >= end)  { setError('End time must be after start time.'); return }
    setError(''); setSaving(true)

    const { data, error: err } = await supabase
      .from('schedule_blocks')
      .insert({
        user_id:    userId,
        day:        Number(day),
        cat,
        start_time: start,
        end_time:   end,
        title:      title.trim(),
        note:       note.trim(),
      })
      .select()
      .single()

    if (err) { setError(err.message) }
    else     { setBlocks(prev => [...prev, data]); setTitle(''); setNote('') }
    setSaving(false)
  }, [supabase, userId, day, cat, start, end, title, note])

  const deleteBlock = useCallback(async (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id))
    await supabase.from('schedule_blocks').delete().eq('id', id)
  }, [supabase])

  return (
    <div className="page-wrap">
      <h2 className="serif" style={{ fontSize: 'clamp(30px,7vw,48px)', fontWeight: 700, marginBottom: 6, color: 'var(--txt)' }}>
        Edit Schedule
      </h2>
      <div style={{ color: 'var(--muted)', fontSize: 11.5, marginBottom: 20 }}>
        Add custom study or activity blocks to any day. Synced to your account.
      </div>

      {/* ADD FORM */}
      <form className="glass" style={{ padding: 26, marginBottom: 20 }} onSubmit={addBlock}>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 18 }}>
          ✦ Add New Block
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label className="form-lbl">Day</label>
            <select className="form-sel" value={day} onChange={e => setDay(e.target.value)}>
              {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="form-lbl">Category</label>
            <select className="form-sel" value={cat} onChange={e => setCat(e.target.value)}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label className="form-lbl">Start Time</label>
            <input type="time" className="form-inp" value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <label className="form-lbl">End Time</label>
            <input type="time" className="form-inp" value={end} onChange={e => setEnd(e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label className="form-lbl">Title</label>
          <input
            type="text" className="form-inp"
            placeholder="e.g. DS – Binary Trees deep dive"
            value={title} onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="form-lbl">Note (optional)</label>
          <input
            type="text" className="form-inp"
            placeholder="What specifically will you do?"
            value={note} onChange={e => setNote(e.target.value)}
          />
        </div>

        {error && (
          <div style={{ fontSize: 11, color: '#c07070', marginBottom: 12, padding: '8px 12px', background: 'rgba(180,60,60,.10)', borderRadius: 8, border: '1px solid rgba(180,60,60,.18)' }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn-amber" disabled={saving}>
          {saving ? 'Saving…' : '＋ Add to Schedule'}
        </button>
      </form>

      {/* CUSTOM BLOCKS LIST */}
      <div className="section-line">Your Custom Blocks</div>

      {blocks.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 13, padding: '8px 0' }}>
          No custom blocks yet. Add one above and it will appear in Today and Week views.
        </p>
      ) : (
        blocks.map((b, i) => {
          const pal = COLORS[b.cat] ?? { c: '#687080' }
          return (
            <div
              key={b.id}
              className="glass"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', marginBottom: 8, borderRadius: 12, animation: `fadeUp .3s ease ${i * 30}ms both` }}
            >
              <div style={{ width: 3, height: 38, borderRadius: 2, background: pal.c, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--txt)' }}>{b.title}</div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                  {DAYS[b.day]} · {b.start_time} – {b.end_time}
                  {b.note && <span> · {b.note}</span>}
                </div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: 4, background: pal.bg ?? 'transparent', color: pal.c, border: `1px solid ${pal.c}44` }}>
                {b.cat}
              </span>
              <button
                onClick={() => deleteBlock(b.id)}
                style={{ background: 'rgba(160,50,50,.10)', border: '1px solid rgba(160,50,50,.18)', color: '#b07070', borderRadius: 7, padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all .15s', flexShrink: 0 }}
              >
                Remove
              </button>
            </div>
          )
        })
      )}
    </div>
  )
}
