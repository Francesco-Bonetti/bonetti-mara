import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
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

interface Neighbor {
  id: string
  title_it: string
  title_en: string
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

async function getNeighbors(id: string): Promise<{ prev: Neighbor | null; next: Neighbor | null }> {
  try {
    const rows = await query<{ id: string; title_it: string; title_en: string; created_at: string }>(
      `SELECT id, title_it, title_en, created_at FROM paintings WHERE published = 1 ORDER BY created_at DESC`
    )
    const idx = rows.findIndex((r) => r.id === id)
    return {
      prev: idx > 0 ? rows[idx - 1] : null,
      next: idx >= 0 && idx < rows.length - 1 ? rows[idx + 1] : null,
    }
  } catch {
    return { prev: null, next: null }
  }
}

export default async function PaintingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const painting = await getPainting(id)
  if (!painting) notFound()

  const { prev, next } = await getNeighbors(id)

  const title = locale === 'it' ? painting.title_it : painting.title_en
  const shortDesc = locale === 'it' ? painting.short_desc_it : painting.short_desc_en
  const longDesc = locale === 'it' ? painting.long_desc_it : painting.long_desc_en

  return (
    <article className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
      {/* Back */}
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-stone hover:text-ink transition-colors mb-10"
      >
        <span aria-hidden>←</span>
        {locale === 'it' ? 'Opere' : 'Works'}
      </Link>

      <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
        {/* Immagine */}
        <div className="md:col-span-7 md:sticky md:top-28">
          <div className="painting-frame">
            <Image
              src={painting.image_url}
              alt={title}
              width={1200}
              height={900}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-5 md:pt-4">
          <p className="eyebrow mb-5">{locale === 'it' ? 'Opera' : 'Work'}</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] italic text-balance mb-6">
            {title}
          </h1>

          {shortDesc && (
            <p className="text-[13px] tracking-[0.22em] uppercase text-stone mb-10">{shortDesc}</p>
          )}

          <div className="rule mb-8" />

          {longDesc && (
            <div className="font-serif text-[17px] leading-[1.85] text-ink/85 whitespace-pre-line text-pretty mb-10">
              {longDesc}
            </div>
          )}

          <div className="flex items-center gap-6">
            <LikeButton paintingId={painting.id} initialCount={Number(painting.like_count)} />
            <span className="text-[11px] tracking-[0.3em] uppercase text-stone">
              {locale === 'it' ? 'Mi piace' : 'Likes'}
            </span>
          </div>

          <div className="mt-14 pt-8 border-t border-ink/10">
            <p className="eyebrow mb-3">{locale === 'it' ? 'Informazioni' : 'Information'}</p>
            <p className="text-sm text-ink/65 leading-relaxed">
              {locale === 'it'
                ? "Pezzo unico, dipinto a mano e firmato dall'artista. Per richieste di disponibilità o acquisto, contattare direttamente Mara Bonetti."
                : 'Unique piece, hand-painted and signed by the artist. For availability or purchase enquiries, please contact Mara Bonetti directly.'}
            </p>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {(prev || next) && (
        <nav className="mt-24 pt-10 border-t border-ink/10 grid md:grid-cols-2 gap-6">
          {prev ? (
            <Link
              href={`/${locale}/quadri/${prev.id}`}
              className="group block"
            >
              <p className="eyebrow mb-2">{locale === 'it' ? '← Precedente' : '← Previous'}</p>
              <p className="font-serif text-xl italic text-ink/80 group-hover:text-ink transition-colors">
                {locale === 'it' ? prev.title_it : prev.title_en}
              </p>
            </Link>
          ) : <span />}
          {next ? (
            <Link
              href={`/${locale}/quadri/${next.id}`}
              className="group block md:text-right"
            >
              <p className="eyebrow mb-2">{locale === 'it' ? 'Successiva →' : 'Next →'}</p>
              <p className="font-serif text-xl italic text-ink/80 group-hover:text-ink transition-colors">
                {locale === 'it' ? next.title_it : next.title_en}
              </p>
            </Link>
          ) : <span />}
        </nav>
      )}
    </article>
  )
}
