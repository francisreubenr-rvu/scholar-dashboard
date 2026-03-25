import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { subject_id, attended, total } = await req.json()

  const { error } = await supabase
    .from('attendance')
    .upsert(
      { user_id: user.id, subject_id, attended, total, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,subject_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
