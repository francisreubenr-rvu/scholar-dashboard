import { COLORS } from '@/lib/data'

interface Props {
  s: string; e: string; title: string; cat: string
  note?: string; room?: string; delay?: number; isNow?: boolean
}

export default function ScheduleBlock({ s, e, title, cat, note, room, delay = 0, isNow = false }: Props) {
  const pal = COLORS[cat] ?? { c: '#687080', bg: 'rgba(104,112,128,0.09)' }
  return (
    <div className="sblock" style={{ animationDelay: `${delay}ms`, ...(isNow ? { borderColor: 'var(--amber)', background: 'rgba(200,146,42,0.07)' } : {}) }}>
      <div className="sblock-strip" style={{ background: pal.c }} />
      <div className="sblock-body">
        <div className="sblock-time">
          {s} – {e}
          {isNow && <span style={{ marginLeft:8, color:'var(--amber)', fontWeight:700, animation:'pulse 2s ease infinite', display:'inline-block' }}>● NOW</span>}
        </div>
        <div className="sblock-title">{title}</div>
        {note && <div className="sblock-note">{note}</div>}
        {room && <div className="sblock-note">📍 {room}</div>}
      </div>
      <span className="sblock-chip" style={{ background: pal.bg, color: pal.c, borderColor: pal.c + '44' }}>
        {cat}
      </span>
    </div>
  )
}
