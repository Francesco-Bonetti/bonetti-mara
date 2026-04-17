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
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-24">
      {/* Header */}
      <header className="grid md:grid-cols-12 gap-8 md:gap-10 mb-14 md:mb-28 pb-10 md:pb-14 border-b border-ink/10">
        <div className="md:col-span-7">
          <p className="eyebrow mb-5 md:mb-6">{locale === 'it' ? 'Quaderno' : 'Journal'}</p>
          <h1 className="font-serif text-[2.75rem] md:text-8xl font-light leading-[0.95] tracking-tight text-balance">
            {locale === 'it' ? (<>Appunti <span className="italic text-stone">dallo studio</span></>) : (<>Notes <span className="italic text-stone">from the studio</span></>)}
          </h1>
        </div>
        <div className="md:col-span-4 md:col-start-9 self-end">
          <p className="font-serif italic text-lg md:text-xl leading-snug text-ink/70 text-pretty">
            {locale === 'it'
              ? 'Pensieri sparsi sul dipingere, sui luoghi, sulle piccole cose che diventano opera.'
              : 'Scattered thoughts on painting, on places, on small things that become work.'}
          </p>
        </div>
      </header>

      {/* Articoli */}
      {articles.length === 0 ? (
        <div className="py-24 text-center">
          <p className="eyebrow">{locale === 'it' ? 'Articoli in arrivo' : 'Articles coming soon'}</p>
        </div>
      ) : (
        <div className="space-y-14 md:space-y-24">
          {articles.map((a, i) => {
            const title = locale === 'it' ? a.title_it : a.title_en
            const excerpt = locale === 'it' ? a.excerpt_it : a.excerpt_en
            const isFirst = i === 0

            return (
              <article
                key={a.id}
                className={`grid md:grid-cols-12 gap-6 md:gap-10 items-start ${isFirst ? '' : 'pt-14 md:pt-24 border-t border-ink/10'}`}
              >
                {a.cover_image_url && (
                  <Link href={`/${locale}/blog/${a.slug}`} className="md:col-span-6 group block">
                    <div className="painting-frame">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={a.cover_image_url}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </Link>
                )}
                <div className={a.cover_image_url ? 'md:col-span-5 md:col-start-8' : 'md:col-span-10 md:col-start-2'}>
                  <p className="eyebrow mb-4 md:mb-5">{formatDate(a.created_at, locale)}</p>
                  <h2 className="font-serif text-[1.75rem] md:text-4xl leading-tight mb-4 md:mb-5 text-balance">
                    <Link href={`/${locale}/blog/${a.slug}`} className="hover:italic transition-all">
                      {title}
                    </Link>
                  </h2>
                  {excerpt && (
                    <p className="text-[15px] md:text-[16px] leading-relaxed text-ink/70 mb-5 md:mb-6 text-pretty">{excerpt}</p>
                  )}
                  <Link
                    href={`/${locale}/blog/${a.slug}`}
                    className="inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-ink hover:gap-4 transition-all link-underline"
                  >
                    {locale === 'it' ? 'Continua a leggere' : 'Continue reading'}
                    <span aria-hidden>→</span>
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
