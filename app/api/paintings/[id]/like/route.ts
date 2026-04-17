import { NextRequest, NextResponse } from 'next/server'
import { query, run } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { sessionId } = await req.json() as { sessionId: string }

  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })

  // Check if like exists
  const existing = await query<{ id: string }>(
    'SELECT id FROM painting_likes WHERE painting_id = ? AND session_id = ?',
    [id, sessionId]
  )

  let liked: boolean
  if (existing.length > 0) {
    // Toggle off
    await run('DELETE FROM painting_likes WHERE painting_id = ? AND session_id = ?', [id, sessionId])
    liked = false
  } else {
    // Toggle on
    await run(
      'INSERT INTO painting_likes (id, painting_id, session_id, created_at) VALUES (?, ?, ?, ?)',
      [crypto.randomUUID(), id, sessionId, new Date().toISOString()]
    )
    liked = true
  }

  const [{ count }] = await query<{ count: number }>(
    'SELECT COUNT(*) as count FROM painting_likes WHERE painting_id = ?',
    [id]
  )

  return NextResponse.json({ liked, count: Number(count) })
}
