import { NextRequest, NextResponse } from 'next/server'
import { run, query } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const rows = await query('SELECT * FROM articles WHERE id = ?', [id])
  return NextResponse.json(rows[0] ?? null)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json() as {
    titleIt?: string; titleEn?: string
    excerptIt?: string; excerptEn?: string
    contentIt?: string; contentEn?: string
    coverImageUrl?: string; published?: boolean
  }

  await run(
    `UPDATE articles SET
      title_it = COALESCE(?, title_it),
      title_en = COALESCE(?, title_en),
      excerpt_it = ?,
      excerpt_en = ?,
      content_it = COALESCE(?, content_it),
      content_en = COALESCE(?, content_en),
      cover_image_url = ?,
      published = COALESCE(?, published),
      updated_at = ?
    WHERE id = ?`,
    [body.titleIt ?? null, body.titleEn ?? null,
     body.excerptIt ?? null, body.excerptEn ?? null,
     body.contentIt ?? null, body.contentEn ?? null,
     body.coverImageUrl ?? null,
     body.published !== undefined ? (body.published ? 1 : 0) : null,
     new Date().toISOString(), id]
  )

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await run('DELETE FROM articles WHERE id = ?', [id])
  return NextResponse.json({ ok: true })
}
