import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
import { query } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import CommentSection from '@/components/CommentSection'

interface Article {
  id: string; slug: string
  title_it: string; title_en: string
  content_it: string; content_en: string
  excerpt_it: string | null; excerpt_en: string | null
  cover_image_url: string | null
  created_at: string
}
interface Comment {
  id: string; author_name: string; content: string; created_at: string
}

async function getArticle(slug: string) {
  const rows = await query<Article>('SELECT * FROM articles WHERE slug = ? AND published = 1', [slug])
  return rows[0] ?? null
}
async function getComments(articleId: string) {
  return query<Comment>('SELECT * FROM article_comments WHERE article_id = ? ORDER BY created_at ASC', [articleId])
}

function renderContent(contentJson: string): string {
  try {
    const doc = JSON.parse(contentJson) as { content: unknown[] }
    return jsonToHtml(doc.content)
  } catch {
    return `<p>${contentJson}</p>`
  }
}

function jsonToHtml(nodes: unknown[]): string {
  if (!Array.isArray(nodes)) return ''
  return nodes.map((node) => {
    const n = node as { type: string; text?: string; content?: unknown[]; marks?: { type: string }[]; attrs?: Record<string, string> }
    if (n.type === 'text') {
      let t = n.text ?? ''
      if (n.marks?.some((m) => m.type === 'bold')) t = `<strong>${t}</strong>`
      if (n.marks?.some((m) => m.type === 'italic')) t = `<em>${t}</em>`
      return t
    }
    const inner = jsonToHtml(n.content ?? [])
    switch (n.type) {
      case 'paragraph': return `<p>${inner}</p>`
      case 'heading': return `<h${n.attrs?.level ?? 2}>${inner}</h${n.attrs?.level ?? 2}>`
      case 'bulletList': return `<ul>${inner}</ul>`
      case 'orderedList': return `<ol>${inner}</ol>`
      case 'listItem': return `<li>${inner}</li>`
      case 'image': return `<img src="${n.attrs?.src ?? ''}" alt="${n.attrs?.alt ?? ''}" />`
      case 'hardBreak': return '<br/>'
      default: return inner
    }
  }).join('')
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const comments = await getComments(article.id)
  const title = locale === 'it' ? article.title_it : article.title_en
  const excerpt = locale === 'it' ? article.excerpt_it : article.excerpt_en
  const contentJson = locale === 'it' ? article.content_it : article.content_en
  const html = renderContent(contentJson)

  return (
    <article className="pb-16 md:pb-24">
      {/* Header */}
      <header className="max-w-3xl mx-auto px-5 md:px-10 pt-10 md:pt-24 pb-8 md:pb-10 text-center">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-stone hover:text-ink transition-colors mb-8 md:mb-10"
        >
          <span aria-hidden>←</span>
          {locale === 'it' ? 'Quaderno' : 'Journal'}
        </Link>

        <p className="eyebrow mb-5 md:mb-6">{formatDate(article.created_at, locale)}</p>

        <h1 className="font-serif text-[2.5rem] md:text-7xl leading-[1.05] font-light text-balance mb-6 md:mb-8">
          {title}
        </h1>

        {excerpt && (
          <p className="font-serif italic text-lg md:text-2xl text-ink/70 leading-snug max-w-2xl mx-auto text-pretty">
            {excerpt}
          </p>
        )}
      </header>

      {/* Cover */}
      {article.cover_image_url && (
        <div className="max-w-5xl mx-auto px-5 md:px-10 mb-10 md:mb-16">
          <div className="painting-frame">
            <Image
              src={article.cover_image_url}
              alt={title}
              width={1400}
              height={900}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      )}

      {/* Contenuto */}
      <div className="max-w-2xl mx-auto px-5 md:px-10">
        <div
          className="tiptap-content text-ink/90"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="rule mt-14 md:mt-20 mb-10 md:mb-12" />

        {/* Firma */}
        <p className="text-center font-serif italic text-xl text-stone mb-14 md:mb-20">— Mara</p>

        {/* Commenti */}
        <CommentSection articleSlug={slug} comments={comments} locale={locale} />
      </div>
    </article>
  )
}
