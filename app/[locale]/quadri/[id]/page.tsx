import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { query } from '@/lib/db'
import LikeButton from '@/components/LikeButton'

interface Painting {
  id: string
  title_it: string; title_en: string
  short_desc_it: string; short_desc_en: string
  long_desc_it: string | null; long_desc_en: string | null
  image_url: string
  like_count: number
}

async function getPainting(id: string): Promise<Painting | null> {
  const rows = await query<Painting>(`
    SELECT p.*, COUNT(pl.id) as like_count
    FROM paintings p
    LEFT JOIN painting_likes pl ON pl.painting_id = p.id
    WHERE p.id = ? AND p.published = 1
    GROUP BY p.id
  `, [id])
  return rows[0] ?? null
}

export default async function PaintingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const painting = await getPainting(id)
  if (!painting) notFound()

  const title = locale === 'it' ? painting.title_it : painting.title_en
  const shortDesc = locale === 'it' ? painting.short_desc_it : painting.short_desc_en
  const longDesc = locale === 'it' ? painting.long_desc_it : painting.long_desc_en

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href={`/${locale}`} className="text-xs tracking-widest uppercase text-ink/40 hover:text-ink transition-colors mb-12 inline-block">
        {locale === 'it' ? '← Opere' : '← Works'}
      </Link>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Image */}
        <div className="painting-frame relative">
          <Image
            src={painting.image_url}
            alt={title}
            width={800}
            height={1000}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Info */}
        <div className="py-4">
          <p className="text-sm tracking-wide mb-6 text-ink/60">{shortDesc}</p>

          <div className="mb-8">
            <LikeButton paintingId={painting.id} initialCount={Number(painting.like_count)} />
          </div>

          {longDesc && (
            <div className="border-t border-ink/10 pt-8">
              <p className="text-sm leading-relaxed text-ink/70 whitespace-pre-line">{longDesc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
