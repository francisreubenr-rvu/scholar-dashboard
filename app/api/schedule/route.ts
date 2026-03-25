import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST — create a new custom block
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { day, cat, start_time, end_time, title, note } = await req.json()
  if (!title || !start_time || !end_time || start_time >= end_time) {
    return NextResponse.json({ error: 'Invalid block data' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('schedule_blocks')
    .insert({ user_id: user.id, day, cat, start_time, end_time, title, note: note || '' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ block: data })
}

// DELETE — remove a custom block
export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()

  const { error } = await supabase
    .from('schedule_blocks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // RLS double-check

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
