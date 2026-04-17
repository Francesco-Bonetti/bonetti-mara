import { NextRequest, NextResponse } from 'next/server'
import { run } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!await getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as {
    titleIt: string; titleEn: string
    shortDescIt: string; shortDescEn: string
    longDescIt?: string; longDescEn?: string
    imageUrl: string; thumbUrl: string
    published?: boolean
  }

  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await run(
    `INSERT INTO paintings (id, title_it, title_en, short_desc_it, short_desc_en, long_desc_it, long_desc_en, image_url, thumb_url, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, body.titleIt, body.titleEn, body.shortDescIt, body.shortDescEn,
     body.longDescIt ?? null, body.longDescEn ?? null,
     body.imageUrl, body.thumbUrl, body.published ? 1 : 0, now, now]
  )

  return NextResponse.json({ id })
}
