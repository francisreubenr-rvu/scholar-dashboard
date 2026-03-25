import { createClient } from '@/lib/supabase/server'
import WeekClient from './WeekClient'

export default async function WeekPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: custom } = await supabase
    .from('schedule_blocks')
    .select('*')
    .eq('user_id', user!.id)

  return <WeekClient initialCustom={custom || []} />
}
