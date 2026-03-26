import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SUBJECTS } from '@/lib/data'
import SubjectCard from '@/components/SubjectCard'
import BottomNav from '@/components/BottomNav'
import ThemeToggle from '@/components/ThemeToggle'

export default async function AttendancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data } = await supabase.from('attendance').select('*').eq('user_id', user.id)
  const map: Record<string, { a: number; t: number }> = {}
  SUBJECTS.forEach(s => { map[s.id] = { a: 0, t: 0 } })
  data?.forEach(row => { map[row.subject_id] = { a: row.attended, t: row.total } })

  return (
    <>
      <div className="page-wrap">
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:'.2em', textTransform:'uppercase', color:'var(--amber)', marginBottom:8 }}>RV University · Sem 2</div>
          <div className="serif" style={{ fontSize:36, fontWeight:700, color:'var(--txt)', lineHeight:1 }}>Attendance</div>
        </div>
        <div style={{ display:'grid', gap:10 }}>
          {SUBJECTS.map(s => (
            <SubjectCard key={s.id} {...s} attended={map[s.id].a} total={map[s.id].t} userId={user.id} />
          ))}
        </div>
      </div>
      <ThemeToggle />
      <BottomNav />
    </>
  )
}
