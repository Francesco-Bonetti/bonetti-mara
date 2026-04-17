import { NextRequest, NextResponse } from 'next/server'
import { run, query } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json() as {
    titleIt?: string; titleEn?: string
    shortDescIt?: string; shortDescEn?: string
    longDescIt?: string; longDescEn?: string
    imageUrl?: string; thumbUrl?: string
    published?: boolean
  }

  await run(
    `UPDATE paintings SET
      title_it = COALESCE(?, title_it),
      title_en = COALESCE(?, title_en),
      short_desc_it = COALESCE(?, short_desc_it),
      short_desc_en = COALESCE(?, short_desc_en),
      long_desc_it = ?,
      long_desc_en = ?,
      image_url = COALESCE(?, image_url),
      thumb_url = COALESCE(?, thumb_url),
      published = COALESCE(?, published),
      updated_at = ?
    WHERE id = ?`,
    [body.titleIt ?? null, body.titleEn ?? null,
     body.shortDescIt ?? null, body.shortDescEn ?? null,
     body.longDescIt ?? null, body.longDescEn ?? null,
     body.imageUrl ?? null, body.thumbUrl ?? null,
     body.published !== undefined ? (body.published ? 1 : 0) : null,
     new Date().toISOString(), id]
  )

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await run('DELETE FROM paintings WHERE id = ?', [id])
  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const rows = await query('SELECT * FROM paintings WHERE id = ?', [id])
  return NextResponse.json(rows[0] ?? null)
}
