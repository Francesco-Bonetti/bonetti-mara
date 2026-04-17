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
  const contentJson = locale === 'it' ? article.content_it : article.content_en
  const html = renderContent(contentJson)

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href={`/${locale}/blog`} className="text-xs tracking-widest uppercase text-ink/40 hover:text-ink transition-colors mb-12 inline-block">
        ← Blog
      </Link>

      <p className="text-xs text-ink/30 tracking-widest uppercase mb-4">{formatDate(article.created_at, locale)}</p>
      <h1 className="font-serif text-4xl md:text-5xl mb-12 leading-tight">{title}</h1>

      {article.cover_image_url && (
        <div className="painting-frame mb-12">
          <Image src={article.cover_image_url} alt={title} width={800} height={500} className="w-full h-auto" />
        </div>
      )}

      <div
        className="tiptap-content text-sm leading-relaxed text-ink/80"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Comments */}
      <div className="mt-24 border-t border-ink/10 pt-16">
        <CommentSection articleSlug={slug} comments={comments} locale={locale} />
      </div>
    </div>
  )
}
