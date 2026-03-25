import { COLORS } from '@/lib/data'

interface Props {
  s: string; e: string; title: string; cat: string
  note?: string; room?: string; delay?: number
}

export default function ScheduleBlock({ s, e, title, cat, note, room, delay = 0 }: Props) {
  const pal = COLORS[cat] ?? { c: '#687080', bg: 'rgba(104,112,128,0.09)' }
  return (
    <div className="sblock" style={{ animationDelay: `${delay}ms` }}>
      <div className="sblock-strip" style={{ background: pal.c }} />
      <div className="sblock-body">
        <div className="sblock-time">{s} – {e}</div>
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
