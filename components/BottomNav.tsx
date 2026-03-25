'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const p = usePathname()
  const links = [
    { href: '/dashboard',            label: 'Today',      icon: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { href: '/dashboard/week',       label: 'Week',       icon: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { href: '/dashboard/attendance', label: 'Attendance', icon: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  ]
  return (
    <nav className="bottom-nav">
      {links.map(l => (
        <Link key={l.href} href={l.href} className={`nav-btn${p === l.href ? ' active' : ''}`}>
          {l.icon}{l.label}
        </Link>
      ))}
    </nav>
  )
}
