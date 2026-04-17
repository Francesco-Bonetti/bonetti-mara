import Image from 'next/image'
import Link from 'next/link'
import { query } from '@/lib/db'
import LikeButton from '@/components/LikeButton'

export const dynamic = 'force-dynamic'

interface Painting {
  id: string
  title_it: string
  title_en: string
  short_desc_it: string
  short_desc_en: string
  image_url: string
  thumb_url: string
  like_count: number
}

async function getPaintings(): Promise<Painting[]> {
  try {
    return await query<Painting>(`
      SELECT p.id, p.title_it, p.title_en, p.short_desc_it, p.short_desc_en,
             p.image_url, p.thumb_url,
             COUNT(pl.id) as like_count
      FROM paintings p
      LEFT JOIN painting_likes pl ON pl.painting_id = p.id
      WHERE p.published = 1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `)
  } catch {
    return []
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const paintings = await getPaintings()

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Hero */}
      <div className="py-24 text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-wide mb-4">Mara Bonetti</h1>
        <p className="text-sm tracking-[0.3em] uppercase text-ink/40">
          {locale === 'it' ? 'Pittrice' : 'Painter'}
        </p>
      </div>

      {/* Gallery grid */}
      {paintings.length === 0 ? (
        <div className="text-center py-24 text-ink/30 text-sm tracking-widest uppercase">
          {locale === 'it' ? 'Le opere saranno disponibili a breve' : 'Works coming soon'}
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
          {paintings.map((p) => {
            const title = locale === 'it' ? p.title_it : p.title_en
            const shortDesc = locale === 'it' ? p.short_desc_it : p.short_desc_en

            return (
              <div key={p.id} className="painting-card group break-inside-avoid mb-8">
                <Link href={`/${locale}/quadri/${p.id}`}>
                  <div className="painting-frame mb-3">
                    <Image
                      src={p.thumb_url || p.image_url}
                      alt={title}
                      width={0}
                      height={0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm tracking-wide truncate">{shortDesc || title}</p>
                  </div>
                  <LikeButton paintingId={p.id} initialCount={Number(p.like_count)} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
