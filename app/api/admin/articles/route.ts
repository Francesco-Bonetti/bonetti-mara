import { NextRequest, NextResponse } from 'next/server'
import { run } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'
import { createSlug } from '@/lib/utils'

export async function POST(req: NextRequest) {
  if (!await getAdminFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as {
    titleIt: string; titleEn: string
    excerptIt?: string; excerptEn?: string
    contentIt: string; contentEn: string
    coverImageUrl?: string
    slug?: string
    published?: boolean
  }

  const id = crypto.randomUUID()
  const slug = body.slug || createSlug(body.titleIt)
  const now = new Date().toISOString()

  await run(
    `INSERT INTO articles (id, slug, title_it, title_en, excerpt_it, excerpt_en, content_it, content_en, cover_image_url, published, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, slug, body.titleIt, body.titleEn,
     body.excerptIt ?? null, body.excerptEn ?? null,
     body.contentIt, body.contentEn,
     body.coverImageUrl ?? null,
     body.published ? 1 : 0, now, now]
  )

  return NextResponse.json({ id, slug })
}
