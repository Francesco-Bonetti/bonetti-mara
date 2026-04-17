import Image from 'next/image'
import Link from 'next/link'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { formatDate } from '@/lib/utils'

interface Article {
  id: string
  slug: string
  title_it: string; title_en: string
  excerpt_it: string | null; excerpt_en: string | null
  cover_image_url: string | null
  created_at: string
}

async function getArticles(): Promise<Article[]> {
  try {
    return await query<Article>(`
      SELECT id, slug, title_it, title_en, excerpt_it, excerpt_en, cover_image_url, created_at
      FROM articles
      WHERE published = 1
      ORDER BY created_at DESC
    `)
  } catch { return [] }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const articles = await getArticles()

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl mb-16">Blog</h1>

      {articles.length === 0 ? (
        <p className="text-sm text-ink/30 tracking-widest uppercase">
          {locale === 'it' ? 'Articoli in arrivo' : 'Articles coming soon'}
        </p>
      ) : (
        <div className="space-y-16">
          {articles.map((a) => {
            const title = locale === 'it' ? a.title_it : a.title_en
            const excerpt = locale === 'it' ? a.excerpt_it : a.excerpt_en

            return (
              <article key={a.id} className="grid md:grid-cols-3 gap-8 items-start">
                {a.cover_image_url && (
                  <Link href={`/${locale}/blog/${a.slug}`} className="md:col-span-1">
                    <div className="relative aspect-[4/3] overflow-hidden painting-frame">
                      <Image src={a.cover_image_url} alt={title} fill className="object-cover hover:scale-[1.02] transition-transform duration-500" />
                    </div>
                  </Link>
                )}
                <div className={a.cover_image_url ? 'md:col-span-2' : 'md:col-span-3'}>
                  <p className="text-xs text-ink/30 tracking-widest uppercase mb-3">{formatDate(a.created_at, locale)}</p>
                  <h2 className="font-serif text-2xl mb-3">
                    <Link href={`/${locale}/blog/${a.slug}`} className="hover:opacity-60 transition-opacity">{title}</Link>
                  </h2>
                  {excerpt && <p className="text-sm leading-relaxed text-ink/60 mb-4">{excerpt}</p>}
                  <Link href={`/${locale}/blog/${a.slug}`} className="text-xs tracking-widest uppercase text-ink/40 hover:text-ink transition-colors">
                    {locale === 'it' ? 'Leggi →' : 'Read →'}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
