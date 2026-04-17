import { NextRequest, NextResponse } from 'next/server'
import { query, run } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { authorName, content } = await req.json() as { authorName: string; content: string }

  if (!authorName?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Get article id
  const articles = await query<{ id: string }>('SELECT id FROM articles WHERE slug = ? AND published = 1', [slug])
  if (!articles[0]) return NextResponse.json({ error: 'Article not found' }, { status: 404 })

  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await run(
    'INSERT INTO article_comments (id, article_id, author_name, content, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, articles[0].id, authorName.trim().slice(0, 80), content.trim().slice(0, 1000), now]
  )

  return NextResponse.json({ id, author_name: authorName.trim(), content: content.trim(), created_at: now })
}
