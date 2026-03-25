import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { date, task_id, done } = await req.json()

  const { error } = await supabase
    .from('checkins')
    .upsert(
      { user_id: user.id, date, task_id, done, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,date,task_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
