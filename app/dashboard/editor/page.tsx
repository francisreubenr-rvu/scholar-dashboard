import { createClient } from '@/lib/supabase/server'
import EditorClient from './EditorClient'

export default async function EditorPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: blocks } = await supabase
    .from('schedule_blocks')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: true })

  return <EditorClient initialBlocks={blocks || []} userId={user!.id} />
}
