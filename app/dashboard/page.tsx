import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { STOIC_QUOTES, CTT, PSCHED, SUBJECTS, todayIdx, greeting, nextExam } from '@/lib/data'
import TodayClient from './TodayClient'

export default async function TodayPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const di      = todayIdx()
  const dateKey = new Date().toISOString().split('T')[0]

  const [attRes, chkRes, blocksRes] = await Promise.all([
    supabase.from('attendance').select('*').eq('user_id', user!.id),
    supabase.from('checkins').select('*').eq('user_id', user!.id).eq('date', dateKey),
    supabase.from('schedule_blocks').select('*').eq('user_id', user!.id).eq('day', di),
  ])

  const attMap: Record<string, { a: number; t: number }> = {}
  SUBJECTS.forEach(s => { attMap[s.id] = { a: 0, t: 0 } })
  attRes.data?.forEach(row => { attMap[row.subject_id] = { a: row.attended, t: row.total } })

  const doneMap: Record<string, boolean> = {}
  chkRes.data?.forEach(row => { doneMap[row.task_id] = row.done })

  const customBlocks = (blocksRes.data || []).map(b => ({
    s: b.start_time, e: b.end_time, title: b.title,
    cat: b.cat, note: b.note, id: b.id,
  }))

  const qi      = Math.floor(Date.now() / 86400000) % STOIC_QUOTES.length
  const exam    = nextExam()
  const vals    = SUBJECTS.map(s => attMap[s.id].t > 0 ? (attMap[s.id].a / attMap[s.id].t) * 100 : null).filter((v): v is number => v !== null)
  const avgAtt  = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) + '%' : '—'

  return (
    <TodayClient
      dayIdx={di}
      greeting={greeting()}
      quote={STOIC_QUOTES[qi]}
      avgAtt={avgAtt}
      daysTocie={exam.days}
      collegeTT={CTT[di]}
      personalSchedule={PSCHED[di]}
      customBlocks={customBlocks}
      doneMap={doneMap}
      userId={user!.id}
      dateKey={dateKey}
    />
  )
}
