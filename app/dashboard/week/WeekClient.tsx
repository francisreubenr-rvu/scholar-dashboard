'use client'

import { useState } from 'react'
import ScheduleBlock from '@/components/ScheduleBlock'
import { DAYS, DABBR, CTT, PSCHED, todayIdx } from '@/lib/data'

interface CustomBlock {
  id: string; day: number; cat: string; start_time: string
  end_time: string; title: string; note: string
}

export default function WeekClient({ initialCustom }: { initialCustom: CustomBlock[] }) {
  const todayI = todayIdx()
  const [activeDay, setActiveDay] = useState(todayI)

  const now = new Date()
  const collegeBlocks = CTT[activeDay]
  const customForDay  = initialCustom
    .filter(b => Number(b.day) === activeDay)
    .map(b => ({ s: b.start_time, e: b.end_time, title: b.title, cat: b.cat, note: b.note }))
  const personalBlocks = [...PSCHED[activeDay], ...customForDay]
    .sort((a, b) => a.s.localeCompare(b.s))

  return (
    <div className="page-wrap">
      <h2 className="serif" style={{ fontSize: 'clamp(30px,7vw,48px)', fontWeight: 700, color: 'var(--txt)', marginBottom: 20 }}>
        Weekly Plan
      </h2>

      {/* DAY TABS */}
      <div className="glass" style={{ display: 'flex', gap: 4, padding: 8, marginBottom: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {DAYS.map((day, i) => {
          const td = new Date(now)
          td.setDate(now.getDate() - todayI + i)
          const isActive  = i === activeDay
          const isToday   = i === todayI
          return (
            <button
              key={day}
              onClick={() => setActiveDay(i)}
              style={{
                flexShrink: 0, padding: '9px 14px',
                border: isActive ? '1px solid rgba(200,146,42,0.22)' : '1px solid transparent',
                background: isActive ? 'rgba(200,146,42,0.12)' : 'transparent',
                borderRadius: 10, cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11.5, fontWeight: 600,
                color: isActive ? 'var(--amber2)' : 'var(--muted)',
                transition: 'all .2s ease',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em' }}>
                {DABBR[i]}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                {td.getDate()}
              </span>
              {isToday && (
                <span style={{ position: 'absolute', bottom: 5, width: 4, height: 4, background: 'var(--steel2)', borderRadius: '50%' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* COLLEGE */}
      <div className="section-line">College Timetable</div>
      {collegeBlocks.length > 0
        ? collegeBlocks.map((b, i) => <ScheduleBlock key={i} {...b} delay={i * 28} />)
        : <p style={{ color: 'var(--muted)', fontSize: 13, padding: '8px 0' }}>No classes.</p>
      }

      {/* PERSONAL */}
      <div className="section-line">Study &amp; Life Plan</div>
      {personalBlocks.map((b, i) => <ScheduleBlock key={i} {...b} delay={i * 20} />)}
    </div>
  )
}
