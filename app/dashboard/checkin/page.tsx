import { createClient } from '@/lib/supabase/server'
import CheckinClient from './CheckinClient'

export default async function CheckinPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]
  const { data: checkins } = await supabase
    .from('checkins')
    .select('task_id, done')
    .eq('user_id', user!.id)
    .eq('date', today)

  const doneMap: Record<string, boolean> = {}
  checkins?.forEach(r => { doneMap[r.task_id] = r.done })

  return <CheckinClient initialDone={doneMap} userId={user!.id} />
}
