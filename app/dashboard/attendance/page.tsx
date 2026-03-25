import { createClient } from '@/lib/supabase/server'
import AttendanceClient from './AttendanceClient'

export default async function AttendancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: att } = await supabase
    .from('attendance')
    .select('subject_id, attended, total')
    .eq('user_id', user!.id)

  const attMap: Record<string, { a: number; t: number }> = {}
  att?.forEach(r => { attMap[r.subject_id] = { a: r.attended, t: r.total } })

  return <AttendanceClient initialAtt={attMap} userId={user!.id} />
}
